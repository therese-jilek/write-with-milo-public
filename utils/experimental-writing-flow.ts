export const CONNECT_ENDING_FIRST_WRITING_APPROACH = "connect_ending_first";
export const WRITING_APPROACH_METADATA_KEY = "writingApproach";

export type WritingApproach = typeof CONNECT_ENDING_FIRST_WRITING_APPROACH;

export function writingApproachFromValue(value: unknown): WritingApproach | null {
  return value === CONNECT_ENDING_FIRST_WRITING_APPROACH
    ? CONNECT_ENDING_FIRST_WRITING_APPROACH
    : null;
}

export function projectUsesConnectEndingFirst(metadata: unknown) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return false;
  }

  return writingApproachFromValue(
    (metadata as Record<string, unknown>)[WRITING_APPROACH_METADATA_KEY]
  ) === CONNECT_ENDING_FIRST_WRITING_APPROACH;
}
