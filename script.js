const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const startBfsBtn = document.getElementById('startBfsBtn');
const startDfsBtn = document.getElementById('startDfsBtn');
const startDijkstraBtn = document.getElementById('startDijkstraBtn');
const startFloydBtn = document.getElementById('startFloydBtn');
const resetBtn = document.getElementById('resetBtn');
const logBox = document.getElementById('logBox');
const dsContainer = document.getElementById('dsContainer');
const dsTitle = document.getElementById('dsTitle');
const conceptTitle = document.getElementById('conceptTitle');
const conceptDesc = document.getElementById('conceptDesc');
const complexityBox = document.getElementById('complexityBox');
const dynamicLegend = document.getElementById('dynamicLegend');

const resultsWrapper = document.getElementById('resultsWrapper');
const resultsTitle = document.getElementById('resultsTitle');
const resultsContent = document.getElementById('resultsContent');

const startNodeSelect = document.getElementById('startNodeSelect');
const speedControl = document.getElementById('speedControl');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const getSpeed = () => parseInt(speedControl.value, 10);

const initialNodes = [
    { id: 'A', x: 275, y: 50 },
    { id: 'B', x: 125, y: 150 },
    { id: 'C', x: 425, y: 150 },
    { id: 'D', x: 50,  y: 280 },
    { id: 'E', x: 200, y: 280 },
    { id: 'F', x: 350, y: 280 },
    { id: 'G', x: 500, y: 280 }
];

const edges = [
    ['A', 'B', 6], ['A', 'C', 2], 
    ['C', 'B', 3], 
    ['B', 'D', 5], ['B', 'E', 2], 
    ['C', 'F', 8], ['C', 'G', 10],
    ['E', 'F', 1]  
];

let nodes = [];
let isRunning = false;

function setupDropdown() {
    startNodeSelect.innerHTML = '';
    initialNodes.forEach(node => {
        const option = document.createElement('option');
        option.value = node.id;
        option.textContent = node.id;
        startNodeSelect.appendChild(option);
    });
}

function updateConceptText(algo) {
    if (algo === 'BFS') {
        conceptTitle.innerHTML = 'Breadth-First Search (BFS)';
        conceptTitle.style.color = 'var(--primary)';
        conceptDesc.innerHTML = `<strong>BFS</strong> explores layer by layer. The <strong style="color: #32CD32;">thick green lines</strong> show the resulting BFS Spanning Tree!`;
        dsTitle.innerHTML = 'Queue Status (FIFO)';
        dsTitle.style.color = 'var(--primary)';
        complexityBox.style.borderLeftColor = 'var(--primary)';
        complexityBox.innerHTML = `<strong>Time:</strong> O(V + E)<br><strong>Space:</strong> O(V)`;
    } else if (algo === 'DFS') {
        conceptTitle.innerHTML = 'Depth-First Search (DFS)';
        conceptTitle.style.color = 'var(--dfs-color)';
        conceptDesc.innerHTML = `<strong>DFS</strong> goes as deep as possible. The <strong style="color: #32CD32;">thick green lines</strong> show the resulting DFS Spanning Tree!`;
        dsTitle.innerHTML = 'Stack Status (LIFO)';
        dsTitle.style.color = 'var(--dfs-color)';
        complexityBox.style.borderLeftColor = 'var(--dfs-color)';
        complexityBox.innerHTML = `<strong>Time:</strong> O(V + E)<br><strong>Space:</strong> O(V)`;
    } else if (algo === 'Dijkstra') {
        conceptTitle.innerHTML = "Dijkstra's Algorithm";
        conceptTitle.style.color = 'var(--dijkstra-color)';
        conceptDesc.innerHTML = `<strong>Dijkstra</strong> finds shortest paths from the Start Node. Watch the <strong style="color: #e91e63;">distances</strong> update below the nodes!`;
        dsTitle.innerHTML = 'Priority Queue Status (Min Distance)';
        dsTitle.style.color = 'var(--dijkstra-color)';
        complexityBox.style.borderLeftColor = 'var(--dijkstra-color)';
        complexityBox.innerHTML = `<strong>Time:</strong> O((V + E) log V)<br><strong>Space:</strong> O(V)`;
    } else if (algo === 'Floyd') {
        conceptTitle.innerHTML = "Floyd-Warshall Algorithm";
        conceptTitle.style.color = 'var(--floyd-color)';
        conceptDesc.innerHTML = `<strong>Floyd-Warshall</strong> finds shortest paths between <strong>ALL PAIRS</strong> simultaneously! It evaluates every path via an intermediate node <i>k</i>. Watch the matrix update dynamically!`;
        dsTitle.innerHTML = '2D Distance Matrix';
        dsTitle.style.color = 'var(--floyd-color)';
        complexityBox.style.borderLeftColor = 'var(--floyd-color)';
        complexityBox.innerHTML = `<strong>Time:</strong> O(V³)<br><strong>Space:</strong> O(V²)`;
        
        // Update legend for Floyd
        dynamicLegend.innerHTML = `
            <div class="legend-item"><div class="color-box" style="background: #ffffff;"></div> Default</div>
            <div class="legend-item"><div class="color-box" style="background: #FFA500;"></div> Source (i)</div>
            <div class="legend-item"><div class="color-box" style="background: #87CEFA;"></div> Dest (j)</div>
            <div class="legend-item"><div class="color-box" style="background: #9C27B0;"></div> Via (k)</div>
        `;
    }
}

