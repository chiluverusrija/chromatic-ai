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

// Subjects that share students — they can't be in same slot
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
  1: { bg: "#2d1f5e", text: "#a78bfa", label: "Slot 1 — Monday" },
  2: { bg: "#1a2e1a", text: "#68D391", label: "Slot 2 — Tuesday" },
  3: { bg: "#2e1a1a", text: "#FC8181", label: "Slot 3 — Wednesday" },
  4: { bg: "#2e2a1a", text: "#F6E05E", label: "Slot 4 — Thursday" },
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

  function handleGenerate() {
    setIsRunning(true);
    setIsDone(false);
    setSchedule({});
    setCurrentStep(0);

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
        return;
      }

      const step = allSteps[i];
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
  }

  // Group subjects by slot
  const slotGroups = {};
  Object.entries(schedule).forEach(([subject, slot]) => {
    if (!slotGroups[slot]) slotGroups[slot] = [];
    slotGroups[slot].push(subject);
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
        background: "#1a1a2e",
        borderRadius: "12px",
        border: "1px solid #2d2d44",
      }}
    >
      {/* Header */}
      <div>
        <p
          style={{
            color: "#e2e8f0",
            fontSize: "16px",
            fontWeight: "600",
            margin: "0 0 4px 0",
          }}
        >
          Exam Scheduler
        </p>
        <p style={{ color: "#4a5568", fontSize: "12px", margin: 0 }}>
          Same CSP algorithm — subjects with common students get different slots
        </p>
      </div>

      {/* Conflict Graph Info */}
      <div
        style={{
          background: "#0d0d1a",
          borderRadius: "8px",
          padding: "12px",
          border: "1px solid #2d2d44",
        }}
      >
        <p
          style={{
            color: "#a0aec0",
            fontSize: "11px",
            fontWeight: "600",
            textTransform: "uppercase",
            margin: "0 0 8px 0",
          }}
        >
          Subjects — KL University CSE
        </p>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {SUBJECTS.map((subject) => (
            <span
              key={subject}
              style={{
                padding: "3px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                background: schedule[subject]
                  ? SLOT_COLORS[schedule[subject]].bg
                  : "#1a1a2e",
                color: schedule[subject]
                  ? SLOT_COLORS[schedule[subject]].text
                  : "#4a5568",
                border: "1px solid",
                borderColor: schedule[subject]
                  ? SLOT_COLORS[schedule[subject]].text
                  : "#2d2d44",
                transition: "all 0.3s ease",
              }}
            >
              {subject}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleGenerate}
          disabled={isRunning}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            background: isRunning ? "#2d2d44" : "#7c3aed",
            color: isRunning ? "#718096" : "white",
            fontSize: "14px",
            fontWeight: "600",
            cursor: isRunning ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {isRunning ? "Scheduling..." : "Generate Schedule"}
        </button>
        <button
          onClick={handleReset}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #2d2d44",
            background: "transparent",
            color: "#a0aec0",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      {/* Progress */}
      {isRunning && (
        <div>
          <p style={{ color: "#a0aec0", fontSize: "12px", margin: "0 0 6px 0" }}>
            Steps: {currentStep} / {steps.length}
          </p>
          <div
            style={{
              height: "4px",
              background: "#2d2d44",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: steps.length
                  ? (currentStep / steps.length) * 100 + "%"
                  : "0%",
                background: "#7c3aed",
                borderRadius: "2px",
                transition: "width 0.2s ease",
              }}
            />
          </div>
        </div>
      )}

      {/* Final Schedule */}
      {isDone && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <p
            style={{
              color: "#68D391",
              fontSize: "13px",
              fontWeight: "600",
              margin: 0,
            }}
          >
            Schedule generated using {new Set(Object.values(schedule)).size} slots!
          </p>

          {[1, 2, 3, 4].map((slot) =>
            slotGroups[slot] ? (
              <div
                key={slot}
                style={{
                  background: SLOT_COLORS[slot].bg,
                  borderRadius: "8px",
                  padding: "10px 14px",
                  border: "1px solid",
                  borderColor: SLOT_COLORS[slot].text,
                }}
              >
                <p
                  style={{
                    color: SLOT_COLORS[slot].text,
                    fontSize: "12px",
                    fontWeight: "600",
                    margin: "0 0 6px 0",
                  }}
                >
                  {SLOT_COLORS[slot].label}
                </p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {slotGroups[slot].map((subject) => (
                    <span
                      key={subject}
                      style={{
                        padding: "2px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        background: "#0d0d1a",
                        color: SLOT_COLORS[slot].text,
                      }}
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

export default ExamScheduler;
