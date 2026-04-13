# Graph Traversal & Pathfinding Visualizer

An interactive web-based tool designed to visualize complex graph traversal, shortest path, and minimum spanning tree algorithms in real-time. This project is purpose-built for students and developers preparing for technical interviews and computer science examinations (such as GATE), providing an intuitive way to understand abstract data structures.

---

## Features

### Interactive Graph Editor
* **Draw Nodes & Edges:** Click to add nodes and select two nodes to connect them with custom weighted edges.
* **Delete Mode:** Easily remove mistakes by clicking a node to delete it and its connecting edges.

### Traversal Algorithms
* **Breadth-First Search (BFS):** Explores the graph level-by-level.
* **Depth-First Search (DFS):** Explores the graph depth-first.

### Shortest Path Algorithms
* **Dijkstra’s Algorithm:** Computes the single-source shortest path.
* **Floyd-Warshall Algorithm:** Computes the shortest paths between all pairs of nodes simultaneously.

### Minimum Spanning Tree (MST)
* **Prim’s Algorithm:** Builds the MST by expanding outward from a starting node.
* **Kruskal’s Algorithm:** Builds the MST by globally sorting edges and utilizing a Disjoint Set (Union-Find).

---

## Key Highlights

* **Real-Time Canvas Visualization:** Smooth, state-based animations rendered via HTML5 Canvas.
* **Step-by-Step Execution:** Adjustable speed controls allow users to slow down complex logic or speed through simple steps.
* **Dynamic Data Structure Tracking:** The UI actively displays the underlying memory structure based on the chosen algorithm:
  * Queue (BFS)
  * Stack (DFS)
  * Priority Queue (Dijkstra & Prim’s)
  * Sorted Edge List (Kruskal)
  * 2D Adjacency Matrix (Floyd-Warshall)
* **Execution Logs:** A built-in terminal output provides timestamped, step-by-step reasoning.
* **Final Results Panel:** Displays clear, formatted outputs (traversal routes, shortest distances, or total MST weights) upon completion.

---

## Algorithms Overview

| Algorithm | Type | Time Complexity | Space Complexity | Data Structure Used |
| :--- | :--- | :--- | :--- | :--- |
| **BFS** | Traversal | O(V + E) | O(V) | Queue (FIFO) |
| **DFS** | Traversal | O(V + E) | O(V) | Stack (LIFO) |
| **Dijkstra** | Shortest Path | O((V + E) log V) | O(V) | Priority Queue |
| **Floyd-Warshall** | Shortest Path | O(V³) | O(V²) | 2D Array (Matrix) |
| **Prim's** | MST | O((V + E) log V) | O(V) | Priority Queue |
| **Kruskal's** | MST | O(E log E) | O(V + E) | Disjoint Set (Union-Find) |

---

## Visualization Details

Nodes dynamically change color to represent their algorithmic state:
* **White:** Unvisited
* **Blue:** In Memory (Queued/Stacked)
* **Orange:** Processing (Current Node)
* **Green:** Visited / Final Path

**Algorithm-Specific Details:**
* **Floyd-Warshall:** Flashes distinct colors to highlight the Source (i), Destination (j), and Intermediate (k) nodes while updating the matrix live.
* **Dijkstra & Prim's:** Displays live distance/weight values directly below the active nodes.
* **Spanning Trees:** Final paths and trees are permanently highlighted with thickened green edges.

---

## Tech Stack

* HTML5
* CSS3
* JavaScript (Vanilla, ES6 Modules)
* Canvas API

---

## Project Structure

```text
graph-visualizer/
├── index.html        # Main UI, layout, and canvas container
├── style.css         # Responsive design and component styling
├── main.js           # Event listeners, modes, and editor logic
├── algorithms.js     # Pure algorithmic implementations
└── utils.js          # State management and canvas rendering

```
## How to Run
Because this project utilizes modern ES6 JavaScript Modules (import/export), it must be run through a local web server to avoid CORS security restrictions.
**1. Clone the repository:**
```bash
git clone [https://github.com/yourusername/graph-visualizer.git](https://github.com/yourusername/graph-visualizer.git)

```
**2. Navigate to the directory:**
```bash
cd graph-visualizer

```
**3. Run a local server:**
 * **Desktop (VS Code):** Install the Live Server extension, right-click index.html, and select Open with Live Server.
 * **Mobile (Spck Editor):** Import the files into a new HTML project and tap the Play button to utilize the built-in server.
## Learning Purpose
This tool was developed to:
 * Provide a visual, intuitive understanding of abstract graph theory.
 * Strengthen Data Structures and Algorithms (DSA) concepts.
 * Serve as a practical study aid for coding interviews and academic exams.
## Future Improvements
 * Directed graph support.
 * Negative weight cycle detection (Bellman-Ford Algorithm).
 * A* (A-Star) Pathfinding integration.
 * Draggable nodes to rearrange the graph layout post-creation.
## Contribution
Contributions, issues, and feature requests are highly encouraged. Feel free to fork the repository and submit a pull request!
## License
This project is open-source and free to use under the MIT License.
```

```
