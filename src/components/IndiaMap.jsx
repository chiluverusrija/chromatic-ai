import React, { useState, useMemo, useEffect } from "react";

const COLOR_MAP = {
  red: "#FF6B6B",
  green: "#68D391",
  blue: "#63B3ED",
  yellow: "#F6E05E",
  default: "#1e1e38",
  color1: "#F56565", // HSL tailored colors for Chromatic Finder
  color2: "#48BB78",
  color3: "#4299E1",
  color4: "#ECC94B",
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

function IndiaMap({
  assignments = {},
  onStateClick,
  selectedState,
  conflictState,
  mode,
  traversalState = null, // { activeNode, visitedNodes, fringeNodes, activeEdge }
  activeMapModel,
  raceState = null, // { isRace: true, solvers: { backtracking: ..., mrv: ..., forwardChecking: ... } }
}) {
  const [viewType, setViewType] = useState(activeMapModel.type === "map" ? "overlay" : "map"); // "map", "graph", "overlay"

  // Reset viewType when active map/graph changes to prevent layout bugs
  useEffect(() => {
    if (activeMapModel.type === "map") {
      setViewType("overlay");
    } else {
      setViewType("map"); // geometric layout
    }
  }, [activeMapModel.id]);

  const states = activeMapModel.states || [];
  const paths = activeMapModel.paths || {};
  const ABBREVIATIONS = activeMapModel.abbreviations || {};

  // Pre-calculate state centroids (only for map models)
  const centroids = useMemo(() => {
    const map = {};
    if (activeMapModel.type === "map" && activeMapModel.paths) {
      states.forEach((state) => {
        const pathStr = paths[state];
        if (pathStr) {
          map[state] = getCentroid(pathStr);
        }
      });
      // Adjust Delhi for India Map specifically
      if (activeMapModel.id === "india" && map["Delhi"]) {
        map["Delhi"].x += 4;
        map["Delhi"].y -= 4;
      }
    }
    return map;
  }, [activeMapModel, states, paths]);

  // Helper to determine node position dynamically
  const getNodePosition = (state) => {
    if (viewType === "graph") {
      return activeMapModel.graphCoordinates[state] || { x: 200, y: 250 };
    }
    if (activeMapModel.type === "map") {
      return centroids[state] || { x: 200, y: 250 };
    }
    return activeMapModel.mapCoordinates[state] || { x: 200, y: 250 };
  };

  // Compute unique edges dynamically for the current active graph
  const edges = useMemo(() => {
    const list = [];
    const seen = new Set();
    const adjacency = activeMapModel.adjacency || {};

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
  }, [activeMapModel]);

  // Helper to determine node/state color during traversals or standard CSP
  function getStateColor(state, currentAssignments, currentTraversalState) {
    if (currentTraversalState) {
      const { activeNode, visitedNodes = [], fringeNodes = [] } = currentTraversalState;
      if (state === activeNode) return "#7c3aed"; // Active node = Purple
      if (visitedNodes.includes(state)) return "#4f46e5"; // Visited = Deep Indigo
      if (fringeNodes.includes(state)) return "#ea580c"; // Fringe/Queue = Orange
      return "#374151"; // Unvisited = Dark Grey
    }

    if (currentAssignments[state]) {
      return COLOR_MAP[currentAssignments[state]] || COLOR_MAP.default;
    }

    return COLOR_MAP.default;
  }

  const isMapModel = activeMapModel.type === "map";
  const isRaceMode = raceState && raceState.isRace;

  // Reusable sub-renderer for active graph SVGs
  const renderSVGBoard = (currentAssignments, currentConflictState, currentTraversalState, isMini = false) => {
    const boardClass = isMini ? "mini-svg-board" : "india-svg-board";
    
    return (
      <svg viewBox="0 0 400 500" className={boardClass}>
        <defs>
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Map Layers (Only for Realistic maps) */}
        {isMapModel && (viewType === "map" || viewType === "overlay") && (
          <g className="map-group">
            {states.map((state) => {
              const isSelected = selectedState === state;
              const isConflict = currentConflictState === state;
              const baseColor = getStateColor(state, currentAssignments, currentTraversalState);

              return (
                <path
                  key={state}
                  d={paths[state]}
                  fill={isConflict ? "#EF4444" : baseColor}
                  stroke={isSelected ? "#FFF" : "#2D3748"}
                  strokeWidth={isSelected ? "2.5" : "0.8"}
                  opacity={viewType === "overlay" ? 0.35 : 1}
                  className={`state-path ${mode === "player" ? "interactive" : ""}`}
                  onClick={() => !isMini && onStateClick && onStateClick(state)}
                  style={{
                    transition: "fill 0.4s ease, opacity 0.3s ease",
                  }}
                >
                  <title>{state}</title>
                </path>
              );
            })}
          </g>
        )}

        {/* 2. Graph Edges */}
        {(!isMapModel || viewType === "graph" || viewType === "overlay") && (
          <g className="edges-group">
            {edges.map((edge, idx) => {
              const uPos = getNodePosition(edge.from);
              const vPos = getNodePosition(edge.to);
              if (!uPos || !vPos) return null;

              const isActiveEdge =
                currentTraversalState?.activeEdge &&
                ((currentTraversalState.activeEdge.from === edge.from &&
                  currentTraversalState.activeEdge.to === edge.to) ||
                  (currentTraversalState.activeEdge.from === edge.to &&
                    currentTraversalState.activeEdge.to === edge.from));

              return (
                <line
                  key={idx}
                  x1={uPos.x}
                  y1={uPos.y}
                  x2={vPos.x}
                  y2={vPos.y}
                  stroke={isActiveEdge ? "#7c3aed" : "#4b5563"}
                  strokeWidth={isActiveEdge ? "3.5" : "1.2"}
                  opacity={isActiveEdge ? 1 : 0.3}
                  className="graph-edge-line"
                />
              );
            })}
          </g>
        )}

        {/* 3. Graph Nodes */}
        {(!isMapModel || viewType === "graph" || viewType === "overlay") && (
          <g className="nodes-group">
            {states.map((state) => {
              const pos = getNodePosition(state);
              if (!pos) return null;

              const nodeColor = getStateColor(state, currentAssignments, currentTraversalState);
              const isSelected = selectedState === state;
              const isConflict = currentConflictState === state;
              const isActiveNode = currentTraversalState?.activeNode === state;

              // Scale down nodes for mini-maps
              const nodeScale = isMini ? 0.75 : 1.0;
              const isBigNode = !isMapModel || viewType === "graph";
              const r = (isBigNode ? 14 : (isSelected ? 7 : isActiveNode ? 6.5 : 5)) * nodeScale;

              return (
                <g key={state} className="node-element" onClick={() => !isMini && onStateClick && onStateClick(state)}>
                  {(isActiveNode || isConflict) && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={r + 4.5}
                      fill="none"
                      stroke={isConflict ? "#EF4444" : "#a78bfa"}
                      strokeWidth="2.5"
                      className="pulse"
                    />
                  )}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={r}
                    fill={isConflict ? "#EF4444" : nodeColor}
                    stroke={isSelected ? "#FFFFFF" : "#111827"}
                    strokeWidth={isSelected ? "2.5" : "1"}
                    className="graph-node-dot"
                    filter={isActiveNode || isConflict ? "url(#node-glow)" : "none"}
                  />
                  
                  <text
                    x={pos.x}
                    y={pos.y + 3.5 * nodeScale}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize={`${9 * nodeScale}px`}
                    fontWeight="700"
                    className="node-abbr"
                    pointerEvents="none"
                  >
                    {ABBREVIATIONS[state] || state.slice(0, 2).toUpperCase()}
                  </text>

                  {isBigNode && !isMini && (
                    <text
                      x={pos.x}
                      y={pos.y + 24}
                      textAnchor="middle"
                      fill="#9ca3af"
                      fontSize="7.5px"
                      fontWeight="600"
                      className="node-label-sub"
                      pointerEvents="none"
                    >
                      {state}
                    </text>
                  )}
                  
                  <title>{state}</title>
                </g>
              );
            })}
          </g>
        )}
      </svg>
    );
  };

  // Algorithm Derby Live Split-Screen View
  if (isRaceMode) {
    return (
      <div className="india-map-card glass-panel fade-in race-board-card">
        <div className="panel-header">
          <div className="title-desc">
            <h3>Algorithm Derby Arena</h3>
            <p className="subtitle-desc">
              Watch Backtracking, MRV Heuristic, and Forward Checking solvers run concurrently
            </p>
          </div>
        </div>

        <div className="race-split-container">
          {Object.entries(raceState.solvers).map(([id, solver]) => {
            const solverTitle =
              id === "backtracking"
                ? "Backtracking"
                : id === "mrv"
                ? "MRV Heuristic"
                : "Forward Checking";

            const podiumIcon =
              solver.rank === 1
                ? "🏆 1st (FASTEST)"
                : solver.rank === 2
                ? "🥈 2nd Place"
                : solver.rank === 3
                ? "🥉 3rd Place"
                : solver.done
                ? "✅ Completed"
                : "⚡ Running...";

            const badgeClass =
              solver.rank === 1
                ? "rank-1"
                : solver.rank === 2
                ? "rank-2"
                : solver.rank === 3
                ? "rank-3"
                : "rank-running";

            return (
              <div key={id} className="race-column glass-panel">
                <div className="race-column-header">
                  <h4>{solverTitle}</h4>
                  <span className={`race-badge ${badgeClass}`}>{podiumIcon}</span>
                </div>
                
                <div className="race-svg-wrapper">
                  {renderSVGBoard(solver.assignments, solver.conflictState, null, true)}
                </div>

                <div className="race-stats">
                  <div className="race-stat-row">
                    <span>Nodes Explored:</span>
                    <strong>{solver.explored}</strong>
                  </div>
                  <div className="race-stat-row">
                    <span>Backtracks:</span>
                    <strong>{solver.backtracks}</strong>
                  </div>
                  <div className="race-stat-row">
                    <span>Elapsed Time:</span>
                    <strong>{solver.time} ms</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Standard Single Board View
  return (
    <div className="india-map-card glass-panel fade-in">
      <div className="panel-header">
        <div className="title-desc">
          <h3>{activeMapModel.name} Board</h3>
          <p className="subtitle-desc">
            {traversalState
              ? "Visualizing BFS/DFS Graph Search Traversal"
              : "Solving Graph Coloring Constraint Satisfaction Problem"}
          </p>
        </div>

        <div className="view-toggle">
          {isMapModel ? (
            <>
              <button
                className={`toggle-btn ${viewType === "map" ? "active" : ""}`}
                onClick={() => setViewType("map")}
              >
                🗺️ Map
              </button>
              <button
                className={`toggle-btn ${viewType === "graph" ? "active" : ""}`}
                onClick={() => setViewType("graph")}
              >
                🕸️ Graph
              </button>
              <button
                className={`toggle-btn ${viewType === "overlay" ? "active" : ""}`}
                onClick={() => setViewType("overlay")}
              >
                ✨ Overlay
              </button>
            </>
          ) : (
            <>
              <button
                className={`toggle-btn ${viewType !== "graph" ? "active" : ""}`}
                onClick={() => setViewType("map")}
              >
                📐 Geometric
              </button>
              <button
                className={`toggle-btn ${viewType === "graph" ? "active" : ""}`}
                onClick={() => setViewType("graph")}
              >
                🕸️ Relaxed
              </button>
            </>
          )}
        </div>
      </div>

      <div className="svg-container">
        {renderSVGBoard(assignments, conflictState, traversalState, false)}
      </div>

      {/* Legend and Info panel */}
      <div className="legend-section">
        {traversalState ? (
          <div className="traversal-legend flex-row">
            <div className="legend-item"><span className="dot active-dot" /> Active</div>
            <div className="legend-item"><span className="dot visited-dot" /> Visited</div>
            <div className="legend-item"><span className="dot queue-dot" /> Queue/Stack</div>
            <div className="legend-item"><span className="dot unvisited-dot" /> Unvisited</div>
          </div>
        ) : (
          <div className="color-legend flex-row">
            {Object.entries(COLOR_MAP)
              .filter(([k]) => !k.startsWith("color") || k.includes("color"))
              .slice(0, 4)
              .map(([colorName, colorValue]) => (
                <div key={colorName} className="legend-item">
                  <span className="dot" style={{ background: colorValue }} />
                  <span className="legend-lbl">{colorName.replace("color", "Color ")}</span>
                </div>
              ))}
            <div className="legend-item">
              <span className="dot default-dot" />
              <span className="legend-lbl">Uncolored</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IndiaMap;