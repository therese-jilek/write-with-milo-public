"use client";

import { useMemo, useRef, useState } from "react";
import { CopyWritingButton } from "./CopyWritingButton";
import { PromptReadAloudButton } from "./PromptReadAloudButton";
import { assembleDraftEssay } from "../utils/essay-assembly";
import {
  WRITING_STRUCTURE_OPTIONS_BY_TYPE,
  WRITING_TYPE_OPTIONS,
  type WritingTypeOption,
  writingStructureLabel,
  writingTypeLabel
} from "../utils/writing-options";
import { writingSectionsForStructure } from "../utils/writing-sections";

type PublicView = "teacher" | "student";
type WritingPhase = "outline" | "draft" | "review";
type SupportTool = "default" | "ideas" | "starter" | "picture";

const DEFAULT_PROMPT = "Explain something you know well and why it matters.";
const PUBLIC_SENTENCE_STARTER = "One reason is";

export function PublicMiloWorkspace() {
  const [view, setView] = useState<PublicView>("teacher");
  const [writingType, setWritingType] = useState<WritingTypeOption>("informational");
  const [writingStructure, setWritingStructure] = useState("informative_five_paragraph");
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [phase, setPhase] = useState<WritingPhase>("outline");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [outlineValues, setOutlineValues] = useState<Record<string, string>>({});
  const [draftValues, setDraftValues] = useState<Record<string, string>>({});
  const [supportTool, setSupportTool] = useState<SupportTool>("default");
  const [readAloudMessage, setReadAloudMessage] = useState("");
  const writingFieldRef = useRef<HTMLTextAreaElement>(null);

  const sections = useMemo(
    () => writingSectionsForStructure(writingStructure),
    [writingStructure]
  );
  const activeSection = sections[Math.min(sectionIndex, sections.length - 1)];
  const activeValues = phase === "outline" ? outlineValues : draftValues;
  const activeWriting = activeSection ? activeValues[activeSection.id] || "" : "";
  const sentenceStarterAvailable = phase === "draft" && activeWriting.trim().length === 0;
  const assembledDraft = assembleDraftEssay(writingStructure, sections, draftValues);

  function chooseWritingType(value: WritingTypeOption) {
    const nextStructure = WRITING_STRUCTURE_OPTIONS_BY_TYPE[value][0].value;
    setWritingType(value);
    setWritingStructure(nextStructure);
    setSectionIndex(0);
    setOutlineValues({});
    setDraftValues({});
  }

  function chooseStructure(value: string) {
    setWritingStructure(value);
    setSectionIndex(0);
    setOutlineValues({});
    setDraftValues({});
  }

  function updateWriting(value: string) {
    if (!activeSection) return;
    const setter = phase === "outline" ? setOutlineValues : setDraftValues;
    setter((current) => ({ ...current, [activeSection.id]: value }));
  }

  function addPublicSentenceStarter() {
    if (!sentenceStarterAvailable) return;
    updateWriting(`${PUBLIC_SENTENCE_STARTER} `);
    setSupportTool("default");
    window.requestAnimationFrame(() => {
      const field = writingFieldRef.current;
      if (!field) return;
      const caret = PUBLIC_SENTENCE_STARTER.length + 1;
      field.focus();
      field.setSelectionRange(caret, caret);
    });
  }

  function openStudentView() {
    setView("student");
    setPhase("outline");
    setSectionIndex(0);
    setSupportTool("default");
  }

  return (
    <main className="public-page">
      <header className="public-header">
        <div>
          <p className="public-wordmark">Milo</p>
          <p className="public-kicker">Public build snapshot</p>
        </div>
        <div aria-label="Choose a view" className="public-view-switch" role="group">
          <button
            aria-pressed={view === "teacher"}
            className={view === "teacher" ? "is-active" : ""}
            onClick={() => setView("teacher")}
            type="button"
          >
            Teacher setup
          </button>
          <button
            aria-pressed={view === "student"}
            className={view === "student" ? "is-active" : ""}
            onClick={() => setView("student")}
            type="button"
          >
            Student workspace
          </button>
        </div>
      </header>

      {view === "teacher" ? (
        <section aria-labelledby="project-setup-title" className="public-teacher-panel">
          <div className="public-section-heading">
            <div>
              <p className="public-eyebrow">Local interface preview</p>
              <h1 id="project-setup-title">Set up a writing project</h1>
            </div>
            <span className="public-status">No account or database</span>
          </div>

          <div className="public-form-grid">
            <label>
              Writing type
              <select
                onChange={(event) => chooseWritingType(event.target.value as WritingTypeOption)}
                value={writingType}
              >
                {WRITING_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label>
              Writing structure
              <select onChange={(event) => chooseStructure(event.target.value)} value={writingStructure}>
                {WRITING_STRUCTURE_OPTIONS_BY_TYPE[writingType].map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="public-prompt-field">
              Assignment prompt
              <textarea onChange={(event) => setPrompt(event.target.value)} rows={4} value={prompt} />
            </label>
          </div>

          <div className="public-project-summary">
            <div>
              <span>Writing type</span>
              <strong>{writingTypeLabel(writingType)}</strong>
            </div>
            <div>
              <span>Structure</span>
              <strong>{writingStructureLabel(writingStructure)}</strong>
            </div>
            <div>
              <span>Sections</span>
              <strong>{sections.length}</strong>
            </div>
          </div>

          <button className="public-primary-button" onClick={openStudentView} type="button">
            Open student workspace
          </button>
        </section>
      ) : (
        <section className="public-student-shell">
          <nav aria-label="Writing phase" className="public-phase-nav">
            {(["outline", "draft", "review"] as WritingPhase[]).map((item, index) => (
              <button
                aria-current={phase === item ? "step" : undefined}
                className={phase === item ? "is-active" : ""}
                key={item}
                onClick={() => {
                  setPhase(item);
                  setSectionIndex(0);
                  setSupportTool("default");
                }}
                type="button"
              >
                <span>{index + 1}</span>{item === "review" ? "Review" : item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </nav>

          <div className="public-assignment-row">
            <div>
              <span>Assignment</span>
              <p>{prompt || DEFAULT_PROMPT}</p>
            </div>
            <PromptReadAloudButton
              onReadAloudMessage={setReadAloudMessage}
              promptText={prompt || DEFAULT_PROMPT}
            />
          </div>
          <p aria-live="polite" className="public-sr-message">{readAloudMessage}</p>

          {phase === "review" ? (
            <div className="public-review-card">
              <p className="public-eyebrow">Review</p>
              <h1>Your draft</h1>
              {assembledDraft.paragraphs.length ? (
                <div className="public-review-writing">
                  {assembledDraft.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                </div>
              ) : (
                <p className="public-empty-state">Your draft will appear here as you write.</p>
              )}
              {assembledDraft.text ? <CopyWritingButton writingText={assembledDraft.text} /> : null}
            </div>
          ) : (
            <>
              <div className="public-workspace-grid">
                <div className="public-writing-card">
                  <div className="public-writing-heading">
                    <div>
                      <p className="public-eyebrow">{phase === "outline" ? "Outline" : "Draft"}</p>
                      <h1>{activeSection?.label || "Writing"}</h1>
                    </div>
                  </div>
                  <textarea
                    aria-label={`${activeSection?.label || "Writing"} ${phase}`}
                    onChange={(event) => updateWriting(event.target.value)}
                    placeholder={activeSection?.placeholder}
                    ref={writingFieldRef}
                    value={activeWriting}
                  />
                  <div className="public-writing-navigation">
                    <button
                      disabled={sectionIndex === 0}
                      onClick={() => setSectionIndex((current) => Math.max(0, current - 1))}
                      type="button"
                    >
                      Back
                    </button>
                    {sectionIndex < sections.length - 1 ? (
                      <button onClick={() => setSectionIndex((current) => current + 1)} type="button">
                        Next: {sections[sectionIndex + 1]?.label}
                      </button>
                    ) : (
                      <button onClick={() => setPhase(phase === "outline" ? "draft" : "review")} type="button">
                        {phase === "outline" ? "Continue to Draft" : "Review draft"}
                      </button>
                    )}
                  </div>
                </div>

                <aside className="public-support-panel" aria-label="Writing help">
                  <div className="public-support-top">
                    <div className="public-support-heading">
                      <h2>Writing help</h2>
                      {supportTool !== "default" ? (
                        <button aria-label="Close writing help" onClick={() => setSupportTool("default")} type="button">x</button>
                      ) : null}
                    </div>
                    {supportTool === "default" ? (
                      <div className="public-support-list">
                        <button onClick={() => setSupportTool("ideas")} type="button">
                          <strong>Find an idea</strong><span>Use a question to think about this section.</span>
                        </button>
                        {phase === "draft" ? (
                          <button onClick={() => setSupportTool("starter")} type="button">
                            <strong>Sentence starter</strong><span>Start a sentence</span>
                          </button>
                        ) : null}
                        <button onClick={() => setSupportTool("picture")} type="button">
                          <strong>Create a picture</strong><span>Use a visual as a writing reference.</span>
                        </button>
                      </div>
                    ) : (
                      <div className={`public-support-demo${supportTool === "starter" ? " is-sentence-starter" : ""}`}>
                        <h3>{supportTool === "ideas" ? "Find an idea" : supportTool === "starter" ? "Sentence starter" : "Create a picture"}</h3>
                        {supportTool === "starter" ? (
                          <>
                            <div className="public-starter-card">
                              <p>{PUBLIC_SENTENCE_STARTER}</p>
                              <PromptReadAloudButton
                                onReadAloudMessage={setReadAloudMessage}
                                promptText={PUBLIC_SENTENCE_STARTER}
                              />
                            </div>
                            {sentenceStarterAvailable ? (
                              <button className="public-add-starter" onClick={addPublicSentenceStarter} type="button">
                                + Add
                              </button>
                            ) : null}
                          </>
                        ) : (
                          <p>
                            {supportTool === "ideas"
                              ? "This public view shows the interaction shell without Milo's private question library."
                              : "Provider requests and safety controls are intentionally not included in this public repository."}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="public-progress">
                    <h3>{phase === "outline" ? "Outline progress" : "Draft progress"}</h3>
                    <div aria-label="Section progress" className="public-progress-track" role="list">
                      {sections.map((section, index) => (
                        <span
                          aria-label={`${section.label}, ${index < sectionIndex ? "complete" : index === sectionIndex ? "current" : "not started"}`}
                          className={index < sectionIndex ? "is-complete" : index === sectionIndex ? "is-current" : ""}
                          key={section.id}
                          role="listitem"
                        >
                          {index < sectionIndex ? "\u2713" : index + 1}
                        </span>
                      ))}
                    </div>
                    <p className="public-sr-only">
                      Current section: {activeSection?.label}. Section {sectionIndex + 1} of {sections.length}.
                    </p>
                  </div>
                </aside>
              </div>
            </>
          )}
        </section>
      )}

      <footer className="public-footer">
        Curated public snapshot. No production services or student data are connected.
      </footer>
    </main>
  );
}
