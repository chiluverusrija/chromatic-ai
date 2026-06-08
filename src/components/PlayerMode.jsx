import React, { useState } from "react";
import indiaAdjacency from "../data/indiaAdjacency.js";
import indiaMapPaths from "../data/indiaMapPaths.js";
import { runBacktracking } from "../algorithms/backtracking.js";
import ColorPicker from "./ColorPicker.jsx";

const COLOR_MAP = {
  red: "#FF6B6B",
  green: "#68D391",
  blue: "#63B3ED",
  yellow: "#F6E05E",
  default: "#2d2d44",
};

function PlayerMode() {
  const states = Object.keys(indiaMapPaths);
  const [assignments, setAssignments] = useState({});
  const [selectedColor, setSelectedColor] = useState("red");
  const [selectedState, setSelectedState] = useState(null);
  const [conflictState, setConflictState] = useState(null);
  const [aiAssignments, setAiAssignments] = useState(null);
  const [showAI, setShowAI] = useState(false);
  const [message, setMessage] = useState("Click a state and color it!");
  const [playerDone, setPlayerDone] = useState(false);

  // Check if coloring is valid
  function isConflict(state, color, currentAssignments) {
    const neighbors = indiaAdjacency[state] || [];
    return neighbors.some((n) => currentAssignments[n] === color);
  }

  // Handle state click
  function handleStateClick(state) {
    if (showAI) return;
    setSelectedState(state);

    if (!selectedColor) {
      setMessage("Please select a color first!");
      return;
    }

    if (isConflict(state, selectedColor, assignments)) {
      setConflictState(state);
      setMessage("Conflict! Neighbor already has this color. Try another color.");
      setTimeout(() => setConflictState(null), 1000);
      return;
    }

    const newAssignments = { ...assignments, [state]: selectedColor };
    setAssignments(newAssignments);
    setConflictState(null);
    setMessage("State colored! Keep going...");

    if (Object.keys(newAssignments).length === states.length) {
      setPlayerDone(true);
      setMessage("You completed the map! See how AI does it.");
    }
  }

  // Run AI solver
  function handleShowAI() {
    const result = runBacktracking(states);
    setAiAssignments(result.assignments);
    setShowAI(true);
    setMessage(
      "AI solved it using " +
        new Set(Object.values(result.assignments)).size +
        " colors!"
    );
  }

  // Reset everything
  function handleReset() {
    setAssignments({});
    setSelectedColor("red");
    setSelectedState(null);
    setConflictState(null);
    setAiAssignments(null);
    setShowAI(false);
    setMessage("Click a state and color it!");
    setPlayerDone(false);
  }

  const currentAssignments = showAI ? aiAssignments : assignments;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Message Bar */}
      <div
        style={{
          padding: "10px 16px",
          background: conflictState ? "#742a2a" : "#1a1a2e",
          borderRadius: "8px",
          border: "1px solid",
          borderColor: conflictState ? "#e53e3e" : "#2d2d44",
          transition: "all 0.3s ease",
        }}
      >
        <p style={{ color: "#e2e8f0", fontSize: "13px", margin: 0 }}>
          {message}
        </p>
      </div>

      {/* Toggle Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => setShowAI(false)}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid",
            borderColor: !showAI ? "#7c3aed" : "#2d2d44",
            background: !showAI ? "#7c3aed" : "transparent",
            color: !showAI ? "white" : "#a0aec0",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          Your Solution
        </button>

        <button
          onClick={handleShowAI}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid",
            borderColor: showAI ? "#38a169" : "#2d2d44",
            background: showAI ? "#38a169" : "transparent",
            color: showAI ? "white" : "#a0aec0",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          AI Solution
        </button>
      </div>

      {/* Map */}
      <div
        style={{
          background: "#0d0d1a",
          borderRadius: "12px",
          border: "1px solid #2d2d44",
          padding: "16px",
        }}
      >
        <svg viewBox="0 0 400 500" style={{ width: "100%", height: "auto" }}>
          {states.map((state) => {
            const color = currentAssignments[state]
              ? COLOR_MAP[currentAssignments[state]]
              : COLOR_MAP.default;

            const isSelected = selectedState === state;
            const isConflictState = conflictState === state;

            return (
              <path
                key={state}
                d={indiaMapPaths[state]}
                fill={isConflictState ? "#FC8181" : color}
                stroke={isSelected ? "white" : "#4a5568"}
                strokeWidth={isSelected ? "2" : "0.8"}
                style={{
                  cursor: showAI ? "default" : "pointer",
                  transition: "fill 0.3s ease",
                }}
                onClick={() => handleStateClick(state)}
              >
                <title>{state}</title>
              </path>
            );
          })}
        </svg>
      </div>

      {/* Color Picker */}
      {!showAI && (
        <ColorPicker
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
        />
      )}
      
      {/* Comparison */}
      {showAI && (
        <div
          style={{
            padding: "16px",
            background: "#1a1a2e",
            borderRadius: "12px",
            border: "1px solid #2d2d44",
          }}
        >
          <p
            style={{
              color: "#e2e8f0",
              fontSize: "14px",
              fontWeight: "600",
              margin: "0 0 12px 0",
            }}
          >
            Comparison
          </p>

          <div style={{ display: "flex", gap: "16px" }}>
            <div>
              <p
                style={{
                  color: "#a0aec0",
                  fontSize: "12px",
                  margin: "0 0 4px 0",
                }}
              >
                Your colors used
              </p>
              <p
                style={{
                  color: "#FC8181",
                  fontSize: "22px",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                {new Set(Object.values(assignments)).size || 0}
              </p>
            </div>

            <div>
              <p
                style={{
                  color: "#a0aec0",
                  fontSize: "12px",
                  margin: "0 0 4px 0",
                }}
              >
                AI colors used
              </p>
              <p
                style={{
                  color: "#68D391",
                  fontSize: "22px",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                {new Set(Object.values(aiAssignments || {})).size}
              </p>
            </div>

            <div>
              <p
                style={{
                  color: "#a0aec0",
                  fontSize: "12px",
                  margin: "0 0 4px 0",
                }}
              >
                Your states colored
              </p>
              <p
                style={{
                  color: "#63B3ED",
                  fontSize: "22px",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                {Object.keys(assignments).length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reset Button */}
      <button
        onClick={handleReset}
        style={{
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
  );
}

export default PlayerMode;