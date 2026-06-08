import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
}
 from "recharts";

function Dashboard({ results }) {
  if (!results || results.length === 0) {
    return (
      <div
        style={{
          padding: "24px",
          background: "#1a1a2e",
          borderRadius: "12px",
          border: "1px solid #2d2d44",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#4a5568", fontSize: "14px", margin: 0 }}>
          Run an algorithm to see performance stats here
        </p>
      </div>
    );
  }

  const nodesData = results.map((r) => ({
    name: r.algorithm,
    "Nodes Explored": r.nodesExplored,
  }));

  const backtracksData = results.map((r) => ({
    name: r.algorithm,
    Backtracks: r.backtracks,
  }));

  const timeData = results.map((r) => ({
    name: r.algorithm,
    "Time (ms)": parseFloat(r.timeTaken),
  }));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "16px",
        background: "#1a1a2e",
        borderRadius: "12px",
        border: "1px solid #2d2d44",
      }}
    >
      <p
        style={{
          color: "#e2e8f0",
          fontSize: "14px",
          fontWeight: "600",
          margin: 0,
        }}
      >
        Algorithm Performance
      </p>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
        {results.map((r) => (
          <div
            key={r.algorithm}
            style={{
              background: "#0d0d1a",
              borderRadius: "10px",
              padding: "12px",
              border: "1px solid #2d2d44",
            }}
          >
            <p
              style={{
                color: "#7c3aed",
                fontSize: "11px",
                fontWeight: "600",
                margin: "0 0 8px 0",
                textTransform: "uppercase",
              }}
            >
              {r.algorithm}
            </p>
            <p style={{ color: "#e2e8f0", fontSize: "12px", margin: "0 0 4px 0" }}>
              Nodes: <strong>{r.nodesExplored}</strong>
            </p>
            <p style={{ color: "#e2e8f0", fontSize: "12px", margin: "0 0 4px 0" }}>
              Backtracks: <strong>{r.backtracks}</strong>
            </p>
            <p style={{ color: "#e2e8f0", fontSize: "12px", margin: 0 }}>
              Time: <strong>{r.timeTaken}ms</strong>
            </p>
          </div>
        ))}
      </div>

      {/* Nodes Explored Chart */}
      <div>
        <p
          style={{
            color: "#a0aec0",
            fontSize: "12px",
            margin: "0 0 8px 0",
            fontWeight: "600",
          }}
        >
          Nodes Explored
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={nodesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d44" />
            <XAxis dataKey="name" tick={{ fill: "#a0aec0", fontSize: 11 }} />
            <YAxis tick={{ fill: "#a0aec0", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "#0d0d1a", border: "1px solid #2d2d44" }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Bar dataKey="Nodes Explored" fill="#7c3aed" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
       {/* Backtracks Chart */}
      <div>
        <p
          style={{
            color: "#a0aec0",
            fontSize: "12px",
            margin: "0 0 8px 0",
            fontWeight: "600",
          }}
        >
          Backtracks
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={backtracksData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d44" />
            <XAxis dataKey="name" tick={{ fill: "#a0aec0", fontSize: 11 }} />
            <YAxis tick={{ fill: "#a0aec0", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "#0d0d1a", border: "1px solid #2d2d44" }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Bar dataKey="Backtracks" fill="#e53e3e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Time Taken Chart */}
      <div>
        <p
          style={{
            color: "#a0aec0",
            fontSize: "12px",
            margin: "0 0 8px 0",
            fontWeight: "600",
          }}
        >
          Time Taken (ms)
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d44" />
            <XAxis dataKey="name" tick={{ fill: "#a0aec0", fontSize: 11 }} />
            <YAxis tick={{ fill: "#a0aec0", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "#0d0d1a", border: "1px solid #2d2d44" }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Bar dataKey="Time (ms)" fill="#38a169" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;