import { NextResponse } from 'next/server';
import { initialProducts, StoreProduct } from '../../../../data/products';

export async function POST(req: Request) {
  try {
    const { message, conversationHistory } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const lowerQuery = message.toLowerCase();

    // 1. Budget extraction (e.g. ₹5000, 2000, under 1500, under 50k, 50,000)
    let maxBudget: number | null = null;
    const budgetMatch = lowerQuery.match(/(?:under|below|budget|mein|me|ke andar)?\s*(?:₹|rs\.?|inr)?\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)\s*(k|thousand|lakh)?/i);
    
    if (budgetMatch && budgetMatch[1]) {
      let num = parseFloat(budgetMatch[1].replace(/,/g, ''));
      const unit = (budgetMatch[2] || '').toLowerCase();
      if (unit === 'k' || unit === 'thousand') num *= 1000;
      if (unit === 'lakh') num *= 100000;
      if (num > 100) {
        maxBudget = num;
      }
    }

    // 2. Keyword & category filtering
    const keywords = lowerQuery
      .replace(/[^\w\s]/gi, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !['bhai', 'mujhe', 'chahiye', 'kuch', 'under', 'wala', 'wali', 'best', 'good', 'show', 'options', 'please'].includes(w));

    let matchedProducts: StoreProduct[] = initialProducts.filter((p) => {
      // Budget check
      const effectivePrice = p.salePrice || p.price;
      if (maxBudget !== null && effectivePrice > maxBudget) {
        return false;
      }
      return true;
    });

    if (keywords.length > 0) {
      matchedProducts = matchedProducts
        .map((p) => {
          let score = 0;
          const searchCorpus = `${p.title} ${p.category} ${p.tags.join(' ')} ${p.description}`.toLowerCase();
          for (const kw of keywords) {
            if (searchCorpus.includes(kw)) score += 2;
          }
          return { product: p, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.product);
    }

    // Fallback if no specific keyword match
    if (matchedProducts.length === 0) {
      matchedProducts = initialProducts.slice(0, 3);
    } else {
      matchedProducts = matchedProducts.slice(0, 3);
    }

    // 3. Generate conversational AI response
    let aiReply = '';
    const budgetText = maxBudget ? `₹${maxBudget.toLocaleString('en-IN')}` : '';

    if (maxBudget && matchedProducts.length > 0) {
      aiReply = `Bhai ${budgetText} ke andar tere liye best options ye hain! Inki quality aur customer ratings top-tier hain:`;
    } else if (keywords.length > 0 && matchedProducts.length > 0) {
      aiReply = `Bhai tere query ke according maine catalog se top recommendations select kiye hain:`;
    } else {
      aiReply = `Bhai ye rahe humare current best sellers jo customers sabse zyada pasand kar rahe hain:`;
    }

    return NextResponse.json({
      reply: aiReply,
      products: matchedProducts.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.salePrice || p.price,
        compareAtPrice: p.compareAtPrice,
        image: p.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80',
        rating: p.rating?.value || 4.8,
        inStock: p.inStock,
        category: p.category,
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'AI Assistant service error' },
      { status: 500 }
    );
  }
}
