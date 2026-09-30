export type WritingSection = {
  id: string;
  label: string;
  placeholder: string;
};

const WRITING_STRUCTURE_SECTIONS: Record<string, WritingSection[]> = {
  narrative_short: [
    { id: "beginning", label: "Beginning", placeholder: "What happens first?" },
    { id: "next", label: "Next", placeholder: "What happens next?" },
    { id: "then", label: "Then", placeholder: "Then what happens?" },
    { id: "after_that", label: "After That", placeholder: "What happens after that?" },
    { id: "ending", label: "Ending", placeholder: "How does it end?" }
  ],
  narrative_long: [
    { id: "beginning", label: "Beginning", placeholder: "Where and when does it start?" },
    { id: "event_1", label: "Event 1", placeholder: "What happens first?" },
    { id: "event_2", label: "Event 2", placeholder: "What happens next?" },
    { id: "event_3", label: "Event 3", placeholder: "What happens next?" },
    { id: "event_4", label: "Event 4", placeholder: "What happens next?" },
    { id: "event_5", label: "Event 5", placeholder: "What happens next?" },
    { id: "event_6", label: "Event 6", placeholder: "What happens next?" },
    { id: "event_7", label: "Event 7", placeholder: "What happens next?" },
    { id: "event_8", label: "Event 8", placeholder: "What happens just before the end?" },
    { id: "ending", label: "Ending", placeholder: "How does it end?" }
  ],
  informative_one_paragraph: [
    { id: "main_idea", label: "Main Idea", placeholder: "Main idea" },
    { id: "detail_1", label: "Detail 1", placeholder: "First detail" },
    { id: "detail_2", label: "Detail 2", placeholder: "Another detail" },
    { id: "detail_3", label: "Detail 3", placeholder: "One more detail" },
    { id: "closing", label: "Closing", placeholder: "What should the reader remember?" }
  ],
  informative_five_paragraph: [
    { id: "introduction", label: "Introduction", placeholder: "Main idea" },
    { id: "body_1", label: "Body 1", placeholder: "First main point" },
    { id: "body_2", label: "Body 2", placeholder: "Another main point" },
    { id: "body_3", label: "Body 3", placeholder: "One more main point" },
    { id: "conclusion", label: "Conclusion", placeholder: "What should the reader remember?" }
  ],
  opinion_one_paragraph: [
    { id: "opinion", label: "Opinion", placeholder: "Your opinion or claim" },
    { id: "reason_1", label: "Reason 1", placeholder: "A reason that supports your opinion" },
    { id: "reason_2", label: "Reason 2", placeholder: "Another reason" },
    { id: "reason_3", label: "Reason 3", placeholder: "One more reason" },
    { id: "closing", label: "Closing", placeholder: "Why does your opinion matter?" }
  ],
  opinion_five_paragraph: [
    { id: "introduction", label: "Introduction", placeholder: "Your opinion or claim" },
    { id: "reason_1", label: "Reason 1", placeholder: "A reason that supports your opinion" },
    { id: "reason_2", label: "Reason 2", placeholder: "Another reason" },
    { id: "reason_3", label: "Reason 3", placeholder: "One more reason" },
    { id: "conclusion", label: "Conclusion", placeholder: "Why does your opinion matter?" }
  ],
  open_writing: [{ id: "open_writing", label: "Writing", placeholder: "Start writing here" }]
};

export function isOpenWritingStructure(writingStructure: string) {
  return writingStructure === "open_writing" || writingStructure === "general";
}

export function writingSectionsForStructure(writingStructure: string) {
  return WRITING_STRUCTURE_SECTIONS[writingStructure] || WRITING_STRUCTURE_SECTIONS.open_writing;
}

