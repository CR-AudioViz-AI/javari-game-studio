import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kteobfyferrukqeolofj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// GET /api/support/tickets - Get user's tickets
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

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
    const userId = request.headers.get('x-user-id');

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
