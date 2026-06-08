import React, { useState } from "react";
import indiaAdjacency from "../data/indiaAdjacency.js";
import indiaMapPaths from "../data/indiaMapPaths.js";

const COLOR_MAP = {
  red: "#FF6B6B",
  green: "#68D391",
  blue: "#63B3ED",
  yellow: "#F6E05E",
  default: "#2d2d44",
};

function IndiaMap({
  assignments,
  onStateClick,
  selectedState,
  conflictState,
  mode,
}) {
  const states = Object.keys(indiaMapPaths);

  return (
    <div
      style={{
        background: "#0d0d1a",
        borderRadius: "12px",
        border: "1px solid #2d2d44",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
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
        India Map — Graph Coloring
      </p>

      <svg
        viewBox="0 0 400 500"
        style={{
          width: "100%",
          height: "auto",
          maxHeight: "500px",
        }}
      >
        {states.map((state) => {
          const color = assignments[state]
            ? COLOR_MAP[assignments[state]]
            : COLOR_MAP.default;

          const isSelected = selectedState === state;
          const isConflict = conflictState === state;

          return (
            <path
              key={state}
              d={indiaMapPaths[state]}
              fill={isConflict ? "#FC8181" : color}
              stroke={isSelected ? "white" : "#4a5568"}
              strokeWidth={isSelected ? "2" : "0.8"}
              style={{
                cursor: mode === "player" ? "pointer" : "default",
                transition: "fill 0.3s ease",
                opacity: isConflict ? 0.7 : 1,
              }}
              onClick={() => onStateClick && onStateClick(state)}
            >
              <title>{state}</title>
            </path>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {Object.entries(COLOR_MAP)
          .filter(([key]) => key !== "default")
          .map(([colorName, colorValue]) => (
            <div
              key={colorName}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  background: colorValue,
                }}
              />
              <span
                style={{
                  color: "#a0aec0",
                  fontSize: "12px",
                  textTransform: "capitalize",
                }}
              >
                {colorName}
              </span>
            </div>
          ))}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              background: COLOR_MAP.default,
            }}
          />
          <span style={{ color: "#a0aec0", fontSize: "12px" }}>Uncolored</span>
        </div>
      </div>
{/* Stats */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          padding: "10px 14px",
          background: "#1a1a2e",
          borderRadius: "8px",
        }}
      >
        <div>
          <p style={{ color: "#a0aec0", fontSize: "11px", margin: "0 0 2px 0" }}>
            Total States
          </p>
          <p style={{ color: "#e2e8f0", fontSize: "16px", fontWeight: "600", margin: 0 }}>
            {states.length}
          </p>
        </div>
        <div>
          <p style={{ color: "#a0aec0", fontSize: "11px", margin: "0 0 2px 0" }}>
            Colored
          </p>
          <p style={{ color: "#68D391", fontSize: "16px", fontWeight: "600", margin: 0 }}>
            {Object.keys(assignments).length}
          </p>
        </div>
        <div>
          <p style={{ color: "#a0aec0", fontSize: "11px", margin: "0 0 2px 0" }}>
            Remaining
          </p>
          <p style={{ color: "#FC8181", fontSize: "16px", fontWeight: "600", margin: 0 }}>
            {states.length - Object.keys(assignments).length}
          </p>
        </div>
        <div>
          <p style={{ color: "#a0aec0", fontSize: "11px", margin: "0 0 2px 0" }}>
            Colors Used
          </p>
          <p style={{ color: "#F6E05E", fontSize: "16px", fontWeight: "600", margin: 0 }}>
            {new Set(Object.values(assignments)).size}
          </p>
        </div>
      </div>
    </div>
  );
}

export default IndiaMap;