function logMessage(msg) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    const time = new Date().toLocaleTimeString([], { hour12: false });
    entry.innerHTML = `<span style="color: #888;">[${time}]</span> ${msg}`;
    logBox.appendChild(entry);
    logBox.scrollTop = logBox.scrollHeight;
}

function renderDataStructureVisual(array, type = 'Queue') {
    dsContainer.innerHTML = ''; 
    if (array.length === 0) {
        dsContainer.innerHTML = `<span class="empty-ds-msg">${type} is empty</span>`;
        return;
    }
    array.forEach(item => {
        const div = document.createElement('div');
        div.className = 'ds-item';
        div.textContent = item;
        dsContainer.appendChild(div);
    });
}

// NEW: Renders a 2D Matrix for Floyd-Warshall
function renderMatrixVisual(matrix, activeI = -1, activeJ = -1, updated = false) {
    dsContainer.innerHTML = '';
    const table = document.createElement('table');
    table.className = 'matrix-table';

    // Header Row
    const trHead = document.createElement('tr');
    trHead.innerHTML = '<th></th>' + nodes.map(n => `<th>${n.id}</th>`).join('');
    table.appendChild(trHead);

    for (let i = 0; i < matrix.length; i++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<th>${nodes[i].id}</th>`;
        
        for (let j = 0; j < matrix[i].length; j++) {
            const td = document.createElement('td');
            let val = matrix[i][j] === Infinity ? '∞' : matrix[i][j];
            td.textContent = val;
            
            if (i === activeI && j === activeJ) {
                td.className = updated ? 'matrix-update' : 'matrix-highlight';
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    dsContainer.appendChild(table);
}

function resetGraph() {
    nodes = initialNodes.map(node => ({ ...node, state: 'unvisited', distance: Infinity, parent: null }));
    isRunning = false;
    startBfsBtn.disabled = false;
    startDfsBtn.disabled = false;
    startDijkstraBtn.disabled = false;
    startFloydBtn.disabled = false;
    startNodeSelect.disabled = false;
    logBox.innerHTML = ''; 
    
    resultsWrapper.style.display = 'none';
    resultsContent.innerHTML = '';
    
    dsTitle.innerHTML = 'Data Structure Status';
    dsTitle.style.color = 'var(--text-color)';
    conceptTitle.innerHTML = 'Algorithm Concept';
    conceptTitle.style.color = 'var(--text-color)';
    conceptDesc.innerHTML = `Select an algorithm to see how it explores the graph differently!`;
    complexityBox.style.borderLeftColor = '#333';
    
    // Reset Legend
    dynamicLegend.innerHTML = `
        <div class="legend-item"><div class="color-box" style="background: #ffffff;"></div> Unvisited</div>
        <div class="legend-item"><div class="color-box" style="background: #87CEFA;"></div> In Memory</div>
        <div class="legend-item"><div class="color-box" style="background: #FFA500;"></div> Processing</div>
        <div class="legend-item"><div class="color-box" style="background: #32CD32;"></div> Visited</div>
    `;
    
    renderDataStructureVisual([], 'Data Structure'); 
    logMessage('Graph initialized. Ready to start.');
    drawGraph();
}

function getNode(id) { return nodes.find(n => n.id === id); }

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    edges.forEach(([id1, id2, weight]) => {
        const n1 = getNode(id1);
        const n2 = getNode(id2);
        const isPathEdge = (n1.parent === n2.id) || (n2.parent === n1.id);
        
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = isPathEdge ? '#32CD32' : '#ccc';    
        ctx.lineWidth = isPathEdge ? 4 : 2;
        ctx.stroke();

        const midX = (n1.x + n2.x) / 2;
        const midY = (n1.y + n2.y) / 2;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(midX, midY, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#e91e63'; 
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(weight, midX, midY);
    });

    nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
        
        // Standard Colors vs Floyd Colors
        if (node.state === 'unvisited') { ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#333'; } 
        else if (node.state === 'queued') { ctx.fillStyle = '#87CEFA'; ctx.strokeStyle = '#333'; } // Blue
        else if (node.state === 'current') { ctx.fillStyle = '#FFA500'; ctx.strokeStyle = '#333'; } // Orange
        else if (node.state === 'visited') { ctx.fillStyle = '#32CD32'; ctx.strokeStyle = '#111'; } // Green
        else if (node.state === 'via') { ctx.fillStyle = '#9C27B0'; ctx.strokeStyle = '#fff'; } // Purple for Floyd 'k'

        ctx.fill();
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = (node.state === 'unvisited' || node.state === 'queued' || node.state === 'current') ? '#333' : '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id, node.x, node.y);

        if (node.distance !== Infinity && node.distance !== null) {
            ctx.fillStyle = '#e91e63';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(`d: ${node.distance}`, node.x, node.y + 40);
        }
    });
}

function lockControls() {
    isRunning = true;
    startBfsBtn.disabled = true;
    startDfsBtn.disabled = true;
    startDijkstraBtn.disabled = true;
    startFloydBtn.disabled = true;
    resetBtn.disabled = true; 
    startNodeSelect.disabled = true; 
    logBox.innerHTML = '';
}

function buildAdjacencyList() {
    const adjList = {};
    nodes.forEach(n => adjList[n.id] = []);
    edges.forEach(([u, v, weight]) => {
        adjList[u].push({ neighbor: v, weight: weight });
        adjList[v].push({ neighbor: u, weight: weight });
    });
    return adjList;
}

function displayResults(title, htmlContent, color) {
    resultsTitle.innerHTML = title;
    resultsTitle.style.color = color;
    resultsContent.style.borderLeftColor = color;
    resultsContent.innerHTML = htmlContent;
    resultsWrapper.style.display = 'block';
    resultsWrapper.scrollIntoView({ behavior: 'smooth' }); 
}

// ---------------- BFS LOGIC ----------------
async function runBFS() { /* ... (Unchanged, keep logic from previous step) ... */ 
    if (isRunning) return; lockControls(); updateConceptText('BFS');
    const adjList = buildAdjacencyList(); const queue = []; const traversalOrder = [];
    const startNode = getNode(startNodeSelect.value); 
    queue.push(startNode.id); renderDataStructureVisual(queue, 'Queue'); startNode.state = 'queued'; drawGraph(); await sleep(getSpeed());
    while (queue.length > 0) {
        if (!isRunning) break; 
        const currentId = queue.shift(); renderDataStructureVisual(queue, 'Queue'); const currentNode = getNode(currentId);
        currentNode.state = 'current'; traversalOrder.push(currentId); drawGraph(); await sleep(getSpeed());
        for (let edge of adjList[currentId]) {
            const neighborNode = getNode(edge.neighbor);
            if (neighborNode.state === 'unvisited') {
                neighborNode.state = 'queued'; neighborNode.parent = currentId; 
                queue.push(edge.neighbor); renderDataStructureVisual(queue, 'Queue'); drawGraph(); await sleep(getSpeed() * 0.8);
            }
        }
        currentNode.state = 'visited'; drawGraph(); await sleep(getSpeed() * 0.8);
    }
    logMessage('<b>Finished:</b> BFS path complete!'); resetBtn.disabled = false;
    const routeHTML = traversalOrder.map(n => `<div class="result-badge">${n}</div>`).join('<span class="path-arrow">→</span>');
    displayResults('BFS Traversal Route', routeHTML, 'var(--primary)');
}

// ---------------- DFS LOGIC ----------------
async function runDFS() { /* ... (Unchanged, keep logic from previous step) ... */ 
    if (isRunning) return; lockControls(); updateConceptText('DFS');
    const adjList = buildAdjacencyList(); const stack = []; const traversalOrder = [];
    const startNode = getNode(startNodeSelect.value); 
    stack.push(startNode.id); renderDataStructureVisual(stack, 'Stack'); startNode.state = 'queued'; drawGraph(); await sleep(getSpeed());
    while (stack.length > 0) {
        if (!isRunning) break; 
        const currentId = stack.pop(); renderDataStructureVisual(stack, 'Stack'); const currentNode = getNode(currentId);
        currentNode.state = 'current'; traversalOrder.push(currentId); drawGraph(); await sleep(getSpeed());
        const neighbors = [...adjList[currentId]].reverse();
        for (let edge of neighbors) {
            const neighborNode = getNode(edge.neighbor);
            if (neighborNode.state === 'unvisited') {
                neighborNode.state = 'queued'; neighborNode.parent = currentId; 
                stack.push(edge.neighbor); renderDataStructureVisual(stack, 'Stack'); drawGraph(); await sleep(getSpeed() * 0.8);
            }
        }
        currentNode.state = 'visited'; drawGraph(); await sleep(getSpeed() * 0.8);
    }
    logMessage('<b>Finished:</b> DFS path complete!'); resetBtn.disabled = false;
    const routeHTML = traversalOrder.map(n => `<div class="result-badge">${n}</div>`).join('<span class="path-arrow">→</span>');
    displayResults('DFS Traversal Route', routeHTML, 'var(--dfs-color)');
}

// ---------------- DIJKSTRA LOGIC ----------------
async function runDijkstra() { /* ... (Unchanged, keep logic from previous step) ... */ 
    if (isRunning) return; lockControls(); updateConceptText('Dijkstra');
    const adjList = buildAdjacencyList(); const startId = startNodeSelect.value; const startNode = getNode(startId);
    startNode.distance = 0; const pq = [{ id: startId, dist: 0 }]; const formatPQ = (q) => q.map(item => `${item.id}(${item.dist})`);
    logMessage(`<b>Start:</b> Setting Node ${startId} distance to 0.`); renderDataStructureVisual(formatPQ(pq), 'Priority Queue'); startNode.state = 'queued'; drawGraph(); await sleep(getSpeed());
    while (pq.length > 0) {
        if (!isRunning) break; pq.sort((a, b) => a.dist - b.dist); const currentItem = pq.shift(); const currentId = currentItem.id; const currentNode = getNode(currentId);
        if (currentNode.state === 'visited') continue;
        renderDataStructureVisual(formatPQ(pq), 'Priority Queue'); currentNode.state = 'current'; drawGraph(); await sleep(getSpeed());
        for (let edge of adjList[currentId]) {
            const neighborId = edge.neighbor; const weight = edge.weight; const neighborNode = getNode(neighborId);
            if (neighborNode.state !== 'visited') {
                const newDist = currentNode.distance + weight;
                if (newDist < neighborNode.distance) {
                    neighborNode.distance = newDist; neighborNode.parent = currentId; 
                    logMessage(`↳ <b>Update:</b> Shorter path to ${neighborId} is ${newDist}!`);
                    neighborNode.state = 'queued'; pq.push({ id: neighborId, dist: newDist });
                    renderDataStructureVisual(formatPQ(pq), 'Priority Queue'); drawGraph(); await sleep(getSpeed() * 0.8);
                }
            }
        }
        currentNode.state = 'visited'; drawGraph(); await sleep(getSpeed() * 0.8);
    }
    logMessage('<b>Finished:</b> Shortest paths found!'); resetBtn.disabled = false;
    const distancesHTML = nodes.map(n => { const distStr = n.distance === Infinity ? '∞' : n.distance; return `<div class="result-badge">Node ${n.id} : <strong>${distStr}</strong></div>`; }).join('');
    displayResults(`Shortest Distances from Node ${startId}`, distancesHTML, 'var(--dijkstra-color)');
}

// ---------------- FLOYD-WARSHALL LOGIC ----------------
async function runFloydWarshall() {
    if (isRunning) return;
    lockControls();
    updateConceptText('Floyd');

    // Hide manual node distances to avoid clutter, FW uses the matrix
    nodes.forEach(n => n.distance = null);

    const N = nodes.length;
    // Initialize V x V matrix
    const dist = Array(N).fill(null).map(() => Array(N).fill(Infinity));
    
    // Setup initial distances (Edges + Diagonals = 0)
    for (let i = 0; i < N; i++) dist[i][i] = 0;
    edges.forEach(([u, v, w]) => {
        const uIdx = nodes.findIndex(n => n.id === u);
        const vIdx = nodes.findIndex(n => n.id === v);
        dist[uIdx][vIdx] = w;
        dist[vIdx][uIdx] = w; // Undirected
    });

    logMessage(`<b>Start:</b> Initializing Adjacency Matrix.`);
    renderMatrixVisual(dist);
    drawGraph();
    await sleep(1000);

    // O(V^3) Loop
    for (let k = 0; k < N; k++) {
        if (!isRunning) break;
        logMessage(`<b>Phase ${k+1}/${N}:</b> Testing all paths going <i>via</i> Node ${nodes[k].id}.`);
        
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                if (!isRunning) break;
                
                // Skip self-loops or impossible paths to speed up visualization visually
                if (i === j || dist[i][k] === Infinity || dist[k][j] === Infinity) continue;

                const currentPath = dist[i][j];
                const newPath = dist[i][k] + dist[k][j];

                if (newPath < currentPath) {
                    dist[i][j] = newPath;
                    
                    // Flash Graph to show what's being evaluated
                    nodes.forEach(n => n.state = 'unvisited');
                    nodes[i].state = 'current'; // Orange (Source)
                    nodes[j].state = 'queued';  // Blue (Dest)
                    nodes[k].state = 'via';     // Purple (Via node)
                    
                    logMessage(`↳ <b>Update:</b> ${nodes[i].id} → ${nodes[j].id} via ${nodes[k].id} is shorter! (New Dist: ${newPath})`);
                    
                    renderMatrixVisual(dist, i, j, true);
                    drawGraph();
                    
                    // Only pause if an actual update happened to keep it from taking too long
                    await sleep(Math.max(300, getSpeed())); 
                } else {
                    // Optional: Show the cell being checked without pausing as long
                    renderMatrixVisual(dist, i, j, false);
                    await sleep(Math.min(10, getSpeed() / 10)); // Very fast skip
                }
            }
        }
        
        // Reset colors at end of 'k' phase
        nodes.forEach(n => n.state = 'unvisited');
        drawGraph();
    }

    renderMatrixVisual(dist);
    logMessage('<b>Finished:</b> All-Pairs Shortest Paths computed!');
    resetBtn.disabled = false;

    // Show final matrix in the results box!
    let matrixHTML = `<table class="matrix-table" 
