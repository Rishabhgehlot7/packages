/**
 * @boostengine/gamification - Core Types & Interfaces
 */

export type GameType =
  | 'spin_wheel'
  | 'scratch_card'
  | 'mystery_box'
  | 'slot_machine';

export type TriggerType =
  | 'exit_intent'
  | 'time_delay'
  | 'scroll_depth'
  | 'manual';

export interface RewardSlice {
  id: string;
  label: string;
  sublabel?: string;
  color?: string;
  textColor?: string;
  probabilityWeight: number; // 0 to 100
  couponCode?: string;
  discountType: 'percentage' | 'fixed_amount' | 'free_shipping' | 'no_reward';
  discountValue: number;
  isLosingSlice?: boolean;
  icon?: string;
}

export interface GamificationConfig {
  id: string;
  title: string;
  subtitle?: string;
  type: GameType;
  slices: RewardSlice[];
  trigger: TriggerType;
  timeDelaySeconds?: number;
  scrollDepthPercentage?: number;
  cooldownDays?: number;
  requireLeadCapture?: boolean;
  leadInputType?: 'phone' | 'email' | 'both';
  badge?: string;
  isActive?: boolean;
}

export interface SpinOutcome {
  winningSlice: RewardSlice;
  winningIndex: number;
  targetAngle: number;
  couponCode?: string;
  discountText: string;
}

export interface LeadCaptureData {
  phone?: string;
  email?: string;
  gameId: string;
  rewardWon: RewardSlice;
  timestamp: number;
}
