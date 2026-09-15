import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import ContactQuery from '@/models/ContactQuery';

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const query = await ContactQuery.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : undefined,
      message: message.trim(),
      status: 'Pending',
    });

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully!',
      queryId: query._id,
    });
  } catch (error: any) {
    console.error('Contact query error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit message' },
      { status: 500 }
    );
  }
}
