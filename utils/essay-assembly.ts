import type { WritingSection } from "./writing-sections";

export type AssembledDraftEssay = {
  paragraphs: string[];
  text: string;
};

function cleanDraftSection(value: string | undefined) {
  return (value || "").trim();
}

function paragraphText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function oneParagraphText(sectionTexts: string[]) {
  return sectionTexts
    .map(paragraphText)
    .filter(Boolean)
    .join(" ");
}

export function assembleDraftEssay(
  writingStructure: string,
  sections: WritingSection[],
  sectionValues: Record<string, string>,
  fallbackText = ""
): AssembledDraftEssay {
  const sectionTexts = sections
    .map((section) => cleanDraftSection(sectionValues[section.id]))
    .filter(Boolean);
  const fallback = cleanDraftSection(fallbackText);
  const sourceTexts = sectionTexts.length ? sectionTexts : fallback ? [fallback] : [];
  const oneParagraphStructure = writingStructure === "narrative_short" ||
    writingStructure.endsWith("_one_paragraph");
  const paragraphs = oneParagraphStructure
    ? [oneParagraphText(sourceTexts)].filter(Boolean)
    : writingStructure.endsWith("_five_paragraph")
      ? sourceTexts.map(paragraphText).filter(Boolean)
      : sourceTexts;

  return {
    paragraphs,
    text: paragraphs.join("\n\n")
  };
}
