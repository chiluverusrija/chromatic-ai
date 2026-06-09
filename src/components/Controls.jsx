import React from "react";
import { MAPS_REGISTRY } from "../data/mapsRegistry.js";

const ALGORITHMS = [
  { id: "backtracking", label: "Backtracking" },
  { id: "mrv", label: "MRV Heuristic" },
  { id: "forwardChecking", label: "Forward Checking" },
];

const TRAVERSALS = [
  { id: "bfs", label: "Breadth-First (BFS)" },
  { id: "dfs", label: "Depth-First (DFS)" },
];

const SPEEDS = [
  { id: "slow", label: "🐢 Slow", ms: 800 },
  { id: "normal", label: "⚡ Normal", ms: 300 },
  { id: "fast", label: "🚀 Fast", ms: 80 },
  { id: "instant", label: "⚡ Instant", ms: 0 },
];

const MODES = [
  { id: "ai", label: "🎨 Map CSP Solver" },
  { id: "traversal", label: "🔍 Graph Traversal" },
  { id: "chromatic", label: "🔢 Chromatic Finder" },
  { id: "compare", label: "🏁 Algorithm Derby" },
  { id: "player", label: "🎮 Player vs AI" },
  { id: "exam", label: "📅 Exam Scheduler" },
];

function Controls({
  selectedAlgorithm,
  onAlgorithmSelect,
  selectedSpeed,
  onSpeedSelect,
  selectedMode,
  onModeSelect,
  onStart,
  onReset,
  isRunning,
  // Traversal-specific props
  selectedTraversal,
  onTraversalSelect,
  selectedStartState,
  onStartStateSelect,
  usePythonEngine,
  onPythonEngineToggle,
  pyodideStatus,
  // Chromatic props
  isChromaticRunning,
  onStartChromatic,
  // Map Selection props
  selectedMapId,
  onMapSelect,
  activeMapModel,
  // Difficulty props
  difficulty,
  onDifficultySelect,
  // Teach Mode props
  narratedTeachMode,
  onNarratedTeachModeToggle,
}) {
  return (
    <div className="controls-card glass-panel fade-in">
      <div className="panel-header">
        <h3>System Control Deck</h3>
        <span className="glow-dot active" />
      </div>

      {/* Mode Select Tabs */}
      <div className="control-group">
        <label className="deck-lbl">System Mode</label>
        <div className="mode-grid">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => !isRunning && onModeSelect(m.id)}
              disabled={isRunning}
              className={`mode-tab-btn ${selectedMode === m.id ? "active" : ""}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="divider-h" />

      {/* Active Map / Graph Selection */}
      <div className="control-group">
        <label className="deck-lbl">Active Map / Graph</label>
        <select
          value={selectedMapId}
          onChange={(e) => onMapSelect(e.target.value)}
          disabled={isRunning}
          className="custom-select"
        >
          <optgroup label="Realistic Maps">
            {Object.values(MAPS_REGISTRY)
              .filter((m) => m.category === "realistic")
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.states.length} nodes)
                </option>
              ))}
          </optgroup>
          <optgroup label="Graph Theory Models">
            {Object.values(MAPS_REGISTRY)
              .filter((m) => m.category === "normal")
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.states.length} nodes)
                </option>
              ))}
          </optgroup>
        </select>
      </div>

      <div className="divider-h" />

      {/* Mode-Specific Settings */}
      {selectedMode === "ai" && (
        <>
          <div className="control-group">
            <label className="deck-lbl">CSP Color Algorithm</label>
            <div className="flex-row gap-8">
              {ALGORITHMS.map((algo) => (
                <button
                  key={algo.id}
                  onClick={() => onAlgorithmSelect(algo.id)}
                  disabled={isRunning}
                  className={`option-btn ${selectedAlgorithm === algo.id ? "active" : ""}`}
                >
                  {algo.label}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label className="deck-lbl">Constraint Difficulty</label>
            <div className="difficulty-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
              {["easy", "medium", "hard"].map((level) => (
                <button
                  key={level}
                  onClick={() => onDifficultySelect(level)}
                  disabled={isRunning}
                  className={`speed-btn ${difficulty === level ? "active" : ""}`}
                  style={{ textTransform: "capitalize", padding: "6px 2px", fontSize: "10px" }}
                >
                  {level === "easy" && "🟢 Easy (4)"}
                  {level === "medium" && "🟡 Med (3)"}
                  {level === "hard" && "🔴 Hard (2)"}
                </button>
              ))}
            </div>
            <span className="difficulty-info-lbl" style={{ fontSize: "10px", color: "var(--text-secondary)", marginTop: "6px", display: "block", lineHeight: "1.3" }}>
              {difficulty === "easy" && "🎨 Colors: Red, Green, Blue, Yellow. Fast, easy solve."}
              {difficulty === "medium" && "🎨 Colors: Red, Green, Blue. Harder constraints, more backtracks."}
              {difficulty === "hard" && "🎨 Colors: Red, Green. Very difficult constraint, showing failed runs."}
            </span>
          </div>
        </>
      )}

      {selectedMode === "traversal" && (
        <>
          <div className="control-group">
            <label className="deck-lbl">Search Algorithm</label>
            <div className="flex-row gap-8">
              {TRAVERSALS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onTraversalSelect(t.id)}
                  disabled={isRunning}
                  className={`option-btn ${selectedTraversal === t.id ? "active" : ""}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label className="deck-lbl">Starting Node</label>
            <select
              value={selectedStartState}
              onChange={(e) => onStartStateSelect(e.target.value)}
              disabled={isRunning}
              className="custom-select"
            >
              {(activeMapModel.states || []).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* Python Traversal Engine Switch */}
          <div className="control-group python-toggle-group">
            <div className="flex-row items-center justify-between" style={{ display: "flex", justifyContent: "space-between", width: "100%", margin: "4px 0" }}>
              <label className="deck-lbl" style={{ margin: 0, cursor: "pointer" }} htmlFor="python-engine-check">
                🐍 Python WASM Engine
              </label>
              <div className="switch-wrapper">
                <input
                  type="checkbox"
                  id="python-engine-check"
                  checked={usePythonEngine}
                  onChange={(e) => onPythonEngineToggle(e.target.checked)}
                  disabled={isRunning}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
            {usePythonEngine && (
              <div className={`py-status-badge ${pyodideStatus}`}>
                {pyodideStatus === "idle" && "💤 Click 'Launch' to initialize Python"}
                {pyodideStatus === "loading" && "⏳ Loading WASM Python..."}
                {pyodideStatus === "ready" && "✅ Python Engine Active"}
                {pyodideStatus === "error" && "❌ Failed to load Python"}
              </div>
            )}
          </div>
        </>
      )}

      {selectedMode === "chromatic" && (
        <div className="control-group info-banner">
          <p>
            ℹ️ The Chromatic Number Finder runs CSP solvers sequentially for k in {'{'}1, 2, 3, 4{'}'} to find the minimum colors required.
          </p>
        </div>
      )}

      {selectedMode === "compare" && (
        <div className="control-group info-banner" style={{ background: "rgba(124, 58, 237, 0.08)", borderColor: "rgba(124, 58, 237, 0.2)", color: "#c084fc" }}>
          <p>
            🏎️ The Algorithm Derby runs three solvers (Backtracking, MRV Heuristic, Forward Checking) simultaneously to color the active graph in a live race!
          </p>
        </div>
      )}

      {/* Simulation Speed Control */}
      {selectedMode !== "player" && selectedMode !== "exam" && (
        <>
          <div className="control-group">
            <label className="deck-lbl">Simulation Speed</label>
            <div className="speed-grid">
              {SPEEDS.map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => onSpeedSelect(sp)}
                  disabled={isRunning}
                  className={`speed-btn ${selectedSpeed.id === sp.id ? "active" : ""}`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Educational Teach Mode Toggle */}
          <div className="control-group python-toggle-group" style={{ background: "rgba(59, 130, 246, 0.05)", borderColor: "rgba(59, 130, 246, 0.15)", marginTop: "12px" }}>
            <div className="flex-row items-center justify-between" style={{ display: "flex", justifyContent: "space-between", width: "100%", margin: "4px 0" }}>
              <label className="deck-lbl" style={{ margin: 0, cursor: "pointer" }} htmlFor="teach-mode-check">
                📖 Narrated Teach Mode
              </label>
              <div className="switch-wrapper">
                <input
                  type="checkbox"
                  id="teach-mode-check"
                  checked={narratedTeachMode}
                  onChange={(e) => onNarratedTeachModeToggle(e.target.checked)}
                  disabled={isRunning}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
            {narratedTeachMode && (
              <span className="difficulty-info-lbl" style={{ fontSize: "10px", color: "#60a5fa", display: "block", marginTop: "4px", lineHeight: "1.3" }}>
                🎓 AI Tutor will explain variable selections, backtrack reasons, and pruning actions in natural language.
              </span>
            )}
          </div>
        </>
      )}

      <div className="divider-h" />

      {/* Primary Action Buttons */}
      {selectedMode !== "player" && (
        <div className="action-row flex-row">
          <button
            onClick={selectedMode === "chromatic" ? onStartChromatic : onStart}
            disabled={isRunning}
            className={`btn-action primary-glow ${isRunning ? "disabled" : ""}`}
          >
            {isRunning ? "Simulating..." : "🚀 Launch Visualizer"}
          </button>
          <button onClick={onReset} className="btn-action reset-btn-outline">
            🔄 Reset
          </button>
        </div>
      )}

      {selectedMode === "player" && (
        <div className="player-instructions info-banner">
          <p>
            💡 Select colors from the palette and click regions to color the active graph conflict-free. Choose your difficulty in the subview!
          </p>
        </div>
      )}
    </div>
  );
}

export default Controls;