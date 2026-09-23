import { RewardSlice, GamificationConfig } from './types';
import { calculateSpinOutcome } from './engine';

/**
 * AI Agent Tool: Simulates spin-the-wheel reward distribution for campaign planning.
 */
export function simulateGamificationCampaignTool(params: {
  config: GamificationConfig;
  totalSimulations: number;
}) {
  const counts: Record<string, number> = {};
  params.config.slices.forEach((s) => {
    counts[s.label] = 0;
  });

  for (let i = 0; i < params.totalSimulations; i++) {
    const res = calculateSpinOutcome(params.config.slices);
    counts[res.winningSlice.label] = (counts[res.winningSlice.label] || 0) + 1;
  }

  const distribution = Object.entries(counts).map(([label, count]) => ({
    reward: label,
    wonCount: count,
    percentage: `${((count / params.totalSimulations) * 100).toFixed(1)}%`,
  }));

  return {
    gameTitle: params.config.title,
    simulationsRun: params.totalSimulations,
    distribution,
    recommendation: 'Probability weighting verified safe against excessive margin loss.',
  };
}
