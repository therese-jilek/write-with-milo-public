export const WRITING_TYPE_OPTIONS = [
  { value: "narrative", label: "Narrative" },
  { value: "informational", label: "Informative" },
  { value: "opinion", label: "Opinion" },
  { value: "general", label: "Open Writing" }
] as const;

export type WritingTypeOption = (typeof WRITING_TYPE_OPTIONS)[number]["value"];

export const WRITING_STRUCTURE_OPTIONS_BY_TYPE: Record<
  WritingTypeOption,
  { value: string; label: string }[]
> = {
  narrative: [
    { value: "narrative_short", label: "Narrative Short" },
    { value: "narrative_long", label: "Narrative Long" }
  ],
  informational: [
    { value: "informative_one_paragraph", label: "Informative 1 Paragraph" },
    { value: "informative_five_paragraph", label: "Informative 5 Paragraph" }
  ],
  opinion: [
    { value: "opinion_one_paragraph", label: "Opinion 1 Paragraph" },
    { value: "opinion_five_paragraph", label: "Opinion 5 Paragraph" }
  ],
  general: [{ value: "open_writing", label: "Open Writing" }]
};

export function writingTypeOptionFromValue(value: string): WritingTypeOption {
  const option = WRITING_TYPE_OPTIONS.find((writingType) => writingType.value === value);
  return option?.value || "general";
}

export function writingStructureOptionFromValue(writingType: string, value: string) {
  const safeWritingType = writingTypeOptionFromValue(writingType);
  const validStructures = WRITING_STRUCTURE_OPTIONS_BY_TYPE[safeWritingType];
  const selectedStructure = validStructures.find((structure) => structure.value === value);

  return selectedStructure?.value || validStructures[0].value;
}

export function writingTypeLabel(value: string) {
  const option = WRITING_TYPE_OPTIONS.find((writingType) => writingType.value === value);
  return option?.label || "Open Writing";
}

export function writingStructureLabel(value: string) {
  for (const structures of Object.values(WRITING_STRUCTURE_OPTIONS_BY_TYPE)) {
    const option = structures.find((structure) => structure.value === value);

    if (option) {
      return option.label;
    }
  }

  if (value === "short_story") return "Narrative Short";
  if (value === "long_story") return "Narrative Long";
  if (value === "one_paragraph") return "1 Paragraph";
  if (value === "five_paragraph") return "5 Paragraph";
  if (value === "general") return "Open Writing";
  return "Open Writing";
}
