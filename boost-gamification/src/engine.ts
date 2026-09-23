import { RewardSlice, SpinOutcome } from './types';

/**
 * Calculates weighted random winner and rotation angle for wheel spinning.
 */
export function calculateSpinOutcome(
  slices: RewardSlice[],
  rotations: number = 5,
  currentAngle: number = 0
): SpinOutcome {
  if (!slices || slices.length === 0) {
    throw new Error('Spin wheel must have at least 1 slice.');
  }

  // 1. Calculate total weight
  const totalWeight = slices.reduce((acc, slice) => acc + Math.max(0, slice.probabilityWeight), 0);
  if (totalWeight <= 0) {
    throw new Error('Total slice probability weight must be greater than 0.');
  }

  // 2. Select winning slice based on random weight
  const random = Math.random() * totalWeight;
  let runningWeight = 0;
  let winningIndex = 0;

  for (let i = 0; i < slices.length; i++) {
    runningWeight += Math.max(0, slices[i].probabilityWeight);
    if (random <= runningWeight) {
      winningIndex = i;
      break;
    }
  }

  const winningSlice = slices[winningIndex];

  // 3. Calculate target stopping angle
  const sliceAngle = 360 / slices.length;
  // Pointer is at 0 degrees (top or right depending on UI), we aim for the center of the winning slice
  const sliceCenterAngle = (winningIndex * sliceAngle) + (sliceAngle / 2);
  const targetAngle = (360 * rotations) + (360 - sliceCenterAngle) + (currentAngle % 360);

  return {
    winningSlice,
    winningIndex,
    targetAngle: Math.round(targetAngle),
    couponCode: winningSlice.couponCode,
    discountText: formatRewardDisplay(winningSlice),
  };
}

/**
 * Formats reward into human-readable text.
 */
export function formatRewardDisplay(reward: RewardSlice): string {
  if (reward.isLosingSlice || reward.discountType === 'no_reward') {
    return 'Better luck next time!';
  }
  if (reward.discountType === 'percentage') {
    return `${reward.discountValue}% OFF`;
  }
  if (reward.discountType === 'fixed_amount') {
    return `₹${reward.discountValue} OFF`;
  }
  if (reward.discountType === 'free_shipping') {
    return 'Free Express Delivery';
  }
  return reward.label;
}

/**
 * Computes percentage of scratch card canvas that has been cleared.
 */
export function calculateScratchPercentage(revealedPixels: number, totalPixels: number): number {
  if (totalPixels <= 0) return 0;
  const pct = (revealedPixels / totalPixels) * 100;
  return Math.min(100, Math.round(pct * 10) / 10);
}

/**
 * Checks if customer is eligible to play again based on cooldown days.
 */
export function checkCooldownEligibility(
  lastPlayedTimestamp?: number,
  cooldownDays: number = 7
): { isEligible: boolean; daysRemaining: number } {
  if (!lastPlayedTimestamp) {
    return { isEligible: true, daysRemaining: 0 };
  }

  const now = Date.now();
  const cooldownMs = cooldownDays * 24 * 60 * 60 * 1000;
  const elapsed = now - lastPlayedTimestamp;

  if (elapsed >= cooldownMs) {
    return { isEligible: true, daysRemaining: 0 };
  }

  const remainingMs = cooldownMs - elapsed;
  const daysRemaining = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));

  return {
    isEligible: false,
    daysRemaining,
  };
}

/**
 * Validates lead contact phone or email.
 */
export function validateContactInput(
  input: string,
  type: 'phone' | 'email' | 'both' = 'both'
): { isValid: boolean; parsedType: 'phone' | 'email' | 'invalid' } {
  const clean = input.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneClean = clean.replace(/[^0-9]/g, '');
  const isPhone = phoneClean.length === 10 || (phoneClean.length > 10 && phoneClean.endsWith(phoneClean.slice(-10)));

  if (type === 'email' && emailRegex.test(clean)) {
    return { isValid: true, parsedType: 'email' };
  }
  if (type === 'phone' && isPhone) {
    return { isValid: true, parsedType: 'phone' };
  }
  if (type === 'both') {
    if (emailRegex.test(clean)) return { isValid: true, parsedType: 'email' };
    if (isPhone) return { isValid: true, parsedType: 'phone' };
  }

  return { isValid: false, parsedType: 'invalid' };
}
