import React, { useState, useEffect, useRef } from "react";
import "./App.css";

import IndiaMap from "./components/IndiaMap.jsx";
import ColorPicker from "./components/ColorPicker.jsx";
import Controls from "./components/Controls.jsx";
import Dashboard from "./components/Dashboard.jsx";
import PlayerMode from "./components/PlayerMode.jsx";
import ExamScheduler from "./components/ExamScheduler.jsx";

import { runBacktracking } from "./algorithms/backtracking.js";
import { runMRV } from "./algorithms/mrv.js";
import { runForwardChecking } from "./algorithms/forwardChecking.js";
import indiaMapPaths from "./data/indiaMapPaths.js";

const STATES = Object.keys(indiaMapPaths);

const ALGORITHM_MAP = {
  backtracking: { fn: runBacktracking, label: "Backtracking" },
  mrv: { fn: runMRV, label: "MRV Heuristic" },
  forwardChecking: { fn: runForwardChecking, label: "Forward Checking" },
};

function App() {
  const [mode, setMode] = useState("ai");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("backtracking");
  const [selectedSpeed, setSelectedSpeed] = useState({ id: "normal", ms: 400 });
  const [assignments, setAssignments] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [conflictState, setConflictState] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [dashboardResults, setDashboardResults] = useState([]);
  const [stepLog, setStepLog] = useState([]);
  const intervalRef = useRef(null);
  const stepLogRef = useRef(null);

  // Auto scroll step log
  useEffect(() => {
    if (stepLogRef.current) {
      stepLogRef.current.scrollTop = stepLogRef.current.scrollHeight;
    }
  }, [stepLog]);

  function handleStart() {
    if (isRunning) return;

    if (mode === "compare") {
      runCompare();
      return;
    }

    const algo = ALGORITHM_MAP[selectedAlgorithm];
    if (!algo) return;

    setIsRunning(true);
    setIsDone(false);
    setAssignments({});
    setSteps([]);
    setStepLog([]);
    setCurrentStep(0);

    const result = algo.fn(STATES);
    const allSteps = result.steps;
    setSteps(allSteps);

    if (selectedSpeed.ms === 0) {
      setAssignments(result.assignments);
      setIsRunning(false);
      setIsDone(true);
      setDashboardResults([
        {
          algorithm: algo.label,
          nodesExplored: result.nodesExplored,
          backtracks: result.backtracks,
          timeTaken: result.timeTaken,
        },
      ]);
      return;
    }

    let i = 0;
    intervalRef.current = setInterval(() => {
      if (i >= allSteps.length) {
        clearInterval(intervalRef.current);
        setAssignments(result.assignments);
        setIsRunning(false);
        setIsDone(true);
        setDashboardResults([
          {
            algorithm: algo.label,
            nodesExplored: result.nodesExplored,
            backtracks: result.backtracks,
            timeTaken: result.timeTaken,
          },
        ]);
        return;
      }

      const step = allSteps[i];

      if (step.type === "assign") {
        setAssignments({ ...step.snapshot });
        setConflictState(null);
        setStepLog((prev) => [
          ...prev,
          { type: "assign", text: "Assign " + step.color + " to " + step.state },
        ]);
      } else {
        setConflictState(step.state);
        setStepLog((prev) => [
          ...prev,
          { type: "backtrack", text: "Backtrack from " + step.state },
        ]);
        setTimeout(() => setConflictState(null), selectedSpeed.ms * 0.8);
      }

      setCurrentStep(i + 1);
      i++;
    }, selectedSpeed.ms);
  }

  function runCompare() {
    setIsRunning(true);
    setIsDone(false);
    setDashboardResults([]);

    const results = Object.entries(ALGORITHM_MAP).map(([key, algo]) => {
      const result = algo.fn(STATES);
      return {
        algorithm: algo.label,
        nodesExplored: result.nodesExplored,
        backtracks: result.backtracks,
        timeTaken: result.timeTaken,
      };
    });

    setDashboardResults(results);
    setAssignments(runBacktracking(STATES).assignments);
    setIsRunning(false);
    setIsDone(true);
  }

  function handleReset() {
    clearInterval(intervalRef.current);
    setAssignments({});
    setIsRunning(false);
    setIsDone(false);
    setSteps([]);
    setStepLog([]);
    setCurrentStep(0);
    setConflictState(null);
    setSelectedState(null);
    setDashboardResults([]);
  }

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="header-title">
          <h1>🎨 Chromatic AI</h1>
          <span>CSP Graph Coloring</span>
        </div>
        <p className="header-subtitle">
          KL Deemed to be University — CFAI Project 2025-26
        </p>
      </div>

      {/* Main Layout */}
      {mode === "player" ? (
        <div style={{ padding: "20px 24px", maxWidth: "900px", margin: "0 auto" }}>
          <button
            onClick={() => setMode("ai")}
            style={{
              marginBottom: "16px",
              padding: "6px 14px",
              borderRadius: "8px",
              border: "1px solid #2d2d44",
              background: "transparent",
              color: "#a0aec0",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Back to AI Solver
          </button>
          <PlayerMode />
        </div>
      ) : mode === "exam" ? (
        <div style={{ padding: "20px 24px", maxWidth: "900px", margin: "0 auto" }}>
          <button
            onClick={() => setMode("ai")}
            style={{
              marginBottom: "16px",
              padding: "6px 14px",
              borderRadius: "8px",
              border: "1px solid #2d2d44",
              background: "transparent",
              color: "#a0aec0",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Back to AI Solver
          </button>
          <ExamScheduler />
        </div>
      ) : (
        <div className="main-layout">
          {/* Left Panel */}
          <div className="left-panel">
            <Controls
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmSelect={setSelectedAlgorithm}
              selectedSpeed={selectedSpeed}
              onSpeedSelect={setSelectedSpeed}
              selectedMode={mode}
              onModeSelect={setMode}
              onStart={handleStart}
              onReset={handleReset}
              isRunning={isRunning}
            />

            {/* Status */}
            <div className="card">
              <p className="card-title">Status</p>
              <div
                className={
                  "status-badge " +
                  (isRunning ? "running" : isDone ? "done" : "idle")
                }
              >
                {isRunning ? "Running..." : isDone ? "Completed!" : "Idle"}
              </div>

              {steps.length > 0 && (
                <div style={{ marginTop: "12px" }}>
                  <p
                    style={{
                      color: "#a0aec0",
                      fontSize: "12px",
                      margin: "0 0 6px 0",
                    }}
                  >
                    Progress: {currentStep} / {steps.length}
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
                        width:
                          steps.length
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
            </div>

            {/* Step Log */}
            <div className="card">
              <p className="card-title">Step Log</p>
              <div className="step-log" ref={stepLogRef}>
                {stepLog.length === 0 ? (
                  <p
                    style={{
                      color: "#4a5568",
                      fontSize: "12px",
                      textAlign: "center",
                      padding: "8px",
                    }}
                  >
                    Steps will appear here...
                  </p>
                ) : (
                  stepLog.map((s, i) => (
                    <div key={i} className={"step-item " + s.type}>
                      {s.type === "assign" ? "✓" : "↩"} {s.text}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Center Panel — Map */}
          <div className="center-panel">
            <IndiaMap
              assignments={assignments}
              onStateClick={setSelectedState}
              selectedState={selectedState}
              conflictState={conflictState}
              mode={mode}
            />
          </div>

          {/* Right Panel — Dashboard */}
          <div className="right-panel">
            <Dashboard results={dashboardResults} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