function normalizeWritingKey(value: string | null | undefined) {
  return (value || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function writingSectionsForTypeAndStructure(
  writingType: string | null | undefined,
  writingStructure: string | null | undefined
) {
  const normalizedType = normalizeWritingKey(writingType);
  const normalizedStructure = normalizeWritingKey(writingStructure);

  if (normalizedStructure === "narrative_short" || normalizedStructure === "short_story") {
    return WRITING_STRUCTURE_SECTIONS.narrative_short;
  }

  if (normalizedStructure === "narrative_long" || normalizedStructure === "long_story") {
    return WRITING_STRUCTURE_SECTIONS.narrative_long;
  }

  if (normalizedStructure === "informative_one_paragraph") {
    return WRITING_STRUCTURE_SECTIONS.informative_one_paragraph;
  }

  if (normalizedStructure === "informative_five_paragraph") {
    return WRITING_STRUCTURE_SECTIONS.informative_five_paragraph;
  }

  if (normalizedStructure === "opinion_one_paragraph") {
    return WRITING_STRUCTURE_SECTIONS.opinion_one_paragraph;
  }

  if (normalizedStructure === "opinion_five_paragraph") {
    return WRITING_STRUCTURE_SECTIONS.opinion_five_paragraph;
  }

  if (normalizedStructure === "one_paragraph") {
    return normalizedType === "opinion"
      ? WRITING_STRUCTURE_SECTIONS.opinion_one_paragraph
      : WRITING_STRUCTURE_SECTIONS.informative_one_paragraph;
  }

  if (normalizedStructure === "five_paragraph") {
    return normalizedType === "opinion"
      ? WRITING_STRUCTURE_SECTIONS.opinion_five_paragraph
      : WRITING_STRUCTURE_SECTIONS.informative_five_paragraph;
  }

  if (normalizedStructure === "short") {
    return WRITING_STRUCTURE_SECTIONS.narrative_short;
  }

  if (normalizedStructure === "long") {
    return WRITING_STRUCTURE_SECTIONS.narrative_long;
  }

  return writingSectionsForStructure(normalizedStructure);
}

export function normalizeSectionOrder(
  sections: WritingSection[],
  sectionOrder?: string[]
) {
  const sectionIds = sections.map((section) => section.id);

  if (sectionIds.length <= 2) {
    return sectionIds;
  }

  const firstSectionId = sectionIds[0];
  const lastSectionId = sectionIds[sectionIds.length - 1];
  const middleSectionIds = sectionIds.slice(1, -1);
  const seen = new Set<string>();
  const orderedMiddleSectionIds = (sectionOrder || []).reduce<string[]>((orderedIds, sectionId) => {
    if (middleSectionIds.includes(sectionId) && !seen.has(sectionId)) {
      seen.add(sectionId);
      orderedIds.push(sectionId);
    }

    return orderedIds;
  }, []);

  return [
    firstSectionId,
    ...orderedMiddleSectionIds,
    ...middleSectionIds.filter((sectionId) => !seen.has(sectionId)),
    lastSectionId
  ];
}

export function orderedSectionsForSectionList(
  sections: WritingSection[],
  sectionOrder?: string[]
) {
  const sectionsById = new Map(sections.map((section) => [section.id, section]));

  return normalizeSectionOrder(sections, sectionOrder).map((sectionId, index) => {
    const sourceSection = sectionsById.get(sectionId);
    const positionSection = sections[index] || sourceSection;

    if (!sourceSection || !positionSection) {
      return null;
    }

    return {
      ...sourceSection,
      label: positionSection.label,
      placeholder: positionSection.placeholder
    };
  }).filter((section): section is WritingSection => Boolean(section));
}

export function orderedWritingSectionsForStructure(
  writingStructure: string,
  sectionOrder?: string[]
) {
  return orderedSectionsForSectionList(writingSectionsForStructure(writingStructure), sectionOrder);
}

export function textFromSectionValues(
  sections: WritingSection[],
  values: Record<string, string>
) {
  return sections
    .map((section) => {
      const text = (values[section.id] || "").trim();
      return text ? `${section.label}\n${text}` : "";
    })
    .filter(Boolean)
    .join("\n\n");
}
