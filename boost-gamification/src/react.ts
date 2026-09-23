import { useState, useCallback, useEffect } from 'react';
import {
  GamificationConfig,
  RewardSlice,
  SpinOutcome,
  LeadCaptureData,
} from './types';
import {
  calculateSpinOutcome,
  calculateScratchPercentage,
  checkCooldownEligibility,
  validateContactInput,
} from './engine';

export interface UseSpinWheelOptions {
  config: GamificationConfig;
  lastPlayedTimestamp?: number;
  onRewardWon?: (outcome: SpinOutcome) => void;
  onLeadSubmit?: (data: LeadCaptureData) => void;
}

export interface UseSpinWheelReturn {
  config: GamificationConfig;
  isOpen: boolean;
  isSpinning: boolean;
  rotationAngle: number;
  winningOutcome: SpinOutcome | null;
  hasPlayed: boolean;
  cooldownDaysRemaining: number;
  leadInput: string;
  isLeadValid: boolean;
  setLeadInput: (val: string) => void;
  open: () => void;
  close: () => void;
  spin: () => void;
  submitLead: () => boolean;
}

/**
 * React Hook for Lucky Spin-the-Wheel discount popup.
 */
export function useSpinWheel({
  config,
  lastPlayedTimestamp,
  onRewardWon,
  onLeadSubmit,
}: UseSpinWheelOptions): UseSpinWheelReturn {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [winningOutcome, setWinningOutcome] = useState<SpinOutcome | null>(null);
  const [hasPlayed, setHasPlayed] = useState<boolean>(false);
  const [leadInput, setLeadInput] = useState<string>('');

  const eligibility = checkCooldownEligibility(lastPlayedTimestamp, config.cooldownDays || 7);

  // Trigger handlers (e.g. exit-intent or time delay)
  useEffect(() => {
    if (!config.isActive && config.isActive !== undefined) return;
    if (!eligibility.isEligible) return;

    if (config.trigger === 'time_delay' && config.timeDelaySeconds) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, config.timeDelaySeconds * 1000);
      return () => clearTimeout(timer);
    }

    if (config.trigger === 'exit_intent' && typeof window !== 'undefined') {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 10 && !hasPlayed) {
          setIsOpen(true);
        }
      };
      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }
  }, [config, eligibility.isEligible, hasPlayed]);

  const spin = useCallback(() => {
    if (isSpinning || hasPlayed) return;

    setIsSpinning(true);
    const outcome = calculateSpinOutcome(config.slices, 6, rotationAngle);
    setRotationAngle(outcome.targetAngle);

    // Simulated wheel stop duration (3.5s standard transition)
    setTimeout(() => {
      setIsSpinning(false);
      setHasPlayed(true);
      setWinningOutcome(outcome);
      if (onRewardWon) onRewardWon(outcome);
    }, 3500);
  }, [config.slices, hasPlayed, isSpinning, onRewardWon, rotationAngle]);

  const validation = validateContactInput(leadInput, config.leadInputType || 'both');

  const submitLead = useCallback(() => {
    if (!validation.isValid || !winningOutcome) return false;

    const leadData: LeadCaptureData = {
      phone: validation.parsedType === 'phone' ? leadInput : undefined,
      email: validation.parsedType === 'email' ? leadInput : undefined,
      gameId: config.id,
      rewardWon: winningOutcome.winningSlice,
      timestamp: Date.now(),
    };

    if (onLeadSubmit) onLeadSubmit(leadData);
    return true;
  }, [config.id, leadInput, onLeadSubmit, validation.isValid, validation.parsedType, winningOutcome]);

  return {
    config,
    isOpen,
    isSpinning,
    rotationAngle,
    winningOutcome,
    hasPlayed,
    cooldownDaysRemaining: eligibility.daysRemaining,
    leadInput,
    isLeadValid: validation.isValid,
    setLeadInput,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    spin,
    submitLead,
  };
}

export interface UseScratchCardOptions {
  reward: RewardSlice;
  revealThresholdPercentage?: number; // e.g. 50% cleared -> reveal all
  onRevealed?: (reward: RewardSlice) => void;
}

export interface UseScratchCardReturn {
  reward: RewardSlice;
  isRevealed: boolean;
  scratchPercentage: number;
  updateScratchProgress: (revealedPixels: number, totalPixels: number) => void;
  revealAll: () => void;
  reset: () => void;
}

/**
 * React Hook for Scratch-to-Reveal Card.
 */
export function useScratchCard({
  reward,
  revealThresholdPercentage = 45,
  onRevealed,
}: UseScratchCardOptions): UseScratchCardReturn {
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [scratchPercentage, setScratchPercentage] = useState<number>(0);

  const updateScratchProgress = useCallback(
    (revealedPixels: number, totalPixels: number) => {
      if (isRevealed) return;
      const pct = calculateScratchPercentage(revealedPixels, totalPixels);
      setScratchPercentage(pct);

      if (pct >= revealThresholdPercentage && !isRevealed) {
        setIsRevealed(true);
        if (onRevealed) onRevealed(reward);
      }
    },
    [isRevealed, onRevealed, revealThresholdPercentage, reward]
  );

  const revealAll = useCallback(() => {
    setIsRevealed(true);
    setScratchPercentage(100);
    if (onRevealed) onRevealed(reward);
  }, [onRevealed, reward]);

  const reset = useCallback(() => {
    setIsRevealed(false);
    setScratchPercentage(0);
  }, []);

  return {
    reward,
    isRevealed,
    scratchPercentage,
    updateScratchProgress,
    revealAll,
    reset,
  };
}
