import React from "react";

const ALGORITHMS = [
  { id: "backtracking", label: "Backtracking" },
  { id: "mrv", label: "MRV Heuristic" },
  { id: "forwardChecking", label: "Forward Checking" },
];

const SPEEDS = [
  { id: "slow", label: "Slow", ms: 800 },
  { id: "normal", label: "Normal", ms: 400 },
  { id: "fast", label: "Fast", ms: 100 },
  { id: "instant", label: "Instant", ms: 0 },
];

const MODES = [
  { id: "ai", label: "AI Solver" },
  { id: "player", label: "Player vs AI" },
  { id: "compare", label: "Compare All" },
  { id: "exam", label: "Exam Scheduler" },
];

function Controls({
  selectedAlgorithm,
  onAlgorithmSelect,
  selectedSpeed,
  onSpeedSelect,
  selectedMode,
  onModeSelect,
  onStart,
  onReset,
  isRunning,
}) {
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
      {/* Mode Selection */}
      <div>
        <p
          style={{
            color: "#a0aec0",
            fontSize: "12px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            margin: "0 0 8px 0",
          }}
        >
          Mode
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onModeSelect(mode.id)}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid",
                borderColor:
                  selectedMode === mode.id ? "#7c3aed" : "#2d2d44",
                background:
                  selectedMode === mode.id ? "#7c3aed" : "transparent",
                color: selectedMode === mode.id ? "white" : "#a0aec0",
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Algorithm Selection */}
      {selectedMode !== "compare" && selectedMode !== "exam" && (
        <div>
          <p
            style={{
              color: "#a0aec0",
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: "0 0 8px 0",
            }}
          >
            Algorithm
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {ALGORITHMS.map((algo) => (
              <button
                key={algo.id}
                onClick={() => onAlgorithmSelect(algo.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid",
                  borderColor:
                    selectedAlgorithm === algo.id ? "#3182ce" : "#2d2d44",
                  background:
                    selectedAlgorithm === algo.id ? "#3182ce" : "transparent",
                  color:
                    selectedAlgorithm === algo.id ? "white" : "#a0aec0",
                  fontSize: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {algo.label}
              </button>
            ))}
          </div>
        </div>
      )}
       {/* Speed Selection */}
      {selectedMode !== "player" && selectedMode !== "exam" && (
        <div>
          <p
            style={{
              color: "#a0aec0",
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: "0 0 8px 0",
            }}
          >
            Speed
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {SPEEDS.map((speed) => (
              <button
                key={speed.id}
                onClick={() => onSpeedSelect(speed)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid",
                  borderColor:
                    selectedSpeed.id === speed.id ? "#38a169" : "#2d2d44",
                  background:
                    selectedSpeed.id === speed.id ? "#38a169" : "transparent",
                  color:
                    selectedSpeed.id === speed.id ? "white" : "#a0aec0",
                  fontSize: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {speed.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={onStart}
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
          {isRunning ? "Running..." : "Start"}
        </button>

        <button
          onClick={onReset}
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
            transition: "all 0.2s ease",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Controls;