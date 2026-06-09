import indiaAdjacency from "../data/indiaAdjacency.js";

// BFS Traversal
export function runBFS(startState, states) {
  const steps = [];
  const visited = new Set();
  const queue = [];
  const parentMap = {};

  if (!startState || !states.includes(startState)) {
    return { steps, visited: [] };
  }

  // Initial step
  queue.push(startState);
  visited.add(startState);
  parentMap[startState] = null;

  steps.push({
    type: "discover",
    node: startState,
    queue: [...queue],
    visited: Array.from(visited),
    activeEdge: null,
    log: `Initialized BFS queue with start state: ${startState}`
  });

  while (queue.length > 0) {
    const current = queue.shift();

    steps.push({
      type: "visit",
      node: current,
      queue: [...queue],
      visited: Array.from(visited),
      activeEdge: null,
      log: `Visiting state: ${current}`
    });

    const neighbors = indiaAdjacency[current] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parentMap[neighbor] = current;
        queue.push(neighbor);

        steps.push({
          type: "discover",
          node: neighbor,
          queue: [...queue],
          visited: Array.from(visited),
          activeEdge: { from: current, to: neighbor },
          log: `Discovered unvisited neighbor: ${neighbor} (added to queue)`
        });
      } else {
        steps.push({
          type: "skip",
          node: neighbor,
          queue: [...queue],
          visited: Array.from(visited),
          activeEdge: { from: current, to: neighbor },
          log: `Neighbor ${neighbor} already visited, skipping`
        });
      }
    }
  }

  return {
    steps,
    visited: Array.from(visited)
  };
}

// DFS Traversal
export function runDFS(startState, states) {
  const steps = [];
  const visited = new Set();
  const stack = [];
  const parentMap = {};

  if (!startState || !states.includes(startState)) {
    return { steps, visited: [] };
  }

  stack.push(startState);

  steps.push({
    type: "discover",
    node: startState,
    stack: [...stack],
    visited: Array.from(visited),
    activeEdge: null,
    log: `Push start state to DFS stack: ${startState}`
  });

  while (stack.length > 0) {
    const current = stack.pop();

    if (visited.has(current)) {
      steps.push({
        type: "skip",
        node: current,
        stack: [...stack],
        visited: Array.from(visited),
        activeEdge: null,
        log: `State ${current} popped from stack but already visited, skipping`
      });
      continue;
    }

    visited.add(current);
    steps.push({
      type: "visit",
      node: current,
      stack: [...stack],
      visited: Array.from(visited),
      activeEdge: null,
      log: `Visiting state (popped from stack): ${current}`
    });

    const neighbors = indiaAdjacency[current] || [];
    // We reverse neighbors before pushing so they get popped in their original order
    const reversedNeighbors = [...neighbors].reverse();

    for (const neighbor of reversedNeighbors) {
      if (!visited.has(neighbor)) {
        parentMap[neighbor] = current;
        stack.push(neighbor);

        steps.push({
          type: "discover",
          node: neighbor,
          stack: [...stack],
          visited: Array.from(visited),
          activeEdge: { from: current, to: neighbor },
          log: `Discovered unvisited neighbor: ${neighbor} (pushed to stack)`
        });
      } else {
        steps.push({
          type: "skip",
          node: neighbor,
          stack: [...stack],
          visited: Array.from(visited),
          activeEdge: { from: current, to: neighbor },
          log: `Neighbor ${neighbor} already visited, skipping`
        });
      }
    }
  }

  return {
    steps,
    visited: Array.from(visited)
  };
}
