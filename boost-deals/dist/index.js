"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  DealsEngine: () => DealsEngine
});
module.exports = __toCommonJS(index_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DealsEngine
});
