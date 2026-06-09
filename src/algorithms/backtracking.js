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

// Core Backtracking Algorithm
export function backtrack(states, assignments = {}, steps = [], adjacency, colors) {
  if (Object.keys(assignments).length === states.length) {
    return { success: true, assignments, steps };
  }

  // Pick next unassigned state
  const state = states.find((s) => !assignments[s]);

  for (let color of colors) {
    if (isSafe(state, color, assignments, adjacency)) {
      assignments[state] = color;
      steps.push({
        state,
        color,
        type: "assign",
        snapshot: { ...assignments },
      });

      const result = backtrack(states, assignments, steps, adjacency, colors);
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
export function runBacktracking(states, adjacency = indiaAdjacency, colors = ["red", "green", "blue", "yellow"]) {
  const startTime = performance.now();
  const steps = [];

  const backtrackingOrder = [
    "Chhattisgarh", "Himachal Pradesh", "Tripura", "Madhya Pradesh", "Bihar",
    "West Bengal", "Goa", "Odisha", "Assam", "Haryana", "Delhi", "Punjab",
    "Ladakh", "Sikkim", "Tamil Nadu", "Rajasthan", "Jharkhand", "Telangana",
    "Maharashtra", "Nagaland", "Mizoram", "Gujarat", "Karnataka",
    "Arunachal Pradesh", "Andhra Pradesh", "Manipur", "Uttarakhand",
    "Meghalaya", "Jammu & Kashmir", "Uttar Pradesh", "Kerala"
  ];

  const orderedStates = backtrackingOrder.filter((s) => states.includes(s));
  const remainingStates = states.filter((s) => !backtrackingOrder.includes(s));
  const finalOrder = [...orderedStates, ...remainingStates];

  const result = backtrack(finalOrder, {}, steps, adjacency, colors);
  const endTime = performance.now();

  return {
    assignments: result.assignments,
    steps,
    nodesExplored: steps.filter((s) => s.type === "assign").length,
    backtracks: steps.filter((s) => s.type === "backtrack").length,
    timeTaken: (endTime - startTime).toFixed(2),
  };
}