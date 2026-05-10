import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      email,
      companyName,
      role,
      teamSize,
      primaryUseCase,
      monthlySavings,
      annualSavings,
    } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const { error } = await supabase.from('leads').insert([
      {
        email,
        company_name: companyName || null,
        role: role || null,
        team_size: teamSize || null,
        primary_use_case: primaryUseCase || null,
        monthly_savings: monthlySavings || 0,
        annual_savings: annualSavings || 0,
      },
    ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save lead.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Lead saved successfully.',
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}