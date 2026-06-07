# 🎨 Chromatic AI
### Graph Coloring AI Solver using Constraint Satisfaction Problems (CSP)

An AI-powered application that solves the Graph Coloring Problem using CSP techniques such as Backtracking, MRV Heuristic, and Forward Checking. The project visualizes map coloring on the real India state map and demonstrates real-world applications such as exam scheduling.

---

## 📌 Project Information

- **Course:** Computer Fundamentals of Artificial Intelligence (CFAI)
- **University:** KL Deemed to be University
- **Academic Year:** 2025–2026, Term 3
- **Team Size:** 2 Members
- **Technology:** React + JavaScript

---

## 🎯 Problem Statement

The Graph Coloring Problem requires assigning colors to regions of a map such that no two adjacent regions share the same color while using the minimum number of colors possible.

This project develops an AI-based solution using Constraint Satisfaction Problem (CSP) techniques on the real India state map and allows users to compare their manual solutions with AI-generated optimal solutions. The same algorithm is also applied to solve real-world exam timetable scheduling.

---

## ✨ Proposed Features

- 🗺️ **Real India Map Coloring** — All 28 states colored using only 4 colors (4-Color Theorem)
- 🎮 **Interactive Player vs AI Mode** — Color the map manually, AI reveals optimal solution
- ⚡ **Live Backtracking Visualizer** — Watch AI color, conflict, and backtrack step by step
- 🔍 **BFS and DFS Graph Traversal** — Graph connectivity and traversal visualization
- 🧠 **Backtracking-based CSP Solver** — Core algorithm with conflict detection
- 📊 **Heuristic Optimization (MRV)** — Minimum Remaining Values for smarter solving
- 🔄 **Forward Checking** — Early elimination of invalid color choices
- 📈 **Performance Comparison Dashboard** — Compare all 3 strategies side by side
- 🔢 **Chromatic Number Finder** — Find exact minimum colors any map needs
- 📅 **Exam Scheduling** — Same CSP algorithm schedules conflict-free KL University exams

---

## 🛠️ Technologies Used

- React 18
- JavaScript (ES6+)
- HTML5 + CSS3
- SVG (India map rendering)
- Recharts (performance charts)
- Graph Theory
- Artificial Intelligence (CSP)

---

## 📂 Project Structure

```
chromatic-ai/
├── public/
├── src/
│   ├── algorithms/
│   │   ├── backtracking.js
│   │   ├── mrv.js
│   │   └── forwardChecking.js
│   ├── components/
│   │   ├── IndiaMap.jsx
│   │   ├── ColorPicker.jsx
│   │   ├── Controls.jsx
│   │   ├── Dashboard.jsx
│   │   ├── PlayerMode.jsx
│   │   └── ExamScheduler.jsx
│   ├── data/
│   │   ├── indiaAdjacency.js
│   │   └── indiaMapPaths.js
│   ├── App.jsx
│   └── App.css
├── README.md
└── package.json
```

---

## 🌿 Branch Structure

```
main           → Final combined project
person1-core   → Srija (Algorithms & Data)
person2-ui     → Snigdha (UI & Visualization)
```

---

## 📚 Concepts Covered

- Graph Representation & Adjacency List
- BFS (Breadth First Search)
- DFS (Depth First Search)
- Constraint Satisfaction Problems (CSP)
- Backtracking
- MRV Heuristic (Minimum Remaining Values)
- Forward Checking
- Graph Coloring & 4-Color Theorem
- Exam Scheduling via Graph Coloring

---

## 👥 Team Members

| Name | Role |
|---|---|
| Chiluveru Srija | Algorithms & Data — Backtracking, MRV, Forward Checking, CSP Engine, Exam Scheduler |
| Patlolla Snigdha | UI & Visualization — India Map, Animations, Player Mode, Performance Dashboard |

---

## 🚀 Project Status

Currently under development......
