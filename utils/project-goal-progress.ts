export type ProjectGoalProgress = {
  barPercent: number;
  currentWordCount: number;
  exceededByPercent: number;
  exceededByWordCount: number;
  goalWordCount: number;
  goalStatus: "below" | "met" | "exceeded";
  percent: number;
};

function nonNegativeWholeNumber(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

export function projectGoalProgress(
  currentWordCount: number,
  goalWordCount: number | null
): ProjectGoalProgress | null {
  if (typeof goalWordCount !== "number" || !Number.isFinite(goalWordCount) || goalWordCount <= 0) {
    return null;
  }

  const safeCurrentWordCount = nonNegativeWholeNumber(currentWordCount);
  const safeGoalWordCount = Math.max(1, Math.floor(goalWordCount));
  const percent = Math.round((safeCurrentWordCount / safeGoalWordCount) * 100);
  const exceededByWordCount = Math.max(0, safeCurrentWordCount - safeGoalWordCount);
  const exceededByPercent = exceededByWordCount
    ? Math.round((exceededByWordCount / safeGoalWordCount) * 100)
    : 0;

  return {
    barPercent: Math.min(percent, 100),
    currentWordCount: safeCurrentWordCount,
    exceededByPercent,
    exceededByWordCount,
    goalWordCount: safeGoalWordCount,
    goalStatus: exceededByWordCount
      ? "exceeded"
      : safeCurrentWordCount === safeGoalWordCount
        ? "met"
        : "below",
    percent
  };
}
