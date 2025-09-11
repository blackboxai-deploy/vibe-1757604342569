import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, amount, userId, bankDetails } = body;

    // Validation
    if (!type || !amount || !userId) {
      return NextResponse.json(
        { success: false, error: 'Type, amount, and userId are required' },
        { status: 400 }
      );
    }

    if (amount < 100) {
      return NextResponse.json(
        { success: false, error: 'Minimum amount is ₹100' },
        { status: 400 }
      );
    }

    if (amount > 500000) {
      return NextResponse.json(
        { success: false, error: 'Maximum amount is ₹5,00,000 per transaction' },
        { status: 400 }
      );
    }

    // Create transaction record
    const transaction = {
      id: `txn_${Date.now()}`,
      userId,
      type,
      amount,
      bankDetails: bankDetails || null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // In a real app, save to database
    console.log('Transaction created:', transaction);

    return NextResponse.json({
      success: true,
      data: transaction,
      message: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} request created successfully`
    });

  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}