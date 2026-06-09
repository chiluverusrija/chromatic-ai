// Raw Python code for BFS and DFS to be parsed by Pyodide and displayed in the debugger panel.

export const BFS_PYTHON = `def run_bfs(start_state, adjacency_list):
    visited = set()
    queue = []
    steps = []

    # 1. Initialize BFS
    queue.append(start_state)
    visited.add(start_state)
    
    steps.append({
        "type": "discover",
        "node": start_state,
        "queue": list(queue),
        "visited": list(visited)
    })

    # 2. Main Loop
    while len(queue) > 0:
        current = queue.pop(0) # Visit node
        
        steps.append({
            "type": "visit",
            "node": current,
            "queue": list(queue),
            "visited": list(visited)
        })

        neighbors = adjacency_list.get(current, [])
        for neighbor in neighbors:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor) # Enqueue
                
                steps.append({
                    "type": "discover",
                    "node": neighbor,
                    "queue": list(queue),
                    "visited": list(visited)
                })
            else:
                # Skip neighbor (visited)
                steps.append({
                    "type": "skip",
                    "node": neighbor,
                    "queue": list(queue),
                    "visited": list(visited)
                })

    return {"steps": steps, "visited": list(visited)}`;

export const DFS_PYTHON = `def run_dfs(start_state, adjacency_list):
    visited = set()
    stack = []
    steps = []

    # 1. Initialize DFS
    stack.append(start_state)
    
    steps.append({
        "type": "discover",
        "node": start_state,
        "stack": list(stack),
        "visited": list(visited)
    })

    # 2. Main Loop
    while len(stack) > 0:
        current = stack.pop() # Pop from stack
        
        if current in visited:
            # Skip node (already visited)
            steps.append({
                "type": "skip",
                "node": current,
                "stack": list(stack),
                "visited": list(visited)
            })
            continue

        visited.add(current) # Visit node
        
        steps.append({
            "type": "visit",
            "node": current,
            "stack": list(stack),
            "visited": list(visited)
        })

        neighbors = adjacency_list.get(current, [])
        for neighbor in reversed(neighbors):
            if neighbor not in visited:
                stack.append(neighbor) # Push to stack
                
                steps.append({
                    "type": "discover",
                    "node": neighbor,
                    "stack": list(stack),
                    "visited": list(visited)
                })
            else:
                # Skip neighbor (visited)
                steps.append({
                    "type": "skip",
                    "node": neighbor,
                    "stack": list(stack),
                    "visited": list(visited)
                })

    return {"steps": steps, "visited": list(visited)}`;
