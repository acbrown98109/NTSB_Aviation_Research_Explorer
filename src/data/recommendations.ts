import type { Recommendation } from '@/types';
import { investigations } from './investigations';

// ============================================================
// Aggregated recommendations from all investigations
// ============================================================

export const allRecommendations: Recommendation[] = investigations.flatMap(
  (inv) => inv.recommendations
);

export const getRecommendationsByStatus = (status: Recommendation['status']): Recommendation[] =>
  allRecommendations.filter((r) => r.status === status);

export const getRecommendationsByRecipient = (
  recipient: Recommendation['recipient']
): Recommendation[] => allRecommendations.filter((r) => r.recipient === recipient);

export const getOpenRecommendations = (): Recommendation[] =>
  allRecommendations.filter((r) => r.status === 'open');

export const getClosedRecommendations = (): Recommendation[] =>
  allRecommendations.filter((r) => r.status === 'closed');
