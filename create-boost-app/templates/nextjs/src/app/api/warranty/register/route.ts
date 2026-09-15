import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import WarrantyRegistration from '@/models/WarrantyRegistration';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, productName, ean, purchaseDate, purchaseLocation, proofOfPurchase } = body;

    if (!fullName || !email || !phone || !productName || !purchaseDate || !purchaseLocation) {
      return NextResponse.json(
        { success: false, error: 'All required warranty registration fields must be filled.' },
        { status: 400 }
      );
    }

    await dbConnect();

    const registration = await WarrantyRegistration.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      productName: productName.trim(),
      ean: ean ? ean.trim() : undefined,
      purchaseDate: new Date(purchaseDate),
      purchaseLocation: purchaseLocation.trim(),
      proofOfPurchase: proofOfPurchase || undefined,
      status: 'Pending Verification',
    });

    return NextResponse.json({
      success: true,
      message: 'Warranty successfully submitted for verification!',
      registrationId: registration._id,
    });
  } catch (error: any) {
    console.error('Warranty Registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to register warranty' },
      { status: 500 }
    );
  }
}
