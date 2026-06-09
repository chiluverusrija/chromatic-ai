import indiaAdjacency from "../data/indiaAdjacency.js";

// Check if a color is safe to assign to a state
function isSafe(state, color, assignments, adjacency) {
  const neighbors = adjacency[state] || [];
  for (let neighbor of neighbors) {
    if (assignments[neighbor] === color) {
      return false;
    }
  }
  return true;
}

// Count how many valid colors remain for a state
function remainingValues(state, assignments, adjacency, colors) {
  return colors.filter((color) => isSafe(state, color, assignments, adjacency)).length;
}

// MRV — pick the state with fewest valid colors remaining
function selectMRVState(states, assignments, adjacency, colors) {
  const unassigned = states.filter((s) => !assignments[s]);
  return unassigned.reduce((minState, state) => {
    const minRemaining = remainingValues(minState, assignments, adjacency, colors);
    const stateRemaining = remainingValues(state, assignments, adjacency, colors);
    return stateRemaining < minRemaining ? state : minState;
  });
}

// Core MRV Backtracking Algorithm
function mrvBacktrack(states, assignments = {}, steps = [], adjacency, colors) {
  if (Object.keys(assignments).length === states.length) {
    return { success: true, assignments, steps };
  }

  const state = selectMRVState(states, assignments, adjacency, colors);

  for (let color of colors) {
    if (isSafe(state, color, assignments, adjacency)) {
      assignments[state] = color;
      steps.push({
        state,
        color,
        type: "assign",
        snapshot: { ...assignments },
      });

      const result = mrvBacktrack(states, assignments, steps, adjacency, colors);
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
export function runMRV(states, adjacency = indiaAdjacency, colors = ["red", "green", "blue", "yellow"]) {
  const startTime = performance.now();
  const steps = [];
  const result = mrvBacktrack([...states], {}, steps, adjacency, colors);
  const endTime = performance.now();

  return {
    assignments: result.assignments,
    steps,
    nodesExplored: steps.filter((s) => s.type === "assign").length,
    backtracks: steps.filter((s) => s.type === "backtrack").length,
    timeTaken: (endTime - startTime).toFixed(2),
  };
}