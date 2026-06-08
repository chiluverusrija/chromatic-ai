import React from "react";

const COLORS = ["red", "green", "blue", "yellow"];

const COLOR_STYLES = {
  red: {
    background: "#FF6B6B",
    border: "#e53e3e",
    label: "Red",
  },
  green: {
    background: "#68D391",
    border: "#38a169",
    label: "Green",
  },
  blue: {
    background: "#63B3ED",
    border: "#3182ce",
    label: "Blue",
  },
  yellow: {
    background: "#F6E05E",
    border: "#d69e2e",
    label: "Yellow",
  },
};

function ColorPicker({ selectedColor, onColorSelect }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "16px",
        background: "#1a1a2e",
        borderRadius: "12px",
        border: "1px solid #2d2d44",
      }}
    >
      <p
        style={{
          color: "#a0aec0",
          fontSize: "12px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          margin: 0,
        }}
      >
        Select Color
      </p>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onColorSelect(color)}
            title={COLOR_STYLES[color].label}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: COLOR_STYLES[color].background,
              border:
                selectedColor === color
                  ? "3px solid white"
                  : "2px solid " + COLOR_STYLES[color].border,
              cursor: "pointer",
              transform: selectedColor === color ? "scale(1.2)" : "scale(1)",
              transition: "all 0.2s ease",
              boxShadow:
                selectedColor === color
                  ? "0 0 12px " + COLOR_STYLES[color].background
                  : "none",
            }}
          />
        ))}
      </div>

      {selectedColor && (
        <p style={{ color: "#e2e8f0", fontSize: "13px", margin: 0 }}>
          Selected:{" "}
          <span
            style={{
              color: COLOR_STYLES[selectedColor].background,
              fontWeight: "600",
            }}
          >
            {COLOR_STYLES[selectedColor].label}
          </span>
        </p>
      )}
    </div>
  );
}

export default ColorPicker;