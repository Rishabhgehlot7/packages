'use strict';

// src/engine.ts
var PROFANITY_LIST = [
  "scam",
  "fraud",
  "fake",
  "bastard",
  "bitch",
  "idiot",
  "stupid",
  "asshole",
  "bakwas",
  "chutiya",
  "gandu",
  "harami",
  "madarchod",
  "behenchod",
  "kutta",
  "kamina",
  "ghatiya",
  "lootera",
  "chor"
];
var ReviewsEngine = class {
  /**
   * Computes statistical star ratings, distribution, and recommendation percentage
   */
  static calculateBreakdown(reviews) {
    const totalCount = reviews.length;
    if (totalCount === 0) {
      return {
        average: 0,
        totalCount: 0,
        distribution: {
          5: { count: 0, percentage: 0 },
          4: { count: 0, percentage: 0 },
          3: { count: 0, percentage: 0 },
          2: { count: 0, percentage: 0 },
          1: { count: 0, percentage: 0 }
        },
        recommendationPercentage: 0
      };
    }
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    let recommendedCount = 0;
    for (const r of reviews) {
      const rating = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[rating]++;
      sum += rating;
      if (rating >= 4) {
        recommendedCount++;
      }
    }
    const average = Math.round(sum / totalCount * 10) / 10;
    const recommendationPercentage = Math.round(recommendedCount / totalCount * 100);
    return {
      average,
      totalCount,
      distribution: {
        5: { count: counts[5], percentage: Math.round(counts[5] / totalCount * 100) },
        4: { count: counts[4], percentage: Math.round(counts[4] / totalCount * 100) },
        3: { count: counts[3], percentage: Math.round(counts[3] / totalCount * 100) },
        2: { count: counts[2], percentage: Math.round(counts[2] / totalCount * 100) },
        1: { count: counts[1], percentage: Math.round(counts[1] / totalCount * 100) }
      },
      recommendationPercentage
    };
  }
  /**
   * Filters and sorts reviews with pinned reviews prioritized
   */
  static filterAndSort(reviews, options = {}) {
    let filtered = [...reviews];
    if (options.rating !== void 0) {
      filtered = filtered.filter((r) => Math.round(r.rating) === options.rating);
    }
    if (options.verifiedOnly) {
      filtered = filtered.filter((r) => r.verifiedBuyer);
    }
    if (options.withMediaOnly) {
      filtered = filtered.filter(
        (r) => r.images && r.images.length > 0 || r.videos && r.videos.length > 0
      );
    }
    if (options.searchQuery?.trim()) {
      const q = options.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (r) => r.body.toLowerCase().includes(q) || r.title?.toLowerCase().includes(q) || r.author.toLowerCase().includes(q)
      );
    }
    const sortBy = options.sortBy || "recent";
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;
      if (sortBy === "most_helpful") {
        const netA = (a.helpfulVotes || 0) - (a.unhelpfulVotes || 0);
        const netB = (b.helpfulVotes || 0) - (b.unhelpfulVotes || 0);
        return netB - netA;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    const offset = options.offset || 0;
    const limit = options.limit || filtered.length;
    return filtered.slice(offset, offset + limit);
  }
  /**
   * Helper to instantiate a valid sanitized ProductReview object
   */
  static createReview(params) {
    const rating = Math.min(5, Math.max(1, Math.round(params.rating)));
    if (!params.author.trim()) throw new Error("Author name is required");
    if (!params.body.trim()) throw new Error("Review content is required");
    return {
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      productId: params.productId,
      author: params.author.trim(),
      rating,
      title: params.title?.trim(),
      body: params.body.trim(),
      verifiedBuyer: Boolean(params.verifiedBuyer),
      images: params.images || [],
      videos: params.videos || [],
      helpfulVotes: 0,
      unhelpfulVotes: 0,
      status: "approved",
      sentiment: rating >= 4 ? "positive" : rating === 3 ? "neutral" : "negative",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  /**
   * AI-Powered Sentiment Analysis & Highlights Consensus Engine
   */
  static analyzeSentiment(reviews) {
    if (reviews.length === 0) {
      return {
        score: 0,
        positivePercentage: 0,
        neutralPercentage: 0,
        negativePercentage: 0,
        topPositiveTags: [],
        topNegativeTags: [],
        consensusHighlights: [],
        summary: "No customer reviews available yet."
      };
    }
    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;
    const positiveKeywords = ["quality", "fit", "comfortable", "great", "love", "fast", "good", "perfect", "soft", "value", "recommend", "worth", "durable"];
    const negativeKeywords = ["bad", "poor", "worst", "small", "tight", "loose", "late", "rough", "fake", "damaged", "cheap", "slow", "return"];
    const positiveTagMap = {};
    const negativeTagMap = {};
    for (const r of reviews) {
      const text = `${r.title || ""} ${r.body}`.toLowerCase();
      const rating = r.rating;
      if (rating >= 4) {
        positiveCount++;
      } else if (rating === 3) {
        neutralCount++;
      } else {
        negativeCount++;
      }
      for (const kw of positiveKeywords) {
        if (text.includes(kw)) {
          positiveTagMap[kw] = (positiveTagMap[kw] || 0) + 1;
        }
      }
      for (const kw of negativeKeywords) {
        if (text.includes(kw)) {
          negativeTagMap[kw] = (negativeTagMap[kw] || 0) + 1;
        }
      }
    }
    const total = reviews.length;
    const positivePercentage = Math.round(positiveCount / total * 100);
    const neutralPercentage = Math.round(neutralCount / total * 100);
    const negativePercentage = Math.round(negativeCount / total * 100);
    const breakdown = this.calculateBreakdown(reviews);
    const score = Math.round(breakdown.average / 5 * 100);
    const topPositiveTags = Object.keys(positiveTagMap).sort((a, b) => positiveTagMap[b] - positiveTagMap[a]).slice(0, 5).map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1));
    const topNegativeTags = Object.keys(negativeTagMap).sort((a, b) => negativeTagMap[b] - negativeTagMap[a]).slice(0, 5).map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1));
    const consensusHighlights = [];
    if (positivePercentage >= 70) consensusHighlights.push(`${positivePercentage}% of buyers highly recommend this product`);
    if (topPositiveTags.length > 0) consensusHighlights.push(`Customers praise the ${topPositiveTags.slice(0, 3).join(", ")}`);
    if (topNegativeTags.length > 0 && negativePercentage > 15) consensusHighlights.push(`Some buyers noted issues with ${topNegativeTags.slice(0, 2).join(", ")}`);
    const summary = this.generateAISummary(reviews);
    return {
      score,
      positivePercentage,
      neutralPercentage,
      negativePercentage,
      topPositiveTags,
      topNegativeTags,
      consensusHighlights,
      summary
    };
  }
  /**
   * Generates a crisp, high-converting 1-paragraph summary of reviews
   */
  static generateAISummary(reviews) {
    if (reviews.length === 0) return "No reviews available yet.";
    const breakdown = this.calculateBreakdown(reviews);
    const count = reviews.length;
    let sentimentDescriptor = "exceptional praise";
    if (breakdown.average >= 4.5) sentimentDescriptor = "overwhelmingly positive acclaim";
    else if (breakdown.average >= 4) sentimentDescriptor = "strong positive feedback";
    else if (breakdown.average >= 3) sentimentDescriptor = "mixed customer satisfaction";
    else sentimentDescriptor = "critical customer feedback";
    return `Based on ${count} verified review${count > 1 ? "s" : ""}, this item holds an average rating of ${breakdown.average.toFixed(1)}/5 with ${breakdown.recommendationPercentage}% customer satisfaction. Reviewers highlight ${sentimentDescriptor} for overall value and experience.`;
  }
  /**
   * Automatic Profanity, Abusive Language & Spam Guard
   */
  static moderateReview(text, options = {}) {
    const reasons = [];
    let cleanText = text;
    let profanityCount = 0;
    const lower = text.toLowerCase();
    for (const badWord of PROFANITY_LIST) {
      const regex = new RegExp(`\\b${badWord}\\b`, "gi");
      if (regex.test(lower)) {
        profanityCount++;
        cleanText = cleanText.replace(regex, "***");
      }
    }
    if (profanityCount > 0) {
      reasons.push(`Contains ${profanityCount} offensive or inappropriate word(s)`);
    }
    const urlPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(\.com|\.in|\.org|\.net)\b/gi;
    if (urlPattern.test(text)) {
      reasons.push("Contains promotional external links or URLs");
      cleanText = cleanText.replace(urlPattern, "[link removed]");
    }
    const maxRepeat = options.maxRepeatedChars || 4;
    const repeatPattern = new RegExp(`(.)\\1{${maxRepeat},}`, "g");
    if (repeatPattern.test(text)) {
      reasons.push("Contains excessive character repetition or spam pattern");
      cleanText = cleanText.replace(repeatPattern, "$1$1");
    }
    if (text.trim().length < 3) {
      reasons.push("Review content is too short");
    }
    const flagged = reasons.length > 0;
    return {
      approved: !flagged,
      flagged,
      reasons,
      sanitizedText: cleanText,
      profanityCount
    };
  }
  /**
   * Calculates loyalty reward points for review submissions (Bridge for boost-loyalty)
   */
  static calculateRewards(review, config = {}) {
    const textReward = config.textRewardPoints ?? 50;
    const photoReward = config.photoRewardPoints ?? 100;
    const videoReward = config.videoRewardPoints ?? 200;
    const minWords = config.minWordCount ?? 5;
    const wordCount = review.body.trim().split(/\s+/).length;
    const hasValidText = wordCount >= minWords;
    const hasPhoto = (review.images && review.images.length > 0) ?? false;
    const hasVideo = (review.videos && review.videos.length > 0) ?? false;
    let points = 0;
    const reasons = [];
    const breakdown = { text: 0, photo: 0, video: 0 };
    if (hasValidText) {
      breakdown.text = textReward;
      points += textReward;
      reasons.push(`+${textReward} pts for detailed text review (${wordCount} words)`);
    }
    if (hasPhoto) {
      breakdown.photo = photoReward;
      points += photoReward;
      reasons.push(`+${photoReward} pts for uploading photo proof`);
    }
    if (hasVideo) {
      breakdown.video = videoReward;
      points += videoReward;
      reasons.push(`+${videoReward} pts for uploading video review`);
    }
    return {
      eligible: points > 0,
      totalPoints: points,
      breakdown,
      reasons
    };
  }
  /**
   * Formats reviews directly into Schema.org AggregateRating and Review snippets
   */
  static toSchemaOrg(reviews) {
    const breakdown = this.calculateBreakdown(reviews);
    if (breakdown.totalCount === 0) return null;
    return {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: breakdown.average,
        reviewCount: breakdown.totalCount,
        bestRating: 5,
        worstRating: 1
      },
      review: reviews.slice(0, 10).map((r) => ({
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1
        },
        author: {
          "@type": "Person",
          name: r.author
        },
        reviewBody: r.body,
        datePublished: r.createdAt.split("T")[0]
      }))
    };
  }
  /**
   * Generates Complete Google SEO Product Rich Snippet JSON-LD
   */
  static generateFullJSONLD(params) {
    const schema = this.toSchemaOrg(params.reviews);
    if (!schema) return null;
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: params.product.name,
      image: params.product.image,
      description: params.product.description,
      brand: params.product.brand ? {
        "@type": "Brand",
        name: params.product.brand
      } : void 0,
      offers: params.product.price ? {
        "@type": "Offer",
        priceCurrency: params.product.currency || "INR",
        price: params.product.price,
        availability: "https://schema.org/InStock"
      } : void 0,
      aggregateRating: schema.aggregateRating,
      review: schema.review
    };
  }
  /**
   * Deduplicated Helpful / Unhelpful vote tracker
   */
  static voteHelpful(review, userIdentifier, isHelpful, historyMap) {
    const key = `${review.id}_${userIdentifier}`;
    const previousVote = historyMap.get(key);
    let helpfulVotes = review.helpfulVotes || 0;
    let unhelpfulVotes = review.unhelpfulVotes || 0;
    if (previousVote === (isHelpful ? "helpful" : "unhelpful")) {
      return { review, changed: false };
    }
    if (previousVote === "helpful") helpfulVotes = Math.max(0, helpfulVotes - 1);
    if (previousVote === "unhelpful") unhelpfulVotes = Math.max(0, unhelpfulVotes - 1);
    if (isHelpful) {
      helpfulVotes++;
      historyMap.set(key, "helpful");
    } else {
      unhelpfulVotes++;
      historyMap.set(key, "unhelpful");
    }
    const updatedReview = {
      ...review,
      helpfulVotes,
      unhelpfulVotes
    };
    return { review: updatedReview, changed: true };
  }
  /**
   * Developer-Friendly Quick Submit with automated moderation & sanitization
   */
  static quickSubmit(input, autoModerate = true) {
    const moderation = autoModerate ? this.moderateReview(`${input.title || ""} ${input.body}`) : { approved: true, flagged: false, reasons: [], sanitizedText: input.body, profanityCount: 0 };
    const review = this.createReview({
      ...input,
      body: moderation.sanitizedText
    });
    if (moderation.flagged) {
      review.status = "pending";
    }
    return { review, moderation };
  }
};

