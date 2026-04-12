# Graph Traversal & Pathfinding Visualizer

An interactive web-based tool to visualize graph traversal and pathfinding algorithms in real-time. Designed for students preparing for concepts like DSA and GATE.

---

##  Features

###  Traversal Algorithms
- Breadth-First Search (BFS)
- Depth-First Search (DFS)

###  Shortest Path Algorithms
- Dijkstra’s Algorithm (Single Source Shortest Path)
- Floyd-Warshall Algorithm (All-Pairs Shortest Path)

###  Minimum Spanning Tree (MST)
- Prim’s Algorithm
- Kruskal’s Algorithm (Union-Find)

---

##  Key Highlights

- Real-time graph visualization using HTML5 Canvas
- Step-by-step execution with adjustable speed
- Dynamic data structure visualization:
  - Queue (BFS)
  - Stack (DFS)
  - Priority Queue (Dijkstra & Prim’s)
  - Edge list (Kruskal)
  - Matrix (Floyd-Warshall)
- Execution logs with timestamps
- Final results panel with clear outputs
- Algorithm-specific UI and legends

---

##  Algorithms Overview

### BFS
- Explores level-by-level
- Time: O(V + E)

### DFS
- Explores depth-first
- Time: O(V + E)

### Dijkstra
- Finds shortest path from a source node
- Uses greedy + priority queue
- Time: O((V + E) log V)

### Floyd-Warshall
- Computes shortest paths between all pairs
- Uses dynamic programming
- Time: O(V³)

### Prim’s
- Builds MST by expanding tree
- Time: O((V + E) log V)

### Kruskal’s
- Builds MST using edge sorting + Union-Find
- Time: O(E log E)

---

##  Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- Canvas API

---

##  Visualization Details

- Nodes change color based on state:
  - White → Unvisited
  - Blue → In memory
  - Orange → Processing
  - Green → Visited

- Floyd-Warshall:
  - Highlights (i, j, k)
  - Updates matrix live

- Dijkstra:
  - Displays distance values below nodes

---

##  Project Structure
/project-root 
│── index.html 
│── style.css 
│── script.js

---

##  How to Run

1. Clone the repository:
git clone 

2. Open `index.html` in your browser

---

##  Learning Purpose

This project helps in:
- Understanding graph algorithms visually
- Strengthening DSA concepts
- Preparing for coding interviews and GATE

---

##  Future Improvements

- User-defined graph input
- Directed graph support
- Negative weight cycle detection

---

##  Contribution

Feel free to fork and improve this project!

---

##  License

Open-source and free to use
