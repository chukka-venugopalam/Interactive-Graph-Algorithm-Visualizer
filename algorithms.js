// ==========================================
// algorithms.js - Complete Algorithm Logic
// ==========================================
import * as utils from './utils.js';

// --- HELPER FUNCTIONS ---
function buildAdjacencyList() {
    const adjList = {};
    utils.nodes.forEach(n => adjList[n.id] = []);
    utils.edges.forEach(([u, v, w]) => {
        if (adjList[u] && adjList[v]) {
            adjList[u].push({ neighbor: v, weight: w });
            adjList[v].push({ neighbor: u, weight: w });
        }
    });
    return adjList;
}

// Renders the 2D Matrix for Floyd-Warshall
function renderMatrixVisual(matrix, activeI = -1, activeJ = -1, updated = false) {
    const dsContainer = document.getElementById('dsContainer');
    dsContainer.innerHTML = '';
    const table = document.createElement('table');
    table.className = 'matrix-table';
    const trHead = document.createElement('tr');
    trHead.innerHTML = '<th></th>' + utils.nodes.map(n => `<th>${n.id}</th>`).join('');
    table.appendChild(trHead);

    for (let i = 0; i < matrix.length; i++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<th>${utils.nodes[i].id}</th>`;
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

// ==========================================
// 1. BFS (Breadth-First Search)
// ==========================================
export async function runBFS(startId) {
    if (utils.isRunning) return;
    utils.lockControls();
    utils.updateConceptText('BFS', 'Breadth-First Search', 'Explores layer by layer. Uses Queue (FIFO). The <strong style="color: #32CD32;">green lines</strong> show the BFS Tree.', 'var(--primary)');
    
    const adjList = buildAdjacencyList();
    const queue = [];
    const traversalOrder = [];
    const startNode = utils.getNode(startId); 
    
    if(!startNode) { utils.unlockControls(); return; }

    utils.logMessage(`<b>Start:</b> Pushing Node ${startNode.id} to Queue.`);
    queue.push(startNode.id);
    utils.renderDataStructureVisual(queue, 'Queue (FIFO)');
    startNode.state = 'queued';
    utils.drawGraph();
    await utils.sleep(utils.getSpeed());

    while (queue.length > 0) {
        if (!utils.isRunning) break; 
        const currentId = queue.shift();
        utils.renderDataStructureVisual(queue, 'Queue (FIFO)');
        const currentNode = utils.getNode(currentId);
        
        currentNode.state = 'current'; traversalOrder.push(currentId);
        utils.drawGraph(); await utils.sleep(utils.getSpeed());

        for (let edge of adjList[currentId]) {
            const neighborNode = utils.getNode(edge.neighbor);
            if (neighborNode.state === 'unvisited') {
                neighborNode.state = 'queued'; neighborNode.parent = currentId; 
                queue.push(edge.neighbor);
                utils.renderDataStructureVisual(queue, 'Queue (FIFO)');
                utils.drawGraph(); await utils.sleep(utils.getSpeed() * 0.8);
            }
        }
        currentNode.state = 'visited'; utils.drawGraph(); await utils.sleep(utils.getSpeed() * 0.8);
    }
    
    utils.logMessage('<b>Finished:</b> BFS path complete!'); utils.unlockControls();
    const routeHTML = traversalOrder.map(n => `<div class="result-badge">${n}</div>`).join('<span class="path-arrow">→</span>');
    utils.displayResults('BFS Traversal Route', routeHTML, 'var(--primary)');
}

// ==========================================
// 2. DFS (Depth-First Search)
// ==========================================
export async function runDFS(startId) {
    if (utils.isRunning) return;
    utils.lockControls();
    utils.updateConceptText('DFS', 'Depth-First Search', 'Plunges as deep as possible. Uses Stack (LIFO). The <strong style="color: #32CD32;">green lines</strong> show the DFS Tree.', 'var(--dfs-color)');
    
    const adjList = buildAdjacencyList();
    const stack = [];
    const traversalOrder = [];
    const startNode = utils.getNode(startId); 
    
    if(!startNode) { utils.unlockControls(); return; }

    utils.logMessage(`<b>Start:</b> Pushing Node ${startNode.id} to Stack.`);
    stack.push(startNode.id);
    utils.renderDataStructureVisual(stack, 'Stack (LIFO)');
    startNode.state = 'queued';
    utils.drawGraph();
    await utils.sleep(utils.getSpeed());

    while (stack.length > 0) {
        if (!utils.isRunning) break; 
        const currentId = stack.pop();
        utils.renderDataStructureVisual(stack, 'Stack (LIFO)');
        const currentNode = utils.getNode(currentId);
        
        currentNode.state = 'current'; traversalOrder.push(currentId);
        utils.drawGraph(); await utils.sleep(utils.getSpeed());

        const neighbors = [...adjList[currentId]].reverse();
        for (let edge of neighbors) {
            const neighborNode = utils.getNode(edge.neighbor);
            if (neighborNode.state === 'unvisited') {
                neighborNode.state = 'queued'; neighborNode.parent = currentId; 
                stack.push(edge.neighbor);
                utils.renderDataStructureVisual(stack, 'Stack (LIFO)');
                utils.drawGraph(); await utils.sleep(utils.getSpeed() * 0.8);
            }
        }
        currentNode.state = 'visited'; utils.drawGraph(); await utils.sleep(utils.getSpeed() * 0.8);
    }
    
    utils.logMessage('<b>Finished:</b> DFS path complete!'); utils.unlockControls();
    const routeHTML = traversalOrder.map(n => `<div class="result-badge">${n}</div>`).join('<span class="path-arrow">→</span>');
    utils.displayResults('DFS Traversal Route', routeHTML, 'var(--dfs-color)');
}

// ==========================================
// 3. Dijkstra's Algorithm
// ==========================================
export async function runDijkstra(startId) {
    if (utils.isRunning) return;
    utils.lockControls();
    utils.updateConceptText('Dijkstra', "Dijkstra's Algorithm", "Finds shortest paths from start node. Uses Priority Queue.", 'var(--dijkstra-color)');
    
    const adjList = buildAdjacencyList();
    const startNode = utils.getNode(startId);
    if(!startNode) { utils.unlockControls(); return; }

    startNode.distance = 0; 
    const pq = [{ id: startId, dist: 0 }];
    const formatPQ = (q) => q.map(item => `${item.id}(${item.dist})`);

    utils.logMessage(`<b>Start:</b> Setting Node ${startId} distance to 0.`);
    utils.renderDataStructureVisual(formatPQ(pq), 'Priority Queue (Min Dist)');
    startNode.state = 'queued'; utils.drawGraph(); await utils.sleep(utils.getSpeed());

    while (pq.length > 0) {
        if (!utils.isRunning) break;
        pq.sort((a, b) => a.dist - b.dist);
        const currentId = pq.shift().id;
        const currentNode = utils.getNode(currentId);

        if (currentNode.state === 'visited') continue;

        utils.renderDataStructureVisual(formatPQ(pq), 'Priority Queue (Min Dist)');
        currentNode.state = 'current'; utils.drawGraph(); await utils.sleep(utils.getSpeed());

        for (let edge of adjList[currentId]) {
            const neighborNode = utils.getNode(edge.neighbor);
            if (neighborNode.state !== 'visited') {
                const newDist = currentNode.distance + edge.weight;
                if (newDist < neighborNode.distance) {
                    neighborNode.distance = newDist; neighborNode.parent = currentId; 
                    utils.logMessage(`↳ <b>Update:</b> Shorter path to ${edge.neighbor} is ${newDist}!`);
                    neighborNode.state = 'queued'; pq.push({ id: edge.neighbor, dist: newDist });
                    utils.renderDataStructureVisual(formatPQ(pq), 'Priority Queue');
                    utils.drawGraph(); await utils.sleep(utils.getSpeed() * 0.8);
                }
            }
        }
        currentNode.state = 'visited'; utils.drawGraph(); await utils.sleep(utils.getSpeed() * 0.8);
    }
    
    utils.logMessage('<b>Finished:</b> Shortest paths found!'); utils.unlockControls();
    const distancesHTML = utils.nodes.map(n => `<div class="result-badge">Node ${n.id}: <strong>${n.distance === Infinity ? '∞' : n.distance}</strong></div>`).join('');
    utils.displayResults(`Shortest Distances from ${startId}`, distancesHTML, 'var(--dijkstra-color)');
}

// ==========================================
// 4. Floyd-Warshall Algorithm
// ==========================================
export async function runFloydWarshall() {
    if (utils.isRunning) return; 
    utils.lockControls(); 
    utils.updateConceptText('Floyd', "Floyd-Warshall", "Finds all-pairs shortest paths via DP Matrix updating.", 'var(--floyd-color)');
    
    // Change Legend for Floyd
    document.getElementById('dynamicLegend').innerHTML = `
        <div class="legend-item"><div class="color-box" style="background: #ffffff;"></div> Default</div>
        <div class="legend-item"><div class="color-box" style="background: #FFA500;"></div> Source (i)</div>
        <div class="legend-item"><div class="color-box" style="background: #87CEFA;"></div> Dest (j)</div>
        <div class="legend-item"><div class="color-box" style="background: #9C27B0;"></div> Via (k)</div>
    `;

    utils.nodes.forEach(n => n.distance = null);
    const N = utils.nodes.length; 
    const dist = Array(N).fill(null).map(() => Array(N).fill(Infinity));
    
    for (let i = 0; i < N; i++) dist[i][i] = 0;
    utils.edges.forEach(([u, v, w]) => { 
        const uIdx = utils.nodes.findIndex(n => n.id === u); 
        const vIdx = utils.nodes.findIndex(n => n.id === v); 
        dist[uIdx][vIdx] = w; dist[vIdx][uIdx] = w; 
    });

    utils.logMessage(`<b>Start:</b> Initializing Adjacency Matrix.`); 
    renderMatrixVisual(dist); utils.drawGraph(); await utils.sleep(1000);

    for (let k = 0; k < N; k++) {
        if (!utils.isRunning) break; 
        utils.logMessage(`<b>Phase ${k+1}/${N}:</b> Testing all paths going <i>via</i> Node ${utils.nodes[k].id}.`);
        
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                if (!utils.isRunning) break;
                if (i === j || dist[i][k] === Infinity || dist[k][j] === Infinity) continue;
                
                const currentPath = dist[i][j]; 
                const newPath = dist[i][k] + dist[k][j];
                
                if (newPath < currentPath) {
                    dist[i][j] = newPath;
                    utils.nodes.forEach(n => n.state = 'unvisited'); 
                    utils.nodes[i].state = 'current'; 
                    utils.nodes[j].state = 'queued'; 
                    utils.nodes[k].state = 'via';
                    
                    utils.logMessage(`↳ <b>Update:</b> ${utils.nodes[i].id} → ${utils.nodes[j].id} via ${utils.nodes[k].id} is shorter! (${newPath})`);
                    renderMatrixVisual(dist, i, j, true); utils.drawGraph(); await utils.sleep(Math.max(300, utils.getSpeed())); 
                } else {
                    renderMatrixVisual(dist, i, j, false); await utils.sleep(Math.min(10, utils.getSpeed() / 10)); 
                }
            }
        }
        utils.nodes.forEach(n => n.state = 'unvisited'); utils.drawGraph();
    }
    
    renderMatrixVisual(dist); utils.logMessage('<b>Finished:</b> All-Pairs Shortest Paths computed!'); utils.unlockControls();
    
    let matrixHTML = `<table class="matrix-table" style="margin: 0; background: transparent;"><tr><th></th>${utils.nodes.map(n => `<th>${n.id}</th>`).join('')}</tr>`;
    for(let i = 0; i < N; i++) { matrixHTML += `<tr><th>${utils.nodes[i].id}</th>`; for(let j = 0; j < N; j++) { let val = dist[i][j] === Infinity ? '∞' : dist[i][j]; matrixHTML += `<td>${val}</td>`; } matrixHTML += `</tr>`; }
    matrixHTML += `</table>`;
    utils.displayResults(`Floyd-Warshall Final Matrix`, matrixHTML, 'var(--floyd-color)');
}

// ==========================================
// 5. Prim's Algorithm (MST)
// ==========================================
export async function runPrims(startId) {
    if (utils.isRunning) return;
    utils.lockControls();
    utils.updateConceptText('Prims', "Prim's Algorithm (MST)", "Builds MST by picking cheapest edges. Uses Priority Queue.", 'var(--prims-color)');

    const adjList = buildAdjacencyList();
    const startNode = utils.getNode(startId);
    if(!startNode) { utils.unlockControls(); return; }

    startNode.distance = 0; 
    const pq = [{ id: startId, dist: 0 }];
    const formatPQ = (q) => q.map(item => `${item.id}(${item.dist})`);

    utils.logMessage(`<b>Start:</b> Building MST starting from Node ${startId}.`);
    utils.renderDataStructureVisual(formatPQ(pq), 'Priority Queue (Min Weight)');
    startNode.state = 'queued'; utils.drawGraph(); await utils.sleep(utils.getSpeed());

    let totalMSTWeight = 0;
    const mstEdges = [];

    while (pq.length > 0) {
        if (!utils.isRunning) break;
        pq.sort((a, b) => a.dist - b.dist);
        const currentId = pq.shift().id;
        const currentNode = utils.getNode(currentId);

        if (currentNode.state === 'visited') continue;

        if (currentNode.parent !== null) {
            const connectingEdge = adjList[currentNode.parent].find(e => e.neighbor === currentId);
            if (connectingEdge) {
                totalMSTWeight += connectingEdge.weight;
                mstEdges.push(`${currentNode.parent} ↔ ${currentId} (Wt: ${connectingEdge.weight})`);
            }
        }

        utils.renderDataStructureVisual(formatPQ(pq), 'Priority Queue');
        currentNode.state = 'current'; utils.drawGraph(); await utils.sleep(utils.getSpeed());

        for (let edge of adjList[currentId]) {
            const neighborNode = utils.getNode(edge.neighbor);
            if (neighborNode.state !== 'visited' && edge.weight < neighborNode.distance) {
                neighborNode.distance = edge.weight; neighborNode.parent = currentId; 
                utils.logMessage(`↳ <b>Update:</b> Cheaper edge to ${edge.neighbor} (Wt: ${edge.weight}).`);
                neighborNode.state = 'queued'; pq.push({ id: edge.neighbor, dist: edge.weight });
                utils.renderDataStructureVisual(formatPQ(pq), 'Priority Queue');
                utils.drawGraph(); await utils.sleep(utils.getSpeed() * 0.8);
            }
        }
        currentNode.state = 'visited'; utils.drawGraph(); await utils.sleep(utils.getSpeed() * 0.8);
    }

    utils.logMessage(`<b>Finished:</b> MST built! Weight: ${totalMSTWeight}`); utils.unlockControls();
    const mstHTML = `<div style="width: 100%; font-size: 18px; margin-bottom: 10px;">Total Weight: <strong style="color: var(--prims-color);">${totalMSTWeight}</strong></div>${mstEdges.map(e => `<div class="result-badge">${e}</div>`).join('')}`;
    utils.displayResults(`Prim's Minimum Spanning Tree`, mstHTML, 'var(--prims-color)');
}

// ==========================================
// 6. Kruskal's Algorithm (MST)
// ==========================================
export async function runKruskal() {
    if (utils.isRunning) return;
    utils.lockControls();
    utils.updateConceptText('Kruskal', "Kruskal's Algorithm (MST)", "Sorts ALL edges globally and uses Disjoint Set (Union-Find).", 'var(--kruskal-color)');
    
    utils.nodes.forEach(n => n.distance = null);
    let sortedEdges = utils.edges.map(e => ({ u: e[0], v: e[1], w: e[2] }));
    sortedEdges.sort((a, b) => a.w - b.w);

    const parentMap = {};
    utils.nodes.forEach(n => parentMap[n.id] = n.id);
    const find = (i) => (parentMap[i] === i) ? i : (parentMap[i] = find(parentMap[i])); 

    let totalMSTWeight = 0;
    const mstEdgesLog = [];
    const formatEdges = (edgeList) => edgeList.map(e => `${e.u}-${e.v}(${e.w})`);

    utils.logMessage(`<b>Start:</b> Edges sorted globally by weight.`); utils.drawGraph(); await utils.sleep(utils.getSpeed());

    for (let i = 0; i < sortedEdges.length; i++) {
        if (!utils.isRunning) break;
        const edge = sortedEdges[i];
        const nodeU = utils.getNode(edge.u);
        const nodeV = utils.getNode(edge.v);

        utils.renderDataStructureVisual(formatEdges(sortedEdges.slice(i)), 'Sorted Edge List');

        const oldStateU = nodeU.state; const oldStateV = nodeV.state;
        nodeU.state = 'current'; nodeV.state = 'current'; utils.drawGraph();
        utils.logMessage(`Evaluating edge <b>${edge.u}-${edge.v}</b> (Wt: ${edge.w})...`);
        await utils.sleep(utils.getSpeed());

        const rootU = find(edge.u);
        const rootV = find(edge.v);

        if (rootU !== rootV) {
            parentMap[rootU] = rootV;
            totalMSTWeight += edge.w;
            mstEdgesLog.push(`${edge.u} ↔ ${edge.v} (Wt: ${edge.w})`);
            nodeU.mstLinks.push(edge.v); 
            utils.logMessage(`↳ <b style="color: var(--kruskal-color);">Include:</b> Added to MST!`);
            nodeU.state = 'visited'; nodeV.state = 'visited';
        } else {
            utils.logMessage(`↳ <b style="color: var(--danger);">Discard:</b> Creates a cycle.`);
            nodeU.state = oldStateU === 'unvisited' ? 'unvisited' : 'visited';
            nodeV.state = oldStateV === 'unvisited' ? 'unvisited' : 'visited';
        }
        utils.drawGraph(); await utils.sleep(utils.getSpeed() * 0.8);
    }

    utils.logMessage(`<b>Finished:</b> MST built! Weight: ${totalMSTWeight}`); utils.unlockControls();
    const mstHTML = `<div style="width: 100%; font-size: 18px; margin-bottom: 10px;">Total Weight: <strong style="color: var(--kruskal-color);">${totalMSTWeight}</strong></div>${mstEdgesLog.map(e => `<div class="result-badge">${e}</div>`).join('')}`;
    utils.displayResults(`Kruskal's Minimum Spanning Tree`, mstHTML, 'var(--kruskal-color)');
                                                                            }
      
