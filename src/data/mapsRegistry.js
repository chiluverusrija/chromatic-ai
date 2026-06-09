import indiaAdjacency from "./indiaAdjacency.js";
import indiaMapPaths from "./indiaMapPaths.js";

export const MAPS_REGISTRY = {
  // 1. INDIA MAP (Realistic Map, 31 regions)
  india: {
    id: "india",
    name: "India Map",
    category: "realistic",
    type: "map",
    states: Object.keys(indiaMapPaths),
    adjacency: indiaAdjacency,
    abbreviations: {
      "Jammu & Kashmir": "JK",
      "Ladakh": "LA",
      "Himachal Pradesh": "HP",
      "Punjab": "PB",
      "Haryana": "HR",
      "Delhi": "DL",
      "Uttarakhand": "UK",
      "Uttar Pradesh": "UP",
      "Rajasthan": "RJ",
      "Bihar": "BR",
      "Jharkhand": "JH",
      "West Bengal": "WB",
      "Sikkim": "SK",
      "Assam": "AS",
      "Arunachal Pradesh": "AR",
      "Nagaland": "NL",
      "Manipur": "MN",
      "Mizoram": "MZ",
      "Tripura": "TR",
      "Meghalaya": "ML",
      "Odisha": "OD",
      "Chhattisgarh": "CG",
      "Madhya Pradesh": "MP",
      "Gujarat": "GJ",
      "Maharashtra": "MH",
      "Goa": "GA",
      "Karnataka": "KA",
      "Telangana": "TG",
      "Andhra Pradesh": "AP",
      "Tamil Nadu": "TN",
      "Kerala": "KL"
    },
    paths: indiaMapPaths,
    graphCoordinates: {
      "Jammu & Kashmir": { x: 130, y: 55 },
      "Ladakh": { x: 230, y: 50 },
      "Himachal Pradesh": { x: 180, y: 95 },
      "Punjab": { x: 90, y: 110 },
      "Haryana": { x: 135, y: 145 },
      "Delhi": { x: 180, y: 155 },
      "Uttarakhand": { x: 235, y: 115 },
      "Uttar Pradesh": { x: 235, y: 195 },
      "Rajasthan": { x: 75, y: 185 },
      "Gujarat": { x: 50, y: 255 },
      "Madhya Pradesh": { x: 140, y: 245 },
      "Chhattisgarh": { x: 210, y: 285 },
      "Bihar": { x: 300, y: 175 },
      "Jharkhand": { x: 300, y: 235 },
      "West Bengal": { x: 305, y: 295 },
      "Sikkim": { x: 345, y: 125 },
      "Assam": { x: 355, y: 195 },
      "Meghalaya": { x: 340, y: 245 },
      "Arunachal Pradesh": { x: 380, y: 105 },
      "Nagaland": { x: 385, y: 155 },
      "Manipur": { x: 380, y: 215 },
      "Mizoram": { x: 375, y: 275 },
      "Tripura": { x: 345, y: 295 },
      "Odisha": { x: 265, y: 335 },
      "Maharashtra": { x: 105, y: 315 },
      "Goa": { x: 60, y: 375 },
      "Karnataka": { x: 115, y: 405 },
      "Telangana": { x: 185, y: 355 },
      "Andhra Pradesh": { x: 185, y: 425 },
      "Tamil Nadu": { x: 165, y: 475 },
      "Kerala": { x: 115, y: 470 }
    }
  },

  // 2. US WESTERN STATES (Realistic Map, 11 regions)
  us_west: {
    id: "us_west",
    name: "US Western States",
    category: "realistic",
    type: "map",
    states: [
      "Washington", "Oregon", "California", "Nevada", "Idaho", 
      "Utah", "Arizona", "Montana", "Wyoming", "Colorado", "New Mexico"
    ],
    adjacency: {
      "Washington": ["Oregon", "Idaho"],
      "Oregon": ["Washington", "California", "Nevada", "Idaho"],
      "California": ["Oregon", "Nevada", "Arizona"],
      "Nevada": ["Oregon", "California", "Idaho", "Utah", "Arizona"],
      "Idaho": ["Washington", "Oregon", "Nevada", "Utah", "Montana", "Wyoming"],
      "Utah": ["Idaho", "Nevada", "Arizona", "Wyoming", "Colorado", "New Mexico"],
      "Arizona": ["California", "Nevada", "Utah", "New Mexico"],
      "Montana": ["Idaho", "Wyoming"],
      "Wyoming": ["Montana", "Idaho", "Utah", "Colorado"],
      "Colorado": ["Wyoming", "Utah", "New Mexico"],
      "New Mexico": ["Arizona", "Utah", "Colorado"]
    },
    abbreviations: {
      "Washington": "WA",
      "Oregon": "OR",
      "California": "CA",
      "Nevada": "NV",
      "Idaho": "ID",
      "Utah": "UT",
      "Arizona": "AZ",
      "Montana": "MT",
      "Wyoming": "WY",
      "Colorado": "CO",
      "New Mexico": "NM"
    },
    paths: {
      "Washington": "M 60,60 L 140,60 L 140,110 L 70,110 L 60,90 Z",
      "Oregon": "M 60,110 L 140,110 L 140,180 L 50,180 L 60,110 Z",
      "California": "M 50,180 L 140,180 L 100,340 L 140,360 L 140,380 L 90,380 L 50,260 Z",
      "Nevada": "M 140,180 L 195,180 L 195,300 L 140,340 Z",
      "Idaho": "M 140,60 L 160,60 L 160,100 L 195,100 L 195,210 L 140,210 L 140,110 Z",
      "Utah": "M 195,210 L 250,210 L 250,300 L 195,300 Z",
      "Arizona": "M 140,340 L 195,300 L 210,300 L 210,400 L 140,400 Z",
      "Montana": "M 160,60 L 270,60 L 270,120 L 195,120 L 195,100 L 160,100 Z",
      "Wyoming": "M 195,120 L 270,120 L 270,210 L 195,210 Z",
      "Colorado": "M 250,210 L 320,210 L 320,300 L 250,300 Z",
      "New Mexico": "M 210,300 L 280,300 L 280,400 L 210,400 Z"
    },
    graphCoordinates: {
      "Washington": { x: 80, y: 80 },
      "Oregon": { x: 80, y: 190 },
      "California": { x: 80, y: 320 },
      "Nevada": { x: 160, y: 250 },
      "Idaho": { x: 160, y: 130 },
      "Utah": { x: 240, y: 250 },
      "Arizona": { x: 160, y: 370 },
      "Montana": { x: 240, y: 80 },
      "Wyoming": { x: 240, y: 160 },
      "Colorado": { x: 320, y: 200 },
      "New Mexico": { x: 320, y: 320 }
    }
  },

  // 3. PETERSEN GRAPH (Standard CS Graph, 10 nodes)
  petersen: {
    id: "petersen",
    name: "Petersen Graph",
    category: "normal",
    type: "graph",
    states: ["Node 0", "Node 1", "Node 2", "Node 3", "Node 4", "Node 5", "Node 6", "Node 7", "Node 8", "Node 9"],
    abbreviations: {
      "Node 0": "N0", "Node 1": "N1", "Node 2": "N2", "Node 3": "N3", "Node 4": "N4",
      "Node 5": "N5", "Node 6": "N6", "Node 7": "N7", "Node 8": "N8", "Node 9": "N9"
    },
    adjacency: {
      "Node 0": ["Node 1", "Node 4", "Node 5"],
      "Node 1": ["Node 0", "Node 2", "Node 6"],
      "Node 2": ["Node 1", "Node 3", "Node 7"],
      "Node 3": ["Node 2", "Node 4", "Node 8"],
      "Node 4": ["Node 3", "Node 0", "Node 9"],
      "Node 5": ["Node 0", "Node 7", "Node 8"],
      "Node 6": ["Node 1", "Node 8", "Node 9"],
      "Node 7": ["Node 2", "Node 5", "Node 9"],
      "Node 8": ["Node 3", "Node 5", "Node 6"],
      "Node 9": ["Node 4", "Node 6", "Node 7"]
    },
    paths: {},
    // Outer and Inner star coordinate placements for the "map" / default geometric layout
    mapCoordinates: {
      "Node 0": { x: 200, y: 110 },
      "Node 1": { x: 333, y: 207 },
      "Node 2": { x: 282, y: 363 },
      "Node 3": { x: 118, y: 363 },
      "Node 4": { x: 67, y: 207 },
      "Node 5": { x: 200, y: 180 },
      "Node 6": { x: 266, y: 228 },
      "Node 7": { x: 241, y: 306 },
      "Node 8": { x: 159, y: 306 },
      "Node 9": { x: 133, y: 228 }
    },
    graphCoordinates: {
      "Node 0": { x: 200, y: 55 },
      "Node 1": { x: 345, y: 160 },
      "Node 2": { x: 290, y: 330 },
      "Node 3": { x: 110, y: 330 },
      "Node 4": { x: 55, y: 160 },
      "Node 5": { x: 200, y: 140 },
      "Node 6": { x: 270, y: 190 },
      "Node 7": { x: 245, y: 265 },
      "Node 8": { x: 155, y: 265 },
      "Node 9": { x: 130, y: 190 }
    }
  },

  // 4. BINARY TREE (Standard CS Graph, 15 nodes)
  binary_tree: {
    id: "binary_tree",
    name: "Binary Tree Graph",
    category: "normal",
    type: "graph",
    states: [
      "Root", "L1", "R1", "L1L", "L1R", "R1L", "R1R",
      "L1LL", "L1LR", "L1RL", "L1RR", "R1LL", "R1LR", "R1RL", "R1RR"
    ],
    abbreviations: {
      "Root": "RT", "L1": "L1", "R1": "R1", 
      "L1L": "L2A", "L1R": "L2B", "R1L": "R2A", "R1R": "R2B",
      "L1LL": "L3A", "L1LR": "L3B", "L1RL": "L3C", "L1RR": "L3D",
      "R1LL": "R3A", "R1LR": "R3B", "R1RL": "R3C", "R1RR": "R3D"
    },
    adjacency: {
      "Root": ["L1", "R1"],
      "L1": ["Root", "L1L", "L1R"],
      "R1": ["Root", "R1L", "R1R"],
      "L1L": ["L1", "L1LL", "L1LR"],
      "L1R": ["L1", "L1RL", "L1RR"],
      "R1L": ["R1", "R1LL", "R1LR"],
      "R1R": ["R1", "R1RL", "R1RR"],
      "L1LL": ["L1L"], "L1LR": ["L1L"], "L1RL": ["L1R"], "L1RR": ["L1R"],
      "R1LL": ["R1L"], "R1LR": ["R1L"], "R1RL": ["R1R"], "R1RR": ["R1R"]
    },
    paths: {},
    mapCoordinates: {
      "Root": { x: 200, y: 70 },
      "L1": { x: 110, y: 160 },
      "R1": { x: 290, y: 160 },
      "L1L": { x: 65, y: 250 },
      "L1R": { x: 155, y: 250 },
      "R1L": { x: 245, y: 250 },
      "R1R": { x: 335, y: 250 },
      "L1LL": { x: 35, y: 350 },
      "L1LR": { x: 95, y: 350 },
      "L1RL": { x: 125, y: 350 },
      "L1RR": { x: 185, y: 350 },
      "R1LL": { x: 215, y: 350 },
      "R1LR": { x: 275, y: 350 },
      "R1RL": { x: 305, y: 350 },
      "R1RR": { x: 365, y: 350 }
    },
    graphCoordinates: {
      "Root": { x: 200, y: 60 },
      "L1": { x: 100, y: 140 },
      "R1": { x: 300, y: 140 },
      "L1L": { x: 60, y: 230 },
      "L1R": { x: 140, y: 230 },
      "R1L": { x: 260, y: 230 },
      "R1R": { x: 340, y: 230 },
      "L1LL": { x: 40, y: 330 },
      "L1LR": { x: 80, y: 330 },
      "L1RL": { x: 120, y: 330 },
      "L1RR": { x: 160, y: 330 },
      "R1LL": { x: 240, y: 330 },
      "R1LR": { x: 280, y: 330 },
      "R1RL": { x: 320, y: 330 },
      "R1RR": { x: 360, y: 330 }
    }
  },

  // 5. CIRCULAR RING CYCLE (Standard CS Graph, 8 nodes)
  cycle_graph: {
    id: "cycle_graph",
    name: "Circular Cycle Graph",
    category: "normal",
    type: "graph",
    states: ["Node A", "Node B", "Node C", "Node D", "Node E", "Node F", "Node G", "Node H"],
    abbreviations: {
      "Node A": "A", "Node B": "B", "Node C": "C", "Node D": "D",
      "Node E": "E", "Node F": "F", "Node G": "G", "Node H": "H"
    },
    adjacency: {
      "Node A": ["Node B", "Node H"],
      "Node B": ["Node A", "Node C"],
      "Node C": ["Node B", "Node D"],
      "Node D": ["Node C", "Node E"],
      "Node E": ["Node D", "Node F"],
      "Node F": ["Node E", "Node G"],
      "Node G": ["Node F", "Node H"],
      "Node H": ["Node G", "Node A"]
    },
    paths: {},
    mapCoordinates: {
      "Node A": { x: 200, y: 100 },
      "Node B": { x: 290, y: 140 },
      "Node C": { x: 330, y: 240 },
      "Node D": { x: 290, y: 340 },
      "Node E": { x: 200, y: 380 },
      "Node F": { x: 110, y: 340 },
      "Node G": { x: 70, y: 240 },
      "Node H": { x: 110, y: 140 }
    },
    graphCoordinates: {
      "Node A": { x: 200, y: 80 },
      "Node B": { x: 300, y: 120 },
      "Node C": { x: 340, y: 240 },
      "Node D": { x: 300, y: 360 },
      "Node E": { x: 200, y: 400 },
      "Node F": { x: 100, y: 360 },
      "Node G": { x: 60, y: 240 },
      "Node H": { x: 100, y: 120 }
    }
  }
};
