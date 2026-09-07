import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { secretKey, supabaseUrl } from "@craudioviz/platform-sdk";

const supabase = createClient(
  supabaseUrl(),
  secretKey()
);

// GET /api/credits - Get user's credit balance

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
    // Get user from auth header or session
    const authHeader = request.headers.get('authorization');
    const userId = await callerId(request);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return NextResponse.json({ balance: 0 });
    }

    return NextResponse.json({ balance: user.credits });
  } catch (error) {
    console.error('Get credits error:', error);
    return NextResponse.json({ error: 'Failed to get balance' }, { status: 500 });
  }
}

// POST /api/credits - Use credits
export async function POST(request: NextRequest) {
  try {
    const { amount, description, referenceId } = await request.json();
    const userId = await callerId(request);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Get current balance
    const { data: user } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single();

    const currentCredits = user?.credits || 0;

    if (currentCredits < amount) {
      return NextResponse.json({ 
        error: 'Insufficient credits',
        balance: currentCredits,
        required: amount,
      }, { status: 400 });
    }

    // Deduct credits
    await supabase
      .from('users')
      .update({ 
        credits: currentCredits - amount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    // Log transaction
    await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount: -amount,
      type: 'usage',
      description: description || 'Credit usage',
      app_id: 'game-studio',
      reference_id: referenceId,
    });

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: userId,
      action: 'credits.used',
      app_id: 'game-studio',
      resource_type: 'credits',
      metadata: { amount, description, referenceId },
    });

    return NextResponse.json({ 
      success: true,
      balance: currentCredits - amount,
    });
  } catch (error) {
    console.error('Use credits error:', error);
    return NextResponse.json({ error: 'Failed to use credits' }, { status: 500 });
  }
}
