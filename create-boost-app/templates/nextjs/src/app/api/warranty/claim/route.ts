import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import WarrantyClaim from '@/models/WarrantyClaim';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, manualOrderId, manualProductName, issueType, description, images } = body;

    if (!fullName || !email || !phone || !issueType || !description) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, phone, issue type, and description are required.' },
        { status: 400 }
      );
    }

    await dbConnect();

    const claim = await WarrantyClaim.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      manualOrderId: manualOrderId ? manualOrderId.trim() : undefined,
      manualProductName: manualProductName ? manualProductName.trim() : undefined,
      issueType,
      description: description.trim(),
      images: Array.isArray(images) ? images : [],
      isDirectClaim: true,
      status: 'Claim Submitted',
    });

    return NextResponse.json({
      success: true,
      message: 'Warranty claim submitted successfully. Our support team will review it within 48 hours.',
      claimId: claim._id,
    });
  } catch (error: any) {
    console.error('Warranty Claim error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit warranty claim' },
      { status: 500 }
    );
  }
}
