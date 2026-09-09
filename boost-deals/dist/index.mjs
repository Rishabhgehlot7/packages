// src/engine.ts
var DealsEngine = class {
  /**
   * Calculates live remaining time until a deal ends
   */
  static calculateTimeRemaining(endsAt) {
    const end = typeof endsAt === "string" ? new Date(endsAt).getTime() : endsAt.getTime();
    const now = Date.now();
    const diff = Math.max(0, end - now);
    const totalSeconds = Math.floor(diff / 1e3);
    if (totalSeconds <= 0) {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        isExpired: true,
        formatted: "00h 00m 00s"
      };
    }
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds % 3600 / 60);
    const seconds = totalSeconds % 60;
    const pad = (n) => n.toString().padStart(2, "0");
    return {
      hours,
      minutes,
      seconds,
      totalSeconds,
      isExpired: false,
      formatted: `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`
    };
  }
  /**
   * Calculates percentage claimed and urgency label (Amazon Lightning Deals style)
   */
  static calculateClaimInfo(claimed, total) {
    const totalAvailable = Math.max(1, total);
    const claimedCount = Math.min(claimed, totalAvailable);
    const percentage = Math.min(100, Math.round(claimedCount / totalAvailable * 100));
    const isSoldOut = percentage >= 100;
    let urgencyText = `${percentage}% Claimed`;
    if (isSoldOut) {
      urgencyText = "100% Claimed (Sold Out)";
    } else if (percentage >= 80) {
      urgencyText = `Almost Gone! ${percentage}% Claimed`;
    }
    return {
      claimedCount,
      totalAvailable,
      percentageClaimed: percentage,
      isSoldOut,
      urgencyText
    };
  }
  /**
   * Applies deal pricing to a base price
   */
  static computeDealPrice(originalPrice, discountPercentage) {
    const savings = Math.round(originalPrice * discountPercentage / 100);
    const dealPrice = Math.max(0, originalPrice - savings);
    return { dealPrice, savings };
  }
};
export {
  DealsEngine
};
