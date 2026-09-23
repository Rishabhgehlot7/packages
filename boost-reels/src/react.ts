import { useState, useCallback, useEffect, useRef } from 'react';
import {
  ReelItem,
  StoryItem,
  TaggedProduct,
  ReelAnalyticsEvent,
  ReelEventType,
} from './types';

export interface UseReelsOptions {
  reels: ReelItem[];
  initialIndex?: number;
  onEvent?: (event: ReelAnalyticsEvent) => void;
}

export interface UseReelsReturn {
  reels: ReelItem[];
  currentIndex: number;
  currentReel: ReelItem | null;
  isPlaying: boolean;
  isMuted: boolean;
  likedReelIds: string[];
  selectedProduct: TaggedProduct | null;
  nextReel: () => void;
  prevReel: () => void;
  goToReel: (index: number) => void;
  togglePlay: () => void;
  toggleMute: () => void;
  toggleLike: (reelId: string) => void;
  setSelectedProduct: (product: TaggedProduct | null) => void;
  trackAction: (eventType: ReelEventType, productId?: string) => void;
}

/**
 * React Hook for interactive vertical video reels with product tags.
 */
export function useReels({
  reels,
  initialIndex = 0,
  onEvent,
}: UseReelsOptions): UseReelsReturn {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true); // Default muted for browser autoplay policies
  const [likedReelIds, setLikedReelIds] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<TaggedProduct | null>(null);

  const currentReel = reels[currentIndex] || null;

  const trackAction = useCallback(
    (eventType: ReelEventType, productId?: string) => {
      if (!currentReel) return;
      const eventPayload: ReelAnalyticsEvent = {
        reelId: currentReel.id,
        eventType,
        productId,
        timestamp: Date.now(),
      };
      if (onEvent) onEvent(eventPayload);
    },
    [currentReel, onEvent]
  );

  const nextReel = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIdx = Math.min(reels.length - 1, prev + 1);
      return nextIdx;
    });
  }, [reels.length]);

  const prevReel = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToReel = useCallback(
    (index: number) => {
      if (index >= 0 && index < reels.length) {
        setCurrentIndex(index);
      }
    },
    [reels.length]
  );

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const toggleLike = useCallback(
    (reelId: string) => {
      setLikedReelIds((prev) => {
        const isLiked = prev.includes(reelId);
        if (isLiked) {
          return prev.filter((id) => id !== reelId);
        } else {
          trackAction('reel_like');
          return [...prev, reelId];
        }
      });
    },
    [trackAction]
  );

  useEffect(() => {
    trackAction('reel_view');
  }, [currentIndex, trackAction]);

  return {
    reels,
    currentIndex,
    currentReel,
    isPlaying,
    isMuted,
    likedReelIds,
    selectedProduct,
    nextReel,
    prevReel,
    goToReel,
    togglePlay,
    toggleMute,
    toggleLike,
    setSelectedProduct,
    trackAction,
  };
}

export interface UseStoryPlayerOptions {
  stories: StoryItem[];
  initialIndex?: number;
  defaultDurationMs?: number;
  onComplete?: () => void;
  onStoryChange?: (story: StoryItem, index: number) => void;
}

export interface UseStoryPlayerReturn {
  stories: StoryItem[];
  currentIndex: number;
  currentStory: StoryItem | null;
  progressPercentage: number;
  isPaused: boolean;
  seenStoryIds: string[];
  pause: () => void;
  resume: () => void;
  nextStory: () => void;
  prevStory: () => void;
}

/**
 * React Hook for Instagram-style auto-advancing story highlight players.
 */
export function useStoryPlayer({
  stories,
  initialIndex = 0,
  defaultDurationMs = 5000,
  onComplete,
  onStoryChange,
}: UseStoryPlayerOptions): UseStoryPlayerReturn {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [seenStoryIds, setSeenStoryIds] = useState<string[]>([]);

  const currentStory = stories[currentIndex] || null;
  const timerRef = useRef<any>(null);
  const stepMs = 50;

  const nextStory = useCallback(() => {
    setProgress(0);
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      if (onComplete) onComplete();
    }
  }, [currentIndex, stories.length, onComplete]);

  const prevStory = useCallback(() => {
    setProgress(0);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  useEffect(() => {
    if (!currentStory) return;
    setSeenStoryIds((prev) =>
      prev.includes(currentStory.id) ? prev : [...prev, currentStory.id]
    );
    if (onStoryChange) onStoryChange(currentStory, currentIndex);
  }, [currentStory, currentIndex, onStoryChange]);

  useEffect(() => {
    if (isPaused || !currentStory) return;

    const duration = currentStory.durationMs || defaultDurationMs;
    const increment = (stepMs / duration) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev + increment >= 100) {
          clearInterval(timerRef.current);
          nextStory();
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, isPaused, currentStory, defaultDurationMs, nextStory]);

  return {
    stories,
    currentIndex,
    currentStory,
    progressPercentage: Math.min(100, Math.round(progress)),
    isPaused,
    seenStoryIds,
    pause,
    resume,
    nextStory,
    prevStory,
  };
}