// src/agent.ts
var ReviewsAgentToolkit = class {
  /**
   * Universal Agent Tool Definitions (JSON Schema compliant)
   */
  getDeclarations() {
    return [
      {
        name: "analyze_product_reviews",
        description: "Analyze an array of customer reviews for a product to calculate statistical star ratings, sentiment percentages, key positive/negative tags, and generate an executive summary.",
        parameters: {
          type: "object",
          properties: {
            reviews: {
              type: "array",
              description: "List of product review objects.",
              items: {
                type: "object",
                properties: {
                  rating: { type: "number" },
                  author: { type: "string" },
                  body: { type: "string" },
                  title: { type: "string" }
                },
                required: ["rating", "author", "body"]
              }
            }
          },
          required: ["reviews"]
        }
      },
      {
        name: "submit_customer_review",
        description: "Submit a new customer product review with automated profanity check, spam detection, and star rating validation.",
        parameters: {
          type: "object",
          properties: {
            productId: { type: "string", description: "Product ID being reviewed." },
            author: { type: "string", description: "Reviewer name or nickname." },
            rating: { type: "number", minimum: 1, maximum: 5, description: "Star rating from 1 to 5." },
            title: { type: "string", description: "Review headline or short title." },
            body: { type: "string", description: "Detailed review content." },
            verifiedBuyer: { type: "boolean", description: "Whether the reviewer has verified order purchase history." },
            images: { type: "array", items: { type: "string" }, description: "URLs of uploaded review photos." },
            videos: { type: "array", items: { type: "string" }, description: "URLs of uploaded review videos." }
          },
          required: ["productId", "author", "rating", "body"]
        }
      },
      {
        name: "moderate_review",
        description: "Scan and sanitize review content for abusive profanity, offensive language, spam URLs, and repeated characters.",
        parameters: {
          type: "object",
          properties: {
            text: { type: "string", description: "The review title or body text to audit." }
          },
          required: ["text"]
        }
      },
      {
        name: "generate_merchant_reply",
        description: "Craft a professional, brand-aligned merchant reply addressing customer praise, concerns, or defects.",
        parameters: {
          type: "object",
          properties: {
            author: { type: "string", description: "Customer name." },
            rating: { type: "number", description: "Customer rating (1-5)." },
            reviewBody: { type: "string", description: "Customer review text." },
            merchantName: { type: "string", description: "Brand or Store Name." }
          },
          required: ["author", "rating", "reviewBody"]
        }
      },
      {
        name: "generate_rich_snippets",
        description: "Generate valid Schema.org Product and AggregateRating JSON-LD for Google Search Rich Results (star ratings in SERP).",
        parameters: {
          type: "object",
          properties: {
            productName: { type: "string", description: "Name of the product." },
            price: { type: "number", description: "Price in local currency." },
            currency: { type: "string", description: "Currency code (e.g. INR, USD)." },
            reviews: {
              type: "array",
              description: "Array of customer reviews.",
              items: {
                type: "object",
                properties: {
                  rating: { type: "number" },
                  author: { type: "string" },
                  body: { type: "string" },
                  createdAt: { type: "string" }
                },
                required: ["rating", "author", "body"]
              }
            }
          },
          required: ["productName", "reviews"]
        }
      }
    ];
  }
  /**
   * OpenAI Tools Format
   */
  getOpenAITools() {
    return this.getDeclarations().map((tool) => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters
      }
    }));
  }
  /**
   * Anthropic Claude Tools Format
   */
  getAnthropicTools() {
    return this.getDeclarations().map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.parameters
    }));
  }
  /**
   * Google Gemini API Tool Declarations Format
   */
  getGeminiTools() {
    return [
      {
        functionDeclarations: this.getDeclarations().map((tool) => ({
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters
        }))
      }
    ];
  }
  /**
   * Vercel AI SDK Tool Format
   */
  getVercelAITools() {
    const toolsObj = {};
    for (const tool of this.getDeclarations()) {
      toolsObj[tool.name] = {
        description: tool.description,
        parameters: tool.parameters,
        execute: async (args) => this.execute(tool.name, args)
      };
    }
    return toolsObj;
  }
  /**
   * Execute an Agent Tool Invocation by Name
   */
  async execute(toolName, args) {
    switch (toolName) {
      case "analyze_product_reviews": {
        const reviews = args.reviews || [];
        const breakdown = ReviewsEngine.calculateBreakdown(reviews);
        const sentiment = ReviewsEngine.analyzeSentiment(reviews);
        return {
          breakdown,
          sentiment
        };
      }
      case "submit_customer_review": {
        const input = args;
        return ReviewsEngine.quickSubmit(input);
      }
      case "moderate_review": {
        return ReviewsEngine.moderateReview(args.text || "");
      }
      case "generate_merchant_reply": {
        const { author, rating, reviewBody, merchantName } = args;
        const brand = merchantName || "Store Team";
        let replyText = "";
        if (rating >= 4) {
          replyText = `Thank you so much for your wonderful feedback, ${author}! We are thrilled to hear that you loved your purchase. Warm regards, ${brand}.`;
        } else if (rating === 3) {
          replyText = `Hi ${author}, thank you for your honest feedback! We strive for 100% satisfaction and would love to make this even better for you. Please reach out to our support team so we can assist. - ${brand}`;
        } else {
          replyText = `Hi ${author}, we are truly sorry that your experience did not meet expectations. Your satisfaction is our top priority. Please contact our dedicated resolution team directly so we can make this right immediately. - ${brand}`;
        }
        return {
          reply: {
            author: brand,
            body: replyText,
            date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
          }
        };
      }
      case "generate_rich_snippets": {
        const { productName, price, currency, reviews } = args;
        return ReviewsEngine.generateFullJSONLD({
          product: {
            name: productName,
            price,
            currency: currency || "INR"
          },
          reviews: reviews || []
        });
      }
      default:
        throw new Error(`Unknown reviews agent tool: ${toolName}`);
    }
  }
};
var agentToolkit = new ReviewsAgentToolkit();

exports.ReviewsAgentToolkit = ReviewsAgentToolkit;
exports.ReviewsEngine = ReviewsEngine;
exports.agentToolkit = agentToolkit;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map