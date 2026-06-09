import React, { useState, useMemo } from "react";
import { runBacktracking } from "../algorithms/backtracking.js";
import ColorPicker from "./ColorPicker.jsx";

const COLOR_MAP = {
  red: "#FF6B6B",
  green: "#68D391",
  blue: "#63B3ED",
  yellow: "#F6E05E",
  default: "#1e1e38",
};

// SVG path parser to compute centroid
function getCentroid(pathString) {
  if (!pathString) return { x: 200, y: 250 };
  const coords = pathString.match(/-?\d+(\.\d+)?/g);
  if (!coords) return { x: 200, y: 250 };
  let sumX = 0, sumY = 0, count = 0;
  for (let i = 0; i < coords.length; i += 2) {
    if (coords[i + 1] !== undefined) {
      sumX += parseFloat(coords[i]);
      sumY += parseFloat(coords[i + 1]);
      count++;
    }
  }
  return {
    x: count > 0 ? sumX / count : 200,
    y: count > 0 ? sumY / count : 250,
  };
}

function PlayerMode({ activeMapModel }) {
  const states = activeMapModel.states || [];
  const paths = activeMapModel.paths || {};
  const adjacency = activeMapModel.adjacency || {};
  const abbreviations = activeMapModel.abbreviations || {};
  const isMapModel = activeMapModel.type === "map";

  // Game States
  const [assignments, setAssignments] = useState({});
  const [selectedColor, setSelectedColor] = useState("red");
  const [selectedState, setSelectedState] = useState(null);
  const [conflictState, setConflictState] = useState(null);
  const [aiAssignments, setAiAssignments] = useState(null);
  const [showAI, setShowAI] = useState(false);
  const [message, setMessage] = useState("Select a color and tap a node to begin!");
  const [isError, setIsError] = useState(false);

  // Difficulty States
  const [difficulty, setDifficulty] = useState("medium"); // easy | medium | hard
  const [hoveredState, setHoveredState] = useState(null);
  const [blindSubmitted, setBlindSubmitted] = useState(false);
  const [validationConflicts, setValidationConflicts] = useState([]);

  // Calculate centroids for maps
  const centroids = useMemo(() => {
    const map = {};
    if (isMapModel) {
      states.forEach((state) => {
        const pathStr = paths[state];
        if (pathStr) {
          map[state] = getCentroid(pathStr);
        }
      });
    }
    return map;
  }, [activeMapModel, states, paths, isMapModel]);

  const getNodePosition = (state) => {
    if (isMapModel) {
      return centroids[state] || { x: 200, y: 250 };
    }
    return activeMapModel.mapCoordinates[state] || { x: 200, y: 250 };
  };

  // Compute unique edges for abstract graphs
  const edges = useMemo(() => {
    const list = [];
    const seen = new Set();
    Object.entries(adjacency).forEach(([u, neighbors]) => {
      neighbors.forEach((v) => {
        const edgeKey = [u, v].sort().join("-");
        if (!seen.has(edgeKey)) {
          seen.add(edgeKey);
          list.push({ from: u, to: v });
        }
      });
    });
    return list;
  }, [adjacency]);

  // Check if coloring is safe for a state
  function hasConflict(state, color, currentAssignments) {
    const neighbors = adjacency[state] || [];
    return neighbors.some((n) => currentAssignments[n] === color);
  }

  // Handle state click
  function handleStateClick(state) {
    if (showAI) return;
    setSelectedState(state);

    if (!selectedColor) {
      setMessage("Please select a color from the picker first!");
      setIsError(true);
      return;
    }

    // Blind mode (Hard difficulty): ignore safety checks on placement
    if (difficulty === "hard") {
      const newAssignments = { ...assignments, [state]: selectedColor };
      setAssignments(newAssignments);
      setMessage(`Assigned ${selectedColor.toUpperCase()} to ${state} (Blind Mode)`);
      setIsError(false);
      setBlindSubmitted(false); // Reset validation on new click
      setValidationConflicts([]);
      return;
    }

    // Easy and Medium modes: immediately validate constraint safety
    if (hasConflict(state, selectedColor, assignments)) {
      setConflictState(state);
      setMessage(`Conflict! A neighbor of ${state} already uses ${selectedColor.toUpperCase()}.`);
      setIsError(true);
      setTimeout(() => setConflictState(null), 1000);
      return;
    }

    const newAssignments = { ...assignments, [state]: selectedColor };
    setAssignments(newAssignments);
    setConflictState(null);
    setIsError(false);
    setMessage(`Colored ${state} successfully!`);

    if (Object.keys(newAssignments).length === states.length) {
      setMessage("Congratulations! You colored the whole graph conflict-free!");
    }
  }

  // Submit and validate solution in Hard (Blind) mode
  function handleSubmitSolution() {
    const conflicts = [];
    Object.entries(assignments).forEach(([state, color]) => {
      const neighbors = adjacency[state] || [];
      neighbors.forEach((n) => {
        if (assignments[n] === color) {
          conflicts.push(state);
          conflicts.push(n);
        }
      });
    });

    const uniqueConflicts = Array.from(new Set(conflicts));
    setValidationConflicts(uniqueConflicts);
    setBlindSubmitted(true);

    if (uniqueConflicts.length > 0) {
      setMessage(`Validation Failed! Found conflicts in ${uniqueConflicts.length} nodes (highlighted in red).`);
      setIsError(true);
    } else {
      const allColored = Object.keys(assignments).length === states.length;
      if (allColored) {
        setMessage("Perfect Score! 100/100. Graph colored conflict-free!");
        setIsError(false);
      } else {
        setMessage(`No conflicts found so far! Progress: ${Object.keys(assignments).length}/${states.length} nodes colored.`);
        setIsError(false);
      }
    }
  }

  // Run AI solver
  function handleShowAI() {
    const result = runBacktracking(states, adjacency);
    setAiAssignments(result.assignments);
    setShowAI(true);
    setIsError(false);
    setMessage(
      `AI completed coloring using ${new Set(Object.values(result.assignments)).size} colors!`
    );
  }

  // Reset
  function handleReset() {
    setAssignments({});
    setSelectedColor("red");
    setSelectedState(null);
    setConflictState(null);
    setAiAssignments(null);
    setShowAI(false);
    setIsError(false);
    setBlindSubmitted(false);
    setValidationConflicts([]);
    setMessage("Select a color and tap a node to begin!");
  }

  const currentAssignments = showAI ? aiAssignments : assignments;
  const coloredCount = Object.keys(assignments).length;
  const progressPercent = (coloredCount / states.length) * 100;

  // Easy mode hover helper: Check if state is safe to color
  const isHoveredStateSafe = hoveredState ? !hasConflict(hoveredState, selectedColor, assignments) : true;
  const hoveredNeighbors = hoveredState ? (adjacency[hoveredState] || []) : [];

  return (
    <div className="player-mode-container fade-in">
      {/* Top Banner Message */}
      <div className={`status-banner ${conflictState || (blindSubmitted && validationConflicts.length > 0) ? "conflict" : isError ? "error" : "success"}`}>
        <div className="banner-glow" />
        <span className="banner-icon">{conflictState || isError ? "⚠️" : "💡"}</span>
        <p className="banner-text">{message}</p>
      </div>

      {/* Mode Switches */}
      <div className="tab-buttons">
        <button
          className={`tab-btn ${!showAI ? "active" : ""}`}
          onClick={() => setShowAI(false)}
        >
          🎮 Manual Coloring Mode
        </button>
        <button
          className={`tab-btn secondary ${showAI ? "active" : ""}`}
          onClick={handleShowAI}
        >
          🧠 Show AI Solution
        </button>
      </div>

      <div className="player-layout">
        {/* Left Side: Map Visualizer */}
        <div className="map-card glass-panel">
          <div className="panel-header">
            <h3>{activeMapModel.name} Board</h3>
            <span className="badge">{showAI ? "AI SOLUTION" : `PLAY MODE - ${difficulty.toUpperCase()}`}</span>
          </div>

          <div className="svg-wrapper">
            <svg viewBox="0 0 400 500" className="india-svg">
              <defs>
                <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. Map paths for realistic map models */}
              {isMapModel && (
                <g className="map-group">
                  {states.map((state) => {
                    const colorKey = currentAssignments[state] || "default";
                    const colorValue = COLOR_MAP[colorKey];
                    const isSelected = selectedState === state;
                    const isConflicting = conflictState === state || (blindSubmitted && validationConflicts.includes(state));

                    // Easy Mode Border logic:
                    let strokeColor = isSelected ? "#FFFFFF" : "#3F3F46";
                    let strokeWidthValue = isSelected ? "2.5" : "1";
                    
                    if (difficulty === "easy" && hoveredState && !showAI) {
                      if (state === hoveredState) {
                        strokeColor = isHoveredStateSafe ? "#10b981" : "#ef4444";
                        strokeWidthValue = "2.8";
                      } else if (hoveredNeighbors.includes(state) && assignments[state] === selectedColor) {
                        strokeColor = "#f87171"; // Conflicting neighbor glows red
                        strokeWidthValue = "2.2";
                      }
                    }

                    return (
                      <path
                        key={state}
                        d={paths[state]}
                        fill={isConflicting ? "#EF4444" : colorValue}
                        stroke={strokeColor}
                        strokeWidth={strokeWidthValue}
                        filter={isConflicting ? "url(#glow-red)" : "none"}
                        className={`state-path ${showAI ? "disabled" : "interactive"}`}
                        onClick={() => handleStateClick(state)}
                        onMouseEnter={() => !showAI && setHoveredState(state)}
                        onMouseLeave={() => !showAI && setHoveredState(null)}
                        style={{ transition: "fill 0.3s ease, stroke-width 0.2s ease" }}
                      >
                        <title>{`${state} (${currentAssignments[state] || "Uncolored"})`}</title>
                      </path>
                    );
                  })}
                </g>
              )}

              {/* 2. Abstract Graph Edges */}
              {!isMapModel && (
                <g className="edges-group">
                  {edges.map((edge, idx) => {
                    const uPos = getNodePosition(edge.from);
                    const vPos = getNodePosition(edge.to);
                    if (!uPos || !vPos) return null;

                    return (
                      <line
                        key={idx}
                        x1={uPos.x}
                        y1={uPos.y}
                        x2={vPos.x}
                        y2={vPos.y}
                        stroke="#4b5563"
                        strokeWidth="1.5"
                        opacity="0.3"
                      />
                    );
                  })}
                </g>
              )}

              {/* 3. Abstract Graph Nodes */}
              {!isMapModel && (
                <g className="nodes-group">
                  {states.map((state) => {
                    const pos = getNodePosition(state);
                    if (!pos) return null;

                    const colorKey = currentAssignments[state] || "default";
                    const colorValue = COLOR_MAP[colorKey];
                    const isSelected = selectedState === state;
                    const isConflicting = conflictState === state || (blindSubmitted && validationConflicts.includes(state));

                    const r = 14;

                    // Easy Mode Border logic:
                    let strokeColor = isSelected ? "#FFFFFF" : "#111827";
                    let strokeWidthValue = isSelected ? "2.5" : "1";
                    
                    if (difficulty === "easy" && hoveredState && !showAI) {
                      if (state === hoveredState) {
                        strokeColor = isHoveredStateSafe ? "#10b981" : "#ef4444";
                        strokeWidthValue = "2.8";
                      } else if (hoveredNeighbors.includes(state) && assignments[state] === selectedColor) {
                        strokeColor = "#f87171";
                        strokeWidthValue = "2.2";
                      }
                    }

                    return (
                      <g
                        key={state}
                        className="node-element"
                        onClick={() => handleStateClick(state)}
                        onMouseEnter={() => !showAI && setHoveredState(state)}
                        onMouseLeave={() => !showAI && setHoveredState(null)}
                      >
                        {isConflicting && (
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={r + 4.5}
                            fill="none"
                            stroke="#EF4444"
                            strokeWidth="2.5"
                            className="pulse"
                          />
                        )}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={r}
                          fill={isConflicting ? "#EF4444" : colorValue}
                          stroke={strokeColor}
                          strokeWidth={strokeWidthValue}
                          className="graph-node-dot"
                          style={{ transition: "fill 0.3s ease" }}
                        />
                        <text
                          x={pos.x}
                          y={pos.y + 3.5}
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="9px"
                          fontWeight="700"
                          className="node-abbr"
                          pointerEvents="none"
                        >
                          {abbreviations[state] || state.slice(0, 2).toUpperCase()}
                        </text>
                        <title>{state}</title>
                      </g>
                    );
                  })}
                </g>
              )}
            </svg>
          </div>

          {/* Progress Bar */}
          {!showAI && (
            <div className="progress-section">
              <div className="progress-label">
                <span>Coloring Progress</span>
                <span>{coloredCount} / {states.length} Nodes</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Colors and Statistics */}
        <div className="player-sidebar">
          {/* Difficulty Selection */}
          {!showAI && (
            <div className="sidebar-card glass-panel">
              <label className="deck-lbl">Play Difficulty</label>
              <div className="difficulty-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "6px", marginTop: "4px" }}>
                {["easy", "medium", "hard"].map((level) => (
                  <button
                    key={level}
                    onClick={() => { setDifficulty(level); handleReset(); }}
                    className={`speed-btn ${difficulty === level ? "active" : ""}`}
                    style={{ textTransform: "capitalize", padding: "8px 10px", fontSize: "11px", textAlign: "left" }}
                  >
                    {level === "easy" && "🟢 Easy (Safe Warnings)"}
                    {level === "medium" && "🟡 Medium (Standard Check)"}
                    {level === "hard" && "🔴 Hard (Blind Validation)"}
                  </button>
                ))}
              </div>
              <span className="difficulty-info-lbl" style={{ fontSize: "10px", color: "var(--text-secondary)", marginTop: "6px", display: "block", lineHeight: "1.3" }}>
                {difficulty === "easy" && "✨ Green glows show safe regions. Red glows identify conflicts on-hover."}
                {difficulty === "medium" && "✨ Play with standard rules: immediate conflict warning on clicks."}
                {difficulty === "hard" && "✨ Blind coloring! Color all nodes without prompts, then click 'Submit Solution' to validate."}
              </span>
            </div>
          )}

          {/* Color Selector */}
          {!showAI && (
            <div className="sidebar-card glass-panel">
              <ColorPicker
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />
            </div>
          )}

          {/* Stats & Compare Panel */}
          <div className="sidebar-card glass-panel">
            <div className="panel-header">
              <h3>Coloring Statistics</h3>
            </div>
            <div className="stats-list">
              <div className="stats-row">
                <span className="stats-name">Your Colors Used</span>
                <span className="stats-val colored">{new Set(Object.values(assignments)).size}</span>
              </div>
              <div className="stats-row">
                <span className="stats-name">AI Colors Used</span>
                <span className="stats-val success-val">{aiAssignments ? new Set(Object.values(aiAssignments)).size : "—"}</span>
              </div>
              <div className="stats-row">
                <span className="stats-name">Minimum Colors Required</span>
                <span className="stats-val info-val">
                  {activeMapModel.id === "petersen" ? 3 : activeMapModel.id === "binary_tree" ? 2 : activeMapModel.id === "cycle_graph" ? (states.length % 2 === 0 ? 2 : 3) : 4}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="action-buttons-vertical" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {difficulty === "hard" && !showAI && (
              <button className="btn-action primary-glow" onClick={handleSubmitSolution}>
                ✅ Submit Solution
              </button>
            )}
            <button className="btn-action reset-btn" onClick={handleReset}>
              🔄 Reset Board
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerMode;