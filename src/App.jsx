import React, { useState, useEffect, useRef } from "react";
import "./App.css";

import IndiaMap from "./components/IndiaMap.jsx";
import ColorPicker from "./components/ColorPicker.jsx";
import Controls from "./components/Controls.jsx";
import Dashboard from "./components/Dashboard.jsx";
import PlayerMode from "./components/PlayerMode.jsx";
import ExamScheduler from "./components/ExamScheduler.jsx";
import PythonDebugger from "./components/PythonDebugger.jsx";

import { runBacktracking } from "./algorithms/backtracking.js";
import { runMRV } from "./algorithms/mrv.js";
import { runForwardChecking } from "./algorithms/forwardChecking.js";
import { runBFS, runDFS } from "./algorithms/traversal.js";
import { runChromaticFinder } from "./algorithms/chromatic.js";
import { BFS_PYTHON, DFS_PYTHON } from "./algorithms/traversalPyCode.js";
import { MAPS_REGISTRY } from "./data/mapsRegistry.js";

const ALGORITHM_MAP = {
  backtracking: { fn: runBacktracking, label: "Backtracking" },
  mrv: { fn: runMRV, label: "MRV Heuristic" },
  forwardChecking: { fn: runForwardChecking, label: "Forward Checking" },
};

// Natural language explanation builder for Narrated Teach Mode
function getNarratedLog(step, algorithm) {
  if (step.type === "info" || step.type === "success" || step.type === "fail") {
    return step.log;
  }
  
  if (algorithm === "backtracking") {
    if (step.type === "assign") {
      return `🎓 AI Tutor: Assigning color ${step.color.toUpperCase()} to "${step.state}". Adjacency is valid: none of its direct neighbors currently share this color.`;
    } else {
      return `🎓 AI Tutor: Reached a boundary conflict at "${step.state}" (all available colors violate adjacent constraints). Reverting selection and stepping back to try previous branches.`;
    }
  } else if (algorithm === "mrv") {
    if (step.type === "assign") {
      return `🎓 AI Tutor: Under the Minimum Remaining Values (MRV) heuristic, we pick "${step.state}" next because it has the fewest valid color choices left. Assigning color ${step.color.toUpperCase()}.`;
    } else {
      return `🎓 AI Tutor: MRV Solver hit a dead-end at "${step.state}". Reverting the assignment and backtracking to re-evaluate the most constrained nodes.`;
    }
  } else if (algorithm === "forwardChecking") {
    if (step.type === "assign") {
      return `🎓 AI Tutor: Assigned ${step.color.toUpperCase()} to "${step.state}". Forward Checking immediately prunes "${step.color}" from the domains of all its unassigned neighbors to prevent future conflicts.`;
    } else {
      return `🎓 AI Tutor: Forward Checking detected domain exhaustion (a neighbor has 0 valid colors left). Reverting "${step.state}" and backtracking early to save iterations.`;
    }
  }
  
  // Traversals
  if (step.type === "discover") {
    const isQueue = step.log.includes("queue");
    const structName = isQueue ? "FIFO Queue" : "LIFO Stack";
    const actionName = isQueue ? "enqueueing at the end" : "pushing to the top";
    return `🎓 AI Tutor: Discovered neighbor node "${step.node}". It is unvisited, so we register it by ${actionName} of our ${structName} memory buffer.`;
  } else if (step.type === "visit") {
    const isStack = step.log.includes("stack") || step.log.includes("popped");
    const structName = isStack ? "LIFO Stack" : "FIFO Queue";
    const actionName = isStack ? "popping from the top" : "polling from the front";
    return `🎓 AI Tutor: Visiting node "${step.node}". We retrieve it by ${actionName} of our ${structName}, mark it active, and check its connections.`;
  } else if (step.type === "skip") {
    return `🎓 AI Tutor: Node "${step.node}" is already in the visited list. Skipping it to prevent circular loops and graph traversal cycles.`;
  }
  
  return step.log || "";
}

// Canvas Interactive Particles Component
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const particleCount = Math.min(65, Math.floor((width * height) / 22000));
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
      });
    }

    let mouse = { x: null, y: null };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(139, 92, 246, 0.35)";
      ctx.strokeStyle = "rgba(139, 92, 246, 0.06)";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // Connect particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.lineWidth = (1 - dist / 110) * 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Connect to mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - dist / 160) * 0.12})`;
            ctx.lineWidth = (1 - dist / 160) * 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            ctx.strokeStyle = "rgba(139, 92, 246, 0.06)";
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}

function App() {
  const [appSection, setAppSection] = useState("landing"); // landing | sandbox
  const [mode, setMode] = useState("ai");
  const [selectedSpeed, setSelectedSpeed] = useState({ id: "normal", label: "⚡ Normal", ms: 300 });
  const [assignments, setAssignments] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [conflictState, setConflictState] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [dashboardResults, setDashboardResults] = useState([]);
  const [stepLog, setStepLog] = useState([]);

  // Active Map Selection
  const [selectedMapId, setSelectedMapId] = useState("india");
  const activeMapModel = MAPS_REGISTRY[selectedMapId] || MAPS_REGISTRY.india;

  // Solver Difficulty (influences color count limits)
  const [difficulty, setDifficulty] = useState("easy"); // easy (4) | medium (3) | hard (2)

  // Educative Narrated Teach Mode state
  const [narratedTeachMode, setNarratedTeachMode] = useState(true);

  // Solver details derived from difficulty level
  const activeColors = difficulty === "easy"
    ? ["red", "green", "blue", "yellow"]
    : difficulty === "medium"
    ? ["red", "green", "blue"]
    : ["red", "green"];

  // Traversal States
  const [selectedTraversal, setSelectedTraversal] = useState("bfs");
  const [selectedStartState, setSelectedStartState] = useState("Jammu & Kashmir");
  const [traversalState, setTraversalState] = useState(null);

  // CSP Solver parameters
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("backtracking");

  // Python Engine States
  const [usePythonEngine, setUsePythonEngine] = useState(false);
  const [pyodide, setPyodide] = useState(null);
  const [pyodideStatus, setPyodideStatus] = useState("idle"); // idle | loading | ready | error

  // Live Algorithm Derby Race State
  const [raceState, setRaceState] = useState({
    isRace: false,
    solvers: {
      backtracking: { assignments: {}, conflictState: null, explored: 0, backtracks: 0, done: false, time: 0, rank: null },
      mrv: { assignments: {}, conflictState: null, explored: 0, backtracks: 0, done: false, time: 0, rank: null },
      forwardChecking: { assignments: {}, conflictState: null, explored: 0, backtracks: 0, done: false, time: 0, rank: null }
    }
  });

  const intervalRef = useRef(null);
  const stepLogRef = useRef(null);

  // Load Pyodide Environment Dynamically
  const loadPyodideEnv = async () => {
    if (pyodide) return pyodide;
    setPyodideStatus("loading");
    try {
      if (!window.loadPyodide) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }
      const py = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/"
      });
      setPyodide(py);
      setPyodideStatus("ready");
      return py;
    } catch (err) {
      console.error("Pyodide Loader Error:", err);
      setPyodideStatus("error");
      return null;
    }
  };

  // Keep starting state synchronized on active model changes to prevent crashes
  useEffect(() => {
    if (activeMapModel && activeMapModel.states && activeMapModel.states.length > 0) {
      setSelectedStartState(activeMapModel.states[0]);
    }
    handleReset();
  }, [selectedMapId]);

  // Launch a sandbox mode from landing dashboard
  function launchSandbox(selectedMode) {
    setMode(selectedMode);
    setAppSection("sandbox");
    handleReset();
  }

  // Auto-scroll log
  useEffect(() => {
    if (stepLogRef.current) {
      stepLogRef.current.scrollTop = stepLogRef.current.scrollHeight;
    }
  }, [stepLog]);

  // Clean interval on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // Pre-load Pyodide when python engine is toggled
  useEffect(() => {
    if (usePythonEngine && pyodideStatus === "idle") {
      loadPyodideEnv();
    }
  }, [usePythonEngine]);

  function handleStart() {
    if (isRunning) return;

    if (mode === "compare") {
      runAlgorithmRace();
      return;
    }

    if (mode === "traversal") {
      runTraversalAnimation();
      return;
    }

    // Standard CSP Solver Mode
    const algo = ALGORITHM_MAP[selectedAlgorithm];
    if (!algo) return;

    setIsRunning(true);
    setIsDone(false);
    setAssignments({});
    setTraversalState(null);
    setSteps([]);
    setStepLog([]);
    setRaceState({ isRace: false, solvers: {} });
    setCurrentStep(0);

    const result = algo.fn(activeMapModel.states, activeMapModel.adjacency, activeColors);
    const allSteps = result.steps;
    setSteps(allSteps);

    if (selectedSpeed.ms === 0) {
      setAssignments(result.assignments);
      setIsRunning(false);
      setIsDone(true);
      setDashboardResults([
        {
          algorithm: algo.label,
          nodesExplored: result.nodesExplored,
          backtracks: result.backtracks,
          timeTaken: result.timeTaken,
        },
      ]);
      setStepLog([
        { type: "assign", text: `Solved using ${algo.label} (Colors: ${activeColors.join(", ")})!` },
        { type: "assign", text: `Nodes Explored: ${result.nodesExplored}, Backtracks: ${result.backtracks}, Time: ${result.timeTaken}ms` }
      ]);
      return;
    }

    let i = 0;
    intervalRef.current = setInterval(() => {
      if (i >= allSteps.length) {
        clearInterval(intervalRef.current);
        setAssignments(result.assignments);
        setIsRunning(false);
        setIsDone(true);
        setDashboardResults([
          {
            algorithm: algo.label,
            nodesExplored: result.nodesExplored,
            backtracks: result.backtracks,
            timeTaken: result.timeTaken,
          },
        ]);
        return;
      }

      const step = allSteps[i];

      if (step.type === "assign") {
        setAssignments({ ...step.snapshot });
        setConflictState(null);
        
        const logText = narratedTeachMode
          ? getNarratedLog(step, selectedAlgorithm)
          : `Assign ${step.color.toUpperCase()} to ${step.state}`;

        setStepLog((prev) => [
          ...prev,
          { type: "assign", text: logText },
        ]);
      } else {
        setConflictState(step.state);
        
        const logText = narratedTeachMode
          ? getNarratedLog(step, selectedAlgorithm)
          : `Backtrack from ${step.state} (conflict!)`;

        setStepLog((prev) => [
          ...prev,
          { type: "backtrack", text: logText },
        ]);
        setTimeout(() => setConflictState(null), selectedSpeed.ms * 0.8);
      }

      setCurrentStep(i + 1);
      i++;
    }, selectedSpeed.ms);
  }

  // Concurrent Side-by-Side Algorithm Race Loop
  function runAlgorithmRace() {
    setIsRunning(true);
    setIsDone(false);
    setAssignments({});
    setTraversalState(null);
    setSteps([]);
    setStepLog([]);
    setCurrentStep(0);

    const btRes = runBacktracking(activeMapModel.states, activeMapModel.adjacency, activeColors);
    const mrvRes = runMRV(activeMapModel.states, activeMapModel.adjacency, activeColors);
    const fcRes = runForwardChecking(activeMapModel.states, activeMapModel.adjacency, activeColors);

    // Instant Mode Check (selectedSpeed.ms === 0)
    if (selectedSpeed.ms === 0) {
      const solverData = [
        { id: "backtracking", res: btRes },
        { id: "mrv", res: mrvRes },
        { id: "forwardChecking", res: fcRes }
      ];
      solverData.sort((a, b) => {
        const timeDiff = parseFloat(a.res.timeTaken) - parseFloat(b.res.timeTaken);
        if (Math.abs(timeDiff) > 0.01) return timeDiff;
        return a.res.steps.length - b.res.steps.length;
      });
      
      const ranksMap = {};
      solverData.forEach((s, idx) => {
        ranksMap[s.id] = idx + 1;
      });

      const finalRaceState = {
        isRace: true,
        solvers: {
          backtracking: {
            assignments: btRes.assignments,
            conflictState: null,
            explored: btRes.steps.filter(s => s.type === "assign").length,
            backtracks: btRes.steps.filter(s => s.type === "backtrack").length,
            done: true,
            time: Math.round(parseFloat(btRes.timeTaken)),
            rank: ranksMap.backtracking
          },
          mrv: {
            assignments: mrvRes.assignments,
            conflictState: null,
            explored: mrvRes.steps.filter(s => s.type === "assign").length,
            backtracks: mrvRes.steps.filter(s => s.type === "backtrack").length,
            done: true,
            time: Math.round(parseFloat(mrvRes.timeTaken)),
            rank: ranksMap.mrv
          },
          forwardChecking: {
            assignments: fcRes.assignments,
            conflictState: null,
            explored: fcRes.steps.filter(s => s.type === "assign").length,
            backtracks: fcRes.steps.filter(s => s.type === "backtrack").length,
            done: true,
            time: Math.round(parseFloat(fcRes.timeTaken)),
            rank: ranksMap.forwardChecking
          }
        }
      };

      setRaceState(finalRaceState);
      setIsRunning(false);
      setIsDone(true);
      
      setStepLog([
        { type: "assign", text: `🏁 Backtracking solver completed in ${btRes.timeTaken}ms! (Place: ${ranksMap.backtracking})` },
        { type: "assign", text: `🏁 MRV Heuristic solver completed in ${mrvRes.timeTaken}ms! (Place: ${ranksMap.mrv})` },
        { type: "assign", text: `🏁 Forward Checking solver completed in ${fcRes.timeTaken}ms! (Place: ${ranksMap.forwardChecking})` },
        { type: "assign", text: "🏆 Race finished! Compare overall stats across the solvers." }
      ]);

      setDashboardResults([
        { algorithm: "Backtracking", nodesExplored: btRes.nodesExplored, backtracks: btRes.backtracks, timeTaken: btRes.timeTaken },
        { algorithm: "MRV Heuristic", nodesExplored: mrvRes.nodesExplored, backtracks: mrvRes.backtracks, timeTaken: mrvRes.timeTaken },
        { algorithm: "Forward Checking", nodesExplored: fcRes.nodesExplored, backtracks: fcRes.backtracks, timeTaken: fcRes.timeTaken }
      ]);
      return;
    }

    let currentRace = {
      isRace: true,
      solvers: {
        backtracking: { assignments: {}, conflictState: null, explored: 0, backtracks: 0, done: false, time: 0, rank: null },
        mrv: { assignments: {}, conflictState: null, explored: 0, backtracks: 0, done: false, time: 0, rank: null },
        forwardChecking: { assignments: {}, conflictState: null, explored: 0, backtracks: 0, done: false, time: 0, rank: null },
      }
    };
    setRaceState(currentRace);
    setStepLog([{ type: "idle", text: "🏁 The Algorithm Derby Race has started! Watch the solvers color concurrently." }]);

    let btIdx = 0, mrvIdx = 0, fcIdx = 0;
    let btExplored = 0, btBacktracks = 0;
    let mrvExplored = 0, mrvBacktracks = 0;
    let fcExplored = 0, fcBacktracks = 0;
    let ranks = 0;
    const startTime = performance.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Math.round(performance.now() - startTime);
      
      const btStep = btRes.steps[btIdx];
      const mrvStep = mrvRes.steps[mrvIdx];
      const fcStep = fcRes.steps[fcIdx];

      // Lightweight copy instead of slow JSON.parse(JSON.stringify)
      const updatedRace = {
        isRace: true,
        solvers: {
          backtracking: { ...currentRace.solvers.backtracking },
          mrv: { ...currentRace.solvers.mrv },
          forwardChecking: { ...currentRace.solvers.forwardChecking }
        }
      };

      // 1. Backtracking updates
      if (btIdx < btRes.steps.length) {
        if (btStep.type === "assign") btExplored++;
        else if (btStep.type === "backtrack") btBacktracks++;

        updatedRace.solvers.backtracking.assignments = btStep.snapshot;
        updatedRace.solvers.backtracking.conflictState = btStep.type === "backtrack" ? btStep.state : null;
        updatedRace.solvers.backtracking.explored = btExplored;
        updatedRace.solvers.backtracking.backtracks = btBacktracks;
        updatedRace.solvers.backtracking.time = elapsed;
        btIdx++;
      } else if (!updatedRace.solvers.backtracking.done) {
        updatedRace.solvers.backtracking.done = true;
        ranks++;
        updatedRace.solvers.backtracking.rank = ranks;
        updatedRace.solvers.backtracking.time = Math.round(parseFloat(btRes.timeTaken));
        setStepLog(prev => [...prev, { type: "assign", text: `🏁 Backtracking solver completed in ${btRes.timeTaken}ms! (Place: ${ranks})` }]);
      }

      // 2. MRV updates
      if (mrvIdx < mrvRes.steps.length) {
        if (mrvStep.type === "assign") mrvExplored++;
        else if (mrvStep.type === "backtrack") mrvBacktracks++;

        updatedRace.solvers.mrv.assignments = mrvStep.snapshot;
        updatedRace.solvers.mrv.conflictState = mrvStep.type === "backtrack" ? mrvStep.state : null;
        updatedRace.solvers.mrv.explored = mrvExplored;
        updatedRace.solvers.mrv.backtracks = mrvBacktracks;
        updatedRace.solvers.mrv.time = elapsed;
        mrvIdx++;
      } else if (!updatedRace.solvers.mrv.done) {
        updatedRace.solvers.mrv.done = true;
        ranks++;
        updatedRace.solvers.mrv.rank = ranks;
        updatedRace.solvers.mrv.time = Math.round(parseFloat(mrvRes.timeTaken));
        setStepLog(prev => [...prev, { type: "assign", text: `🏁 MRV Heuristic solver completed in ${mrvRes.timeTaken}ms! (Place: ${ranks})` }]);
      }

      // 3. Forward Checking updates
      if (fcIdx < fcRes.steps.length) {
        if (fcStep.type === "assign") fcExplored++;
        else if (fcStep.type === "backtrack") fcBacktracks++;

        updatedRace.solvers.forwardChecking.assignments = fcStep.snapshot;
        updatedRace.solvers.forwardChecking.conflictState = fcStep.type === "backtrack" ? fcStep.state : null;
        updatedRace.solvers.forwardChecking.explored = fcExplored;
        updatedRace.solvers.forwardChecking.backtracks = fcBacktracks;
        updatedRace.solvers.forwardChecking.time = elapsed;
        fcIdx++;
      } else if (!updatedRace.solvers.forwardChecking.done) {
        updatedRace.solvers.forwardChecking.done = true;
        ranks++;
        updatedRace.solvers.forwardChecking.rank = ranks;
        updatedRace.solvers.forwardChecking.time = Math.round(parseFloat(fcRes.timeTaken));
        setStepLog(prev => [...prev, { type: "assign", text: `🏁 Forward Checking solver completed in ${fcRes.timeTaken}ms! (Place: ${ranks})` }]);
      }

      currentRace = updatedRace;
      setRaceState(updatedRace);

      // Finish condition
      if (
        updatedRace.solvers.backtracking.done &&
        updatedRace.solvers.mrv.done &&
        updatedRace.solvers.forwardChecking.done
      ) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setIsDone(true);
        setStepLog(prev => [...prev, { type: "assign", text: "🏆 Race finished! Compare overall stats across the solvers." }]);
        
        setDashboardResults([
          { algorithm: "Backtracking", nodesExplored: btRes.nodesExplored, backtracks: btRes.backtracks, timeTaken: btRes.timeTaken },
          { algorithm: "MRV Heuristic", nodesExplored: mrvRes.nodesExplored, backtracks: mrvRes.backtracks, timeTaken: mrvRes.timeTaken },
          { algorithm: "Forward Checking", nodesExplored: fcRes.nodesExplored, backtracks: fcRes.backtracks, timeTaken: fcRes.timeTaken }
        ]);
      }
    }, selectedSpeed.ms);
  }

  // Traversal step animation
  async function runTraversalAnimation() {
    setIsRunning(true);
    setIsDone(false);
    setAssignments({});
    setSteps([]);
    setStepLog([]);
    setRaceState({ isRace: false, solvers: {} });
    setCurrentStep(0);

    let result = null;

    if (usePythonEngine) {
      let py = pyodide;
      if (!py) {
        py = await loadPyodideEnv();
      }

      if (py) {
        try {
          await py.runPythonAsync(BFS_PYTHON);
          await py.runPythonAsync(DFS_PYTHON);

          py.globals.set("start_state", selectedStartState);
          py.globals.set("adj_list_json", JSON.stringify(activeMapModel.adjacency));

          const runCmd = selectedTraversal === "bfs"
            ? "import json\njson.dumps(run_bfs(start_state, json.loads(adj_list_json)))"
            : "import json\njson.dumps(run_dfs(start_state, json.loads(adj_list_json)))";

          const pythonJSON = await py.runPythonAsync(runCmd);
          result = JSON.parse(pythonJSON);
        } catch (err) {
          console.error("Python engine error, falling back to JS: ", err);
          result = selectedTraversal === "bfs"
            ? runBFS(selectedStartState, activeMapModel.states, activeMapModel.adjacency)
            : runDFS(selectedStartState, activeMapModel.states, activeMapModel.adjacency);
        }
      } else {
        result = selectedTraversal === "bfs"
          ? runBFS(selectedStartState, activeMapModel.states, activeMapModel.adjacency)
          : runDFS(selectedStartState, activeMapModel.states, activeMapModel.adjacency);
      }
    } else {
      result = selectedTraversal === "bfs"
        ? runBFS(selectedStartState, activeMapModel.states, activeMapModel.adjacency)
        : runDFS(selectedStartState, activeMapModel.states, activeMapModel.adjacency);
    }

    const allSteps = result.steps;
    setSteps(allSteps);

    if (selectedSpeed.ms === 0) {
      setIsRunning(false);
      setIsDone(true);
      const lastStep = allSteps[allSteps.length - 1];
      setTraversalState({
        activeNode: null,
        visitedNodes: lastStep.visited,
        fringeNodes: [],
        activeEdge: null,
      });
      setStepLog(allSteps.map(s => ({ type: s.type === "visit" ? "assign" : "backtrack", text: s.log })));
      return;
    }

    let i = 0;
    intervalRef.current = setInterval(() => {
      if (i >= allSteps.length) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setIsDone(true);
        return;
      }

      const step = allSteps[i];

      setTraversalState({
        activeNode: step.type === "visit" ? step.node : null,
        visitedNodes: step.visited,
        fringeNodes: step.queue || step.stack || [],
        activeEdge: step.activeEdge,
      });

      setStepLog((prev) => [
        ...prev,
        {
          type: step.type === "visit" ? "assign" : step.type === "skip" ? "backtrack" : "idle",
          text: narratedTeachMode ? getNarratedLog(step, selectedTraversal) : step.log
        }
      ]);

      setCurrentStep(i + 1);
      i++;
    }, selectedSpeed.ms);
  }

  // Chromatic Number Finder Animation
  function runChromaticFinderAnimation() {
    setIsRunning(true);
    setIsDone(false);
    setAssignments({});
    setTraversalState(null);
    setSteps([]);
    setStepLog([]);
    setRaceState({ isRace: false, solvers: {} });
    setCurrentStep(0);

    const result = runChromaticFinder(activeMapModel.states, activeMapModel.adjacency);
    
    const timeline = [];
    result.attempts.forEach((att) => {
      timeline.push({
        type: "info",
        log: `--- ⚡ Testing Color Assignment with k = ${att.k} ---`,
        snapshot: {}
      });

      att.steps.forEach((step) => {
        timeline.push({
          type: step.type,
          state: step.state,
          color: step.color,
          snapshot: step.snapshot,
          log: `[k=${att.k}] ${step.log}`
        });
      });

      if (att.success) {
        timeline.push({
          type: "success",
          log: `✅ Success! Graph is colorable with k = ${att.k} colors.`,
          snapshot: att.assignments
        });
      } else {
        timeline.push({
          type: "fail",
          log: `❌ Failed! Cannot color map using only ${att.k} colors.`,
          snapshot: {}
        });
      }
    });

    setSteps(timeline);

    if (selectedSpeed.ms === 0) {
      setAssignments(result.attempts[result.attempts.length - 1].assignments || {});
      setIsRunning(false);
      setIsDone(true);
      setStepLog(timeline.map(s => ({ type: s.type === "success" ? "assign" : s.type === "fail" ? "backtrack" : "idle", text: s.log })));
      return;
    }

    let i = 0;
    intervalRef.current = setInterval(() => {
      if (i >= timeline.length) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setIsDone(true);
        return;
      }

      const step = timeline[i];

      if (step.snapshot) {
        setAssignments({ ...step.snapshot });
      }

      if (step.type === "backtrack" || step.type === "fail") {
        setConflictState(step.state || null);
        setTimeout(() => setConflictState(null), selectedSpeed.ms * 0.8);
      }

      setStepLog((prev) => [
        ...prev,
        {
          type: step.type === "success" || step.type === "assign"
            ? "assign"
            : step.type === "fail" || step.type === "backtrack"
            ? "backtrack"
            : "idle",
          text: narratedTeachMode ? getNarratedLog(step, "backtracking") : step.log
        }
      ]);

      setCurrentStep(i + 1);
      i++;
    }, selectedSpeed.ms);
  }

  function runCompare() {
    // Force set sandbox compare mode
    setMode("compare");
    setAppSection("sandbox");
    runAlgorithmRace();
  }

  function handleReset() {
    clearInterval(intervalRef.current);
    setAssignments({});
    setIsRunning(false);
    setIsDone(false);
    setSteps([]);
    setStepLog([]);
    setCurrentStep(0);
    setConflictState(null);
    setSelectedState(null);
    setDashboardResults([]);
    setTraversalState(null);
    setRaceState({ isRace: false, solvers: {} });
  }

  return (
    <div className="app">
      {/* Interactive canvas background */}
      <ParticleCanvas />

      {/* Premium Glassmorphic Header */}
      <div className="header glass-panel">
        <div className="header-left">
          <div className="title-area">
            {appSection === "sandbox" && (
              <button className="home-btn" onClick={() => setAppSection("landing")}>
                🏡 Home Dashboard
              </button>
            )}
            <h1>🎨 Chromatic AI</h1>
            <span className="version-tag">v2.0 Premium</span>
          </div>
          <p className="subtitle">
            Constraint Satisfaction Problems (CSP) & Graph Theory solver Visualizer
          </p>
        </div>
        <div className="header-right">
          <div className="author-info">
            <span className="inst">KL University • CFAI Project</span>
            <span className="team">Srija & Snigdha</span>
          </div>
        </div>
      </div>

      {/* Main View Manager */}
      {appSection === "landing" ? (
        <div className="landing-portal">
          <div className="landing-header fade-in">
            <h1 className="landing-title">CHROMATIC AI</h1>
            <p className="landing-subtitle">
              An Advanced Interactive Platform for Constraint Satisfaction Problems (CSP) & Graph Theory
            </p>
            <div className="author-banner-landing">
              <span>KL University CSE Project</span>
              <span className="bullet">•</span>
              <span>Created by Chiluveru Srija & Patlolla Snigdha</span>
            </div>
          </div>

          {/* Quick Active Graph Selection from Dashboard */}
          <div className="card glass-panel fade-in landing-graph-picker" style={{ padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h4 style={{ color: "#fff", fontSize: "15px", margin: 0 }}>Select Graph Theory Model</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "12px", margin: "4px 0 0 0" }}>Choose a realistic map or abstract graph model for solvers</p>
            </div>
            <select
              value={selectedMapId}
              onChange={(e) => setSelectedMapId(e.target.value)}
              className="custom-select"
              style={{ maxWidth: "250px", background: "rgba(8, 8, 15, 0.8)" }}
            >
              <optgroup label="Realistic Maps">
                {Object.values(MAPS_REGISTRY).filter(m => m.category === "realistic").map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </optgroup>
              <optgroup label="Graph Theory Models">
                {Object.values(MAPS_REGISTRY).filter(m => m.category === "normal").map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="landing-stats-grid fade-in">
            <div className="landing-stat-card glass-panel">
              <span className="stat-icon">🗺️</span>
              <div>
                <h4>{activeMapModel.states.length} Nodes</h4>
                <p>Active Graph Regions</p>
              </div>
            </div>
            <div className="landing-stat-card glass-panel">
              <span className="stat-icon">🕸️</span>
              <div>
                <h4>{Object.values(activeMapModel.adjacency).reduce((sum, n) => sum + n.length, 0) / 2} Edges</h4>
                <p>Node-Link Interconnections</p>
              </div>
            </div>
            <div className="landing-stat-card glass-panel">
              <span className="stat-icon">⚡</span>
              <div>
                <h4>5 Solvers</h4>
                <p>CSP Algos & Traversals</p>
              </div>
            </div>
            <div className="landing-stat-card glass-panel">
              <span className="stat-icon">🐍</span>
              <div>
                <h4>Python Engine</h4>
                <p>WASM WebAssembly sandbox</p>
              </div>
            </div>
          </div>

          <div className="landing-features-grid fade-in">
            <div className="feature-card glass-panel" onClick={() => launchSandbox("ai")}>
              <div className="feature-card-header">
                <span className="feature-icon font-gradient-1">🎨</span>
                <h3>Map CSP Solver</h3>
              </div>
              <p>
                Solve the k-color constraint problem step-by-step. Adjust difficulty constraints (2, 3, or 4 colors) and run Backtracking, MRV, and Forward Checking.
              </p>
              <button className="feature-btn">Launch Solver</button>
            </div>

            <div className="feature-card glass-panel" onClick={() => launchSandbox("traversal")}>
              <div className="feature-card-header">
                <span className="feature-icon font-gradient-2">🔍</span>
                <h3>Graph Traversal</h3>
              </div>
              <p>
                Traverse active networks with BFS/DFS. Powered by client-side Python, see the exact line of Python code execute as nodes light up on maps or relaxed layouts.
              </p>
              <button className="feature-btn">Launch Traversal</button>
            </div>

            <div className="feature-card glass-panel" onClick={() => launchSandbox("chromatic")}>
              <div className="feature-card-header">
                <span className="feature-icon font-gradient-3">🔢</span>
                <h3>Chromatic Finder</h3>
              </div>
              <p>
                Find the minimum colors needed for any graph model by running sequential tests for k in 1 to 4 colors, animating failures and successes.
              </p>
              <button className="feature-btn">Launch Finder</button>
            </div>

            <div className="feature-card glass-panel" onClick={() => launchSandbox("compare")}>
              <div className="feature-card-header">
                <span className="feature-icon font-gradient-1" style={{ textShadow: "0 0 10px rgba(139, 92, 246, 0.4)" }}>🏁</span>
                <h3>Algorithm Derby</h3>
              </div>
              <p>
                A concurrent 3-column split-screen race! Watch Backtracking, MRV Heuristic, and Forward Checking solve the active graph simultaneously in real-time.
              </p>
              <button className="feature-btn">Launch Derby</button>
            </div>

            <div className="feature-card glass-panel" onClick={() => launchSandbox("player")}>
              <div className="feature-card-header">
                <span className="feature-icon font-gradient-4">🎮</span>
                <h3>Player VS AI Mode</h3>
              </div>
              <p>
                Color the graph manually. Select a difficulty: Easy (shows hover safe indicators), Medium (standard safety), or Hard (blind color with validation submission).
              </p>
              <button className="feature-btn">Launch Game</button>
            </div>
          </div>
        </div>
      ) : mode === "player" ? (
        <div className="mode-subview-container">
          <button onClick={() => setAppSection("landing")} className="back-btn">
            ⬅️ Back to Home Dashboard
          </button>
          <PlayerMode activeMapModel={activeMapModel} />
        </div>
      ) : mode === "exam" ? (
        <div className="mode-subview-container">
          <button onClick={() => setAppSection("landing")} className="back-btn">
            ⬅️ Back to Home Dashboard
          </button>
          <ExamScheduler />
        </div>
      ) : (
        <div className="main-layout">
          {/* Left Panel: Control Deck and Status */}
          <div className="left-panel">
            <Controls
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmSelect={setSelectedAlgorithm}
              selectedSpeed={selectedSpeed}
              onSpeedSelect={setSelectedSpeed}
              selectedMode={mode}
              onModeSelect={setMode}
              onStart={handleStart}
              onReset={handleReset}
              isRunning={isRunning}
              selectedTraversal={selectedTraversal}
              onTraversalSelect={setSelectedTraversal}
              selectedStartState={selectedStartState}
              onStartStateSelect={setSelectedStartState}
              onStartChromatic={runChromaticFinderAnimation}
              usePythonEngine={usePythonEngine}
              onPythonEngineToggle={setUsePythonEngine}
              pyodideStatus={pyodideStatus}
              // Map select
              selectedMapId={selectedMapId}
              onMapSelect={setSelectedMapId}
              activeMapModel={activeMapModel}
              // Difficulty level
              difficulty={difficulty}
              onDifficultySelect={setDifficulty}
              // Teach mode props
              narratedTeachMode={narratedTeachMode}
              onNarratedTeachModeToggle={setNarratedTeachMode}
            />

            {/* Status Panel */}
            <div className="card glass-panel fade-in">
              <p className="card-title">Console Status</p>
              <div className="flex-row items-center gap-10">
                <div className={"status-badge " + (isRunning ? "running" : isDone ? "done" : "idle")}>
                  {isRunning ? "Running Simulation" : isDone ? "Solver Done" : "Console Idle"}
                </div>
                {mode === "compare" && isDone && (
                  <button onClick={runCompare} className="btn-re-run">
                    Re-run Derby
                  </button>
                )}
              </div>

              {steps.length > 0 && (
                <div className="progress-section" style={{ marginTop: "16px" }}>
                  <div className="progress-label">
                    <span>Playback Steps</span>
                    <span>{currentStep} / {steps.length}</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step Log Panel */}
            <div className="card glass-panel fade-in">
              <p className="card-title">{narratedTeachMode ? "AI Tutor Narrations" : "Solver Execution Log"}</p>
              <div className="step-log" ref={stepLogRef}>
                {stepLog.length === 0 ? (
                  <p className="no-steps-placeholder">Logs will stream here upon launching solver...</p>
                ) : (
                  stepLog.map((s, i) => (
                    <div key={i} className={"step-item " + s.type}>
                      <span className="log-icon">
                        {s.type === "assign" ? "✓" : s.type === "backtrack" ? "↩" : "⚙️"}
                      </span>
                      <span className="log-text">{s.text}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Center Panel: Map Board */}
          <div className="center-panel">
            <IndiaMap
              assignments={assignments}
              onStateClick={setSelectedState}
              selectedState={selectedState}
              conflictState={conflictState}
              mode={mode}
              traversalState={traversalState}
              activeMapModel={activeMapModel}
              raceState={raceState.isRace ? raceState : null}
            />
          </div>

          {/* Right Panel: Python Debugger & Data Structure Inspector OR Benchmarking Dashboard */}
          <div className="right-panel">
            {mode === "traversal" ? (
              <>
                {usePythonEngine && (
                  <PythonDebugger
                    algorithm={selectedTraversal}
                    currentStepData={steps[currentStep - 1]}
                    startState={selectedStartState}
                  />
                )}

                {/* Traversal State Inspector (Queue/Stack & Visited) */}
                <div className="card glass-panel traversal-inspector fade-in">
                  <p className="card-title">Memory Data Structures</p>
                  
                  {/* Fringe/Open List visualizer */}
                  <div className="inspector-group" style={{ marginBottom: "20px" }}>
                    <label className="deck-lbl">
                      {selectedTraversal === "bfs" ? "Queue (FIFO List)" : "Stack (LIFO List)"}
                    </label>
                    <div className="fringe-list flex-row">
                      {traversalState?.fringeNodes && traversalState.fringeNodes.length > 0 ? (
                        traversalState.fringeNodes.map((node, idx) => (
                          <div key={idx} className="fringe-pill">
                            <span className="fringe-idx">{idx}</span>
                            <span className="fringe-name">{activeMapModel.abbreviations[node] || node.slice(0, 3).toUpperCase()}</span>
                          </div>
                        ))
                      ) : (
                        <span className="empty-indicator">Empty</span>
                      )}
                    </div>
                  </div>

                  {/* Visited Set visualizer */}
                  <div className="inspector-group">
                    <label className="deck-lbl">Visited States Set</label>
                    <div className="visited-grid">
                      {traversalState?.visitedNodes && traversalState.visitedNodes.length > 0 ? (
                        traversalState.visitedNodes.map((node) => (
                          <div key={node} className="visited-badge">
                            {activeMapModel.abbreviations[node] || node.slice(0, 3).toUpperCase()}
                          </div>
                        ))
                      ) : (
                        <span className="empty-indicator">Empty</span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : mode === "compare" || dashboardResults.length > 0 ? (
              <Dashboard results={dashboardResults} />
            ) : (
              <div className="card glass-panel no-dashboard-card fade-in">
                <h3>Benchmark Dashboard</h3>
                <p>Run CSP Solver or click "Compare All" in Solver mode to view side-by-side performance metrics.</p>
                <button onClick={runCompare} className="btn-dashboard-action">
                  📊 Run Comparison Benchmarks
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
