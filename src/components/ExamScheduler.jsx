import React, { useState } from "react";

// KL University CSE subjects and which ones share students
const SUBJECTS = [
  "CFAI",
  "DBMS",
  "OS",
  "CN",
  "OOPS",
  "DS",
  "Maths",
  "English",
  "Physics",
  "Chemistry",
];

// Subjects that share students — they can't be in the same slot
const SUBJECT_CONFLICTS = {
  CFAI:      ["DBMS", "OS", "Maths"],
  DBMS:      ["CFAI", "OS", "CN", "DS"],
  OS:        ["CFAI", "DBMS", "CN", "OOPS"],
  CN:        ["DBMS", "OS", "OOPS"],
  OOPS:      ["OS", "CN", "DS", "CFAI"],
  DS:        ["DBMS", "OOPS", "Maths"],
  Maths:     ["CFAI", "DS", "Physics"],
  English:   ["Physics", "Chemistry"],
  Physics:   ["Maths", "English", "Chemistry"],
  Chemistry: ["Physics", "English"],
};

const SLOT_COLORS = {
  1: { bg: "rgba(124, 58, 237, 0.15)", text: "#a78bfa", border: "#7c3aed", label: "Slot 1 — Monday" },
  2: { bg: "rgba(16, 185, 129, 0.15)", text: "#68D391", border: "#10b981", label: "Slot 2 — Tuesday" },
  3: { bg: "rgba(239, 68, 68, 0.15)", text: "#FC8181", border: "#ef4444", label: "Slot 3 — Wednesday" },
  4: { bg: "rgba(245, 158, 11, 0.15)", text: "#F6E05E", border: "#f59e0b", label: "Slot 4 — Thursday" },
};

// Check if slot is safe for subject
function isSlotSafe(subject, slot, assignments) {
  const conflicts = SUBJECT_CONFLICTS[subject] || [];
  return !conflicts.some((s) => assignments[s] === slot);
}

// Backtracking CSP for exam scheduling
function scheduleExams(subjects, assignments = {}, steps = []) {
  if (Object.keys(assignments).length === subjects.length) {
    return { success: true, assignments, steps };
  }

  const subject = subjects.find((s) => !assignments[s]);

  for (let slot = 1; slot <= 4; slot++) {
    if (isSlotSafe(subject, slot, assignments)) {
      assignments[subject] = slot;
      steps.push({ subject, slot, type: "assign" });

      const result = scheduleExams(subjects, assignments, steps);
      if (result.success) return result;

      delete assignments[subject];
      steps.push({ subject, slot, type: "backtrack" });
    }
  }

  return { success: false, assignments, steps };
}

function ExamScheduler() {
  const [schedule, setSchedule] = useState({});
  const [steps, setSteps] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeSubject, setActiveSubject] = useState(null);

  function handleGenerate() {
    setIsRunning(true);
    setIsDone(false);
    setSchedule({});
    setCurrentStep(0);
    setActiveSubject(null);

    const result = scheduleExams([...SUBJECTS], {}, []);
    const allSteps = result.steps;
    setSteps(allSteps);

    // Animate steps
    let i = 0;
    const interval = setInterval(() => {
      if (i >= allSteps.length) {
        clearInterval(interval);
        setSchedule(result.assignments);
        setIsRunning(false);
        setIsDone(true);
        setActiveSubject(null);
        return;
      }

      const step = allSteps[i];
      setActiveSubject(step.subject);
      if (step.type === "assign") {
        setSchedule((prev) => ({ ...prev, [step.subject]: step.slot }));
      } else {
        setSchedule((prev) => {
          const updated = { ...prev };
          delete updated[step.subject];
          return updated;
        });
      }
      setCurrentStep(i + 1);
      i++;
    }, 200);
  }

  function handleReset() {
    setSchedule({});
    setSteps([]);
    setIsRunning(false);
    setIsDone(false);
    setCurrentStep(0);
    setActiveSubject(null);
  }

  // Group subjects by slot
  const slotGroups = {};
  Object.entries(schedule).forEach(([subject, slot]) => {
    if (!slotGroups[slot]) slotGroups[slot] = [];
    slotGroups[slot].push(subject);
  });

  return (
    <div className="exam-scheduler-container glass-panel fade-in">
      <div className="panel-header">
        <div className="title-desc">
          <h3>KL University CSE Exam Scheduler</h3>
          <p className="subtitle-desc">
            Solving real-world scheduling conflicts using Graph Coloring CSP backtracks.
          </p>
        </div>
        <span className="badge">CSP SCHEDULER</span>
      </div>

      {/* Grid containing subjects on left, schedule slots on right */}
      <div className="scheduler-layout">
        {/* Left Side: Subject Nodes Panel */}
        <div className="scheduler-subjects-card">
          <label className="deck-lbl">Course Subject Registry</label>
          <div className="subjects-grid">
            {SUBJECTS.map((subject) => {
              const assignedSlot = schedule[subject];
              const slotStyle = assignedSlot ? SLOT_COLORS[assignedSlot] : null;
              const isActive = activeSubject === subject;

              return (
                <div
                  key={subject}
                  className={`subject-pill ${isActive ? "active" : ""}`}
                  style={{
                    backgroundColor: slotStyle ? slotStyle.bg : "#181829",
                    color: slotStyle ? slotStyle.text : "#718096",
                    borderColor: isActive ? "#7c3aed" : slotStyle ? slotStyle.border : "#2d2d44",
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                >
                  <span className="subj-title">{subject}</span>
                  {assignedSlot && (
                    <span className="subj-slot" style={{ background: slotStyle.border }}>
                      S{assignedSlot}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="divider-h" />

          {/* Action Row */}
          <div className="flex-row gap-10">
            <button
              onClick={handleGenerate}
              disabled={isRunning}
              className={`btn-action primary-glow ${isRunning ? "disabled" : ""}`}
              style={{ flex: 1 }}
            >
              {isRunning ? "Running CSP Solver..." : "🗓️ Generate Conflict-Free Schedule"}
            </button>
            <button onClick={handleReset} className="btn-action reset-btn-outline" style={{ flex: 0.3 }}>
              Reset
            </button>
          </div>

          {/* Progress Slider */}
          {isRunning && (
            <div className="progress-section" style={{ marginTop: "16px" }}>
              <div className="progress-label">
                <span>Scheduling Step Progression</span>
                <span>{currentStep} / {steps.length} Actions</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Schedule Output Slots */}
        <div className="scheduler-slots-card">
          <label className="deck-lbl">Timetable Slots Assignment</label>
          <div className="slots-container">
            {[1, 2, 3, 4].map((slot) => {
              const group = slotGroups[slot] || [];
              const style = SLOT_COLORS[slot];

              return (
                <div
                  key={slot}
                  className="slot-card"
                  style={{
                    backgroundColor: style.bg,
                    border: `1px solid ${style.border}`,
                  }}
                >
                  <div className="slot-header">
                    <span className="slot-title" style={{ color: style.text }}>
                      {style.label}
                    </span>
                    <span className="slot-count">{group.length} subjects</span>
                  </div>
                  {group.length === 0 ? (
                    <p className="no-subjects">No exams scheduled in this slot yet</p>
                  ) : (
                    <div className="slot-subjects-list">
                      {group.map((subject) => (
                        <div key={subject} className="slot-subject-item">
                          <span className="subj-code">{subject}</span>
                          <span className="subj-conflicts-lbl">
                            Conflicts: {SUBJECT_CONFLICTS[subject].join(", ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamScheduler;
