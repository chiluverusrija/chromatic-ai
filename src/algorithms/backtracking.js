import indiaAdjacency from "../data/indiaAdjacency.js";

const COLORS = ["red", "green", "blue", "yellow"];

// Check if a color is safe to assign to a state
function isSafe(state, color, assignments) {
  const neighbors = indiaAdjacency[state] || [];
  for (let neighbor of neighbors) {
    if (assignments[neighbor] === color) {
      return false;
    }
  }
  return true;
}

// Core Backtracking Algorithm
export function backtrack(states, assignments = {}, steps = []) {
  // If all states are assigned, we are done
  if (Object.keys(assignments).length === states.length) {
    return { success: true, assignments, steps };
  }

  // Pick next unassigned state
  const state = states.find((s) => !assignments[s]);

  for (let color of COLORS) {
    if (isSafe(state, color, assignments)) {
      // Assign color
      assignments[state] = color;
      steps.push({
        state,
        color,
        type: "assign",
        snapshot: { ...assignments },
      });

      // Recurse
      const result = backtrack(states, assignments, steps);
      if (result.success) return result;

      // Backtrack
      delete assignments[state];
      steps.push({
        state,
        color,
        type: "backtrack",
        snapshot: { ...assignments },
      });
    }
  }

  return { success: false, assignments, steps };
}

// Run backtracking and return result with performance stats
export function runBacktracking(states) {
  const startTime = performance.now();
  const steps = [];
  const result = backtrack([...states], {}, steps);
  const endTime = performance.now();

  return {
    assignments: result.assignments,
    steps,
    nodesExplored: steps.filter((s) => s.type === "assign").length,
    backtracks: steps.filter((s) => s.type === "backtrack").length,
    timeTaken: (endTime - startTime).toFixed(2),
  };
}