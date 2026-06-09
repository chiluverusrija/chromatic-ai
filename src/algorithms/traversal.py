import json

def run_bfs(start_state, adjacency_list):
    """
    Runs Breadth-First Search (BFS) starting from start_state.
    Returns a dict with 'steps' (each step logs queue state, visited state, and active edges) and 'visited'.
    """
    steps = []
    visited = set()
    queue = []
    parent_map = {}

    if not start_state or start_state not in adjacency_list:
        return {"steps": steps, "visited": []}

    # Initialize queue and visited
    queue.append(start_state)
    visited.add(start_state)
    parent_map[start_state] = None

    steps.append({
        "type": "discover",
        "node": start_state,
        "queue": list(queue),
        "visited": list(visited),
        "activeEdge": None,
        "log": f"Initialized BFS queue with start state: {start_state}"
    })

    while len(queue) > 0:
        current = queue.pop(0)

        steps.append({
            "type": "visit",
            "node": current,
            "queue": list(queue),
            "visited": list(visited),
            "activeEdge": None,
            "log": f"Visiting state: {current}"
        })

        neighbors = adjacency_list.get(current, [])
        for neighbor in neighbors:
            if neighbor not in visited:
                visited.add(neighbor)
                parent_map[neighbor] = current
                queue.append(neighbor)

                steps.append({
                    "type": "discover",
                    "node": neighbor,
                    "queue": list(queue),
                    "visited": list(visited),
                    "activeEdge": {"from": current, "to": neighbor},
                    "log": f"Discovered unvisited neighbor: {neighbor} (added to queue)"
                })
            else:
                steps.append({
                    "type": "skip",
                    "node": neighbor,
                    "queue": list(queue),
                    "visited": list(visited),
                    "activeEdge": {"from": current, "to": neighbor},
                    "log": f"Neighbor {neighbor} already visited, skipping"
                })

    return {
        "steps": steps,
        "visited": list(visited)
    }

def run_dfs(start_state, adjacency_list):
    """
    Runs Depth-First Search (DFS) starting from start_state.
    Returns a dict with 'steps' (each step logs stack state, visited state, and active edges) and 'visited'.
    """
    steps = []
    visited = set()
    stack = []
    parent_map = {}

    if not start_state or start_state not in adjacency_list:
        return {"steps": steps, "visited": []}

    # Initialize stack
    stack.append(start_state)

    steps.append({
        "type": "discover",
        "node": start_state,
        "stack": list(stack),
        "visited": list(visited),
        "activeEdge": None,
        "log": f"Push start state to DFS stack: {start_state}"
    })

    while len(stack) > 0:
        current = stack.pop()

        if current in visited:
            steps.append({
                "type": "skip",
                "node": current,
                "stack": list(stack),
                "visited": list(visited),
                "activeEdge": None,
                "log": f"State {current} popped from stack but already visited, skipping"
            })
            continue

        visited.add(current)
        steps.append({
            "type": "visit",
            "node": current,
            "stack": list(stack),
            "visited": list(visited),
            "activeEdge": None,
            "log": f"Visiting state (popped from stack): {current}"
        })

        neighbors = adjacency_list.get(current, [])
        # Reverse to visit in original order (stack pop pops last-in first-out)
        reversed_neighbors = list(reversed(neighbors))

        for neighbor in reversed_neighbors:
            if neighbor not in visited:
                parent_map[neighbor] = current
                stack.append(neighbor)

                steps.append({
                    "type": "discover",
                    "node": neighbor,
                    "stack": list(stack),
                    "visited": list(visited),
                    "activeEdge": {"from": current, "to": neighbor},
                    "log": f"Discovered unvisited neighbor: {neighbor} (pushed to stack)"
                })
            else:
                steps.append({
                    "type": "skip",
                    "node": neighbor,
                    "stack": list(stack),
                    "visited": list(visited),
                    "activeEdge": {"from": current, "to": neighbor},
                    "log": f"Neighbor {neighbor} already visited, skipping"
                })

    return {
        "steps": steps,
        "visited": list(visited)
    }
