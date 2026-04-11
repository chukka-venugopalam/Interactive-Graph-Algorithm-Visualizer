# Graph Traversal & Pathfinding Visualizer

An interactive web-based visualizer to understand core graph algorithms used in GATE and technical interviews.

---

##  Features

- Visual representation of graph traversal and shortest path algorithms
- Step-by-step execution with animation
- Adjustable speed control
- Execution logs for better understanding
- Data structure visualization (Queue, Stack, Priority Queue, Matrix)

---

##  Supported Algorithms

✔ BFS (Breadth-First Search)  
✔ DFS (Depth-First Search)  
✔ Dijkstra (Single Source Shortest Path)  
✔ Floyd-Warshall (All Pairs Shortest Path)

---

##  Algorithms Overview

###  BFS (Breadth-First Search)
- Explores graph level by level
- Uses **Queue (FIFO)**

**Time Complexity:** O(V + E)  
**Space Complexity:** O(V)

---

###  DFS (Depth-First Search)
- Explores graph depth-wise
- Uses **Stack (LIFO)**

**Time Complexity:** O(V + E)  
**Space Complexity:** O(V)

---

###  Dijkstra’s Algorithm
- Finds shortest path from a **single source node**
- Uses **Greedy approach + Priority Queue**
- Works only with **non-negative weights**

#### Features
- Real-time distance updates
- Priority queue visualization
- Path tracking using parent nodes

**Time Complexity:** O((V + E) log V)  
**Space Complexity:** O(V)

---

###  Floyd-Warshall Algorithm
- Finds shortest paths between **all pairs of nodes**
- Uses **Dynamic Programming (Matrix-based approach)**

#### Features
- Live distance matrix visualization
- Step-by-step updates using intermediate node `k`
- Highlights:
  - Source node (i)
  - Destination node (j)
  - Intermediate node (k)

**Time Complexity:** O(V³)  
**Space Complexity:** O(V²)

---

## Key Differences

| Algorithm        | Type                | Use Case                      |
|-----------------|---------------------|-------------------------------|
| BFS             | Traversal           | Level-wise exploration        |
| DFS             | Traversal           | Deep exploration              |
| Dijkstra        | Greedy              | Single source shortest path   |
| Floyd-Warshall  | Dynamic Programming | All pairs shortest paths      |

---

##  Tech Stack

- HTML
- CSS
- JavaScript (Canvas API)

---

##  How to Use

1. Select a **Start Node**
2. Adjust **Speed**
3. Click on any algorithm:
   - BFS
   - DFS
   - Dijkstra
   - Floyd-Warshall
4. Watch:
   - Graph traversal
   - Data structure updates
   - Execution logs
   - Final results

---

##  Learning Purpose

This project is built to:
- Strengthen understanding of **graph algorithms**
- Prepare for **GATE and coding interviews**
- Visualize abstract concepts in an intuitive way

---

##  Limitations

- Dijkstra does not support negative edge weights
- Graph is predefined (no custom input yet)

---

##  Future Improvements

- Add Bellman-Ford algorithm (negative weights)
- Add A* pathfinding
- Allow user-defined graphs
- Path reconstruction visualization
- Mobile UI improvements

---


##  Author

Built as part of DSA and GATE preparation.
