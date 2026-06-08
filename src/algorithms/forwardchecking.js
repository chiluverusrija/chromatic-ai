import indiaAdjacency from "../data/indiaAdjacency.js";

const COLORS = ["red", "green", "blue", "yellow"];

// Build initial domains — all states can use all 4 colors
function buildDomains(states) {
  const domains = {};
  for (let state of states) {
    domains[state] = [...COLORS];
  }
  return domains;
}

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

// Forward checking — after assigning color to state,
// remove that color from all unassigned neighbors domains
function forwardCheck(state, color, domains, assignments) {
  const newDomains = JSON.parse(JSON.stringify(domains));
  const neighbors = indiaAdjacency[state] || [];

  for (let neighbor of neighbors) {
    if (!assignments[neighbor]) {
      // Remove assigned color from neighbor's domain
      newDomains[neighbor] = newDomains[neighbor].filter((c) => c !== color);

      // If any neighbor has empty domain — failure
      if (newDomains[neighbor].length === 0) {
        return null;
      }
    }
  }
  return newDomains;
}

// Pick state with fewest domain values (MRV)
function selectState(states, assignments, domains) {
  const unassigned = states.filter((s) => !assignments[s]);
  return unassigned.reduce((minState, state) => {
    return domains[state].length < domains[minState].length ? state : minState;
  });
}

// Core Forward Checking Algorithm
function fcBacktrack(states, assignments = {}, domains, steps = []) {
  // If all states assigned we are done
  if (Object.keys(assignments).length === states.length) {
    return { success: true, assignments, steps };
  }

  // Pick next state
  const state = selectState(states, assignments, domains);

  for (let color of domains[state]) {
    if (isSafe(state, color, assignments)) {
      // Assign color
      assignments[state] = color;
      steps.push({
        state,
        color,
        type: "assign",
        snapshot: { ...assignments },
      });

      // Forward check — update neighbor domains
      const newDomains = forwardCheck(state, color, domains, assignments);

      if (newDomains !== null) {
        // Recurse with updated domains
        const result = fcBacktrack(states, assignments, newDomains, steps);
        if (result.success) return result;
      }

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

// Run Forward Checking and return result with performance stats
export function runForwardChecking(states) {
  const startTime = performance.now();
  const steps = [];
  const domains = buildDomains(states);
  const result = fcBacktrack([...states], {}, domains, steps);
  const endTime = performance.now();

  return {
    assignments: result.assignments,
    steps,
    nodesExplored: steps.filter((s) => s.type === "assign").length,
    backtracks: steps.filter((s) => s.type === "backtrack").length,
    timeTaken: (endTime - startTime).toFixed(2),
  };
}