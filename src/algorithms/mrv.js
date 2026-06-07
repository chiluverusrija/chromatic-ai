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

// Count how many valid colors remain for a state
function remainingValues(state, assignments) {
  return COLORS.filter((color) => isSafe(state, color, assignments)).length;
}

// MRV — pick the state with fewest valid colors remaining
function selectMRVState(states, assignments) {
  const unassigned = states.filter((s) => !assignments[s]);
  return unassigned.reduce((minState, state) => {
    const minRemaining = remainingValues(minState, assignments);
    const stateRemaining = remainingValues(state, assignments);
    return stateRemaining < minRemaining ? state : minState;
  });
}

// Core MRV Backtracking Algorithm
function mrvBacktrack(states, assignments = {}, steps = []) {
  // If all states assigned we are done
  if (Object.keys(assignments).length === states.length) {
    return { success: true, assignments, steps };
  }

  // Pick the most constrained state
  const state = selectMRVState(states, assignments);

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
      const result = mrvBacktrack(states, assignments, steps);
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

// Run MRV and return result with performance stats
export function runMRV(states) {
  const startTime = performance.now();
  const steps = [];
  const result = mrvBacktrack([...states], {}, steps);
  const endTime = performance.now();

  return {
    assignments: result.assignments,
    steps,
    nodesExplored: steps.filter((s) => s.type === "assign").length,
    backtracks: steps.filter((s) => s.type === "backtrack").length,
    timeTaken: (endTime - startTime).toFixed(2),
  };
}