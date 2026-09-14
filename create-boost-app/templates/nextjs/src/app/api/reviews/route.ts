import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';
import Product from '@/models/Product';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required.' },
        { status: 400 }
      );
    }

    try {
      const conn = await dbConnect();
      if (conn && Review) {
        const reviews = await Review.find({ productId }).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ success: true, count: reviews.length, data: reviews });
      }
    } catch (dbErr) {
      console.warn('MongoDB review fetch failed:', dbErr);
    }

    return NextResponse.json({ success: true, count: 0, data: [] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, author, rating, title, comment } = body;

    if (!productId || !author || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: 'Product ID, author, rating, and comment are required.' },
        { status: 400 }
      );
    }

    try {
      const conn = await dbConnect();
      if (conn && Review) {
        const newReview = await Review.create({
          productId,
          author: author.trim(),
          rating: Number(rating),
          title: title ? title.trim() : '',
          comment: comment.trim(),
          verifiedBuyer: true,
        });

        // Update product review count & average rating if Product exists
        if (Product) {
          const allReviews = await Review.find({ productId });
          const count = allReviews.length;
          const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / count;
          await Product.findOneAndUpdate(
            { $or: [{ id: productId }, { _id: productId }] },
            { $set: { 'rating.value': Number(avg.toFixed(1)), 'rating.count': count } }
          );
        }

        return NextResponse.json({ success: true, data: newReview }, { status: 201 });
      }
    } catch (dbErr: any) {
      console.warn('MongoDB review save failed:', dbErr.message);
    }

    return NextResponse.json(
      { success: true, data: { id: `rev_${Date.now()}`, ...body } },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to post review' },
      { status: 500 }
    );
  }
}
