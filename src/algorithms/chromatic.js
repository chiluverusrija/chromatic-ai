import indiaAdjacency from "../data/indiaAdjacency.js";

// Helper to check if a color is safe for a state
function isSafe(state, color, assignments, adjacency) {
  const neighbors = adjacency[state] || [];
  for (const neighbor of neighbors) {
    if (assignments[neighbor] === color) {
      return false;
    }
  }
  return true;
}

// Backtracking solver for a specific k colors
function solveForK(k, states, assignments = {}, steps = [], maxSteps = 1000, adjacency) {
  if (steps.length > maxSteps) {
    return { success: false, limitExceeded: true };
  }

  if (Object.keys(assignments).length === states.length) {
    return { success: true, assignments };
  }

  const state = states.find((s) => !assignments[s]);
  const availableColors = Array.from({ length: k }, (_, i) => `color${i + 1}`);

  for (const color of availableColors) {
    if (isSafe(state, color, assignments, adjacency)) {
      assignments[state] = color;
      steps.push({
        k,
        state,
        color,
        type: "assign",
        snapshot: { ...assignments },
        log: `Attempting ${k} colors: Assigned ${color} to ${state}`
      });

      const result = solveForK(k, states, assignments, steps, maxSteps, adjacency);
      if (result.success) return result;

      // Backtrack
      delete assignments[state];
      steps.push({
        k,
        state,
        color,
        type: "backtrack",
        snapshot: { ...assignments },
        log: `Attempting ${k} colors: Conflict at ${state}, backtracking`
      });
    }
  }

  return { success: false };
}

// Runs Chromatic Number Finder step-by-step
export function runChromaticFinder(states, adjacency = indiaAdjacency) {
  const allAttempts = [];
  let chromaticNumber = 1;
  let success = false;

  for (let k = 1; k <= 4; k++) {
    const steps = [];
    const assignments = {};
    const result = solveForK(k, [...states], assignments, steps, 500, adjacency);

    allAttempts.push({
      k,
      success: result.success && !result.limitExceeded,
      steps: steps,
      assignments: result.success ? result.assignments : null
    });

    if (result.success && !result.limitExceeded) {
      chromaticNumber = k;
      success = true;
      break;
    }
  }

  return {
    success,
    chromaticNumber,
    attempts: allAttempts
  };
}
