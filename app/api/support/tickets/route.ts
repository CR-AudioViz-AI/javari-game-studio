import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { secretKey, supabaseUrl } from "@craudioviz/platform-sdk";

const supabase = createClient(
  supabaseUrl(),
  secretKey()
);

// GET /api/support/tickets - Get user's tickets

/**
 * 2026-09-11: the caller's identity comes from their token, never from a header.
 *
 * Both handlers read x-user-id from the request with the comment "Set by
 * middleware". THERE IS NO MIDDLEWARE IN THIS REPOSITORY. The header came
 * straight from the caller, so anyone could read or spend any account's credits
 * by setting one line in a request.
 *
 * The comment is what makes this dangerous rather than obvious. A reviewer
 * checking whether identity was handled saw a plausible explanation and moved
 * on - the same shape as the ownership filter that said "verify ownership" and
 * applied it only when a parameter happened to be present.
 *
 * Found by the route-auth guard failing this repository's own build, which is
 * the guard doing exactly what it exists for.
 */
async function callerId(request: NextRequest): Promise<string | null> {
  const header = request.headers.get('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;
  if (!token) return null;
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return null;
    return data.user.id as string;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await callerId(request);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: tickets, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(tickets || []);
  } catch (error) {
    console.error('Get tickets error:', error);
    return NextResponse.json({ error: 'Failed to get tickets' }, { status: 500 });
  }
}

// POST /api/support/tickets - Create new ticket
export async function POST(request: NextRequest) {
  try {
    const { category, subject, description, priority = 'medium' } = await request.json();
    const userId = await callerId(request);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!category || !subject || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create ticket
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: userId,
        category,
        subject,
        description,
        priority,
        status: 'open',
        app_id: 'game-studio',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: userId,
      action: 'support.ticket_created',
      app_id: 'game-studio',
      resource_type: 'support_ticket',
      resource_id: ticket.id,
      metadata: { category, priority },
    });

    // Track CRM event
    await supabase.from('crm_events').insert({
      user_id: userId,
      event: 'support_ticket_created',
      properties: { category, priority, ticketId: ticket.id },
      app_id: 'game-studio',
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Create ticket error:', error);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}
