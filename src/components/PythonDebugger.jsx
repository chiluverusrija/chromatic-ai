import React from "react";
import { BFS_PYTHON, DFS_PYTHON } from "../algorithms/traversalPyCode.js";

function PythonDebugger({ algorithm, currentStepData, startState }) {
  const isBFS = algorithm === "bfs";
  const codeString = isBFS ? BFS_PYTHON : DFS_PYTHON;
  const lines = codeString.split("\n");

  // Determine which lines to highlight based on current simulation step
  let highlightRange = [-1, -1]; // [startLineIndex, endLineIndex] (0-indexed)

  if (currentStepData) {
    const { type, node, activeEdge } = currentStepData;

    if (isBFS) {
      if (type === "discover" && node === startState) {
        // Initialization
        highlightRange = [5, 14];
      } else if (type === "visit") {
        // Pop node & visit
        highlightRange = [17, 25];
      } else if (type === "discover") {
        // Enqueue unvisited neighbor
        highlightRange = [29, 38];
      } else if (type === "skip") {
        // Skip already visited neighbor
        highlightRange = [39, 46];
      }
    } else {
      // DFS
      if (type === "discover" && node === startState) {
        // Initialization
        highlightRange = [5, 13];
      } else if (type === "skip" && !activeEdge) {
        // Pop visited node from stack, skip
        highlightRange = [17, 24];
      } else if (type === "visit") {
        // Visit popped unvisited node
        highlightRange = [26, 33];
      } else if (type === "discover") {
        // Push unvisited neighbor to stack
        highlightRange = [36, 45];
      } else if (type === "skip" && activeEdge) {
        // Neighbor already visited, skip
        highlightRange = [46, 52];
      }
    }
  }

  return (
    <div className="python-debugger card glass-panel fade-in">
      <div className="panel-header">
        <div className="flex-row items-center gap-8">
          <span className="python-logo">🐍</span>
          <h3>Python Engine Trace</h3>
        </div>
        <span className="badge-python">python 3.13</span>
      </div>

      <p className="debugger-desc">
        Real-time line execution highlight in WebAssembly sandbox:
      </p>

      <div className="debugger-code-container">
        <pre className="debugger-pre">
          {lines.map((line, index) => {
            const isHighlighted =
              index >= highlightRange[0] && index <= highlightRange[1];
            return (
              <div
                key={index}
                className={`debugger-line ${isHighlighted ? "active" : ""}`}
              >
                <span className="line-number">{index + 1}</span>
                <span className="line-content">{line}</span>
                {isHighlighted && <span className="execution-arrow">◀ active</span>}
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}

export default PythonDebugger;
