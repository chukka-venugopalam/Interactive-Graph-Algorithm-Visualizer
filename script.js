const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const startBfsBtn = document.getElementById('startBfsBtn');
const startDfsBtn = document.getElementById('startDfsBtn');
const resetBtn = document.getElementById('resetBtn');
const logBox = document.getElementById('logBox');
const dsContainer = document.getElementById('dsContainer');
const dsTitle = document.getElementById('dsTitle');
const conceptTitle = document.getElementById('conceptTitle');
const conceptDesc = document.getElementById('conceptDesc');

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
    ['A', 'B'], ['A', 'C'], 
    ['B', 'D'], ['B', 'E'], 
    ['C', 'F'], ['C', 'G'],
    ['E', 'F'] 
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
        conceptDesc.innerHTML = `<strong>BFS</strong> explores a graph layer by layer. It uses a <strong>Queue (First-In-First-Out)</strong>. Notice how it visits all immediate neighbors first before going deeper.`;
        dsTitle.innerHTML = 'Queue Status (FIFO - First In, First Out)';
        dsTitle.style.color = 'var(--primary)';
    } else if (algo === 'DFS') {
        conceptTitle.innerHTML = 'Depth-First Search (DFS)';
        conceptTitle.style.color = 'var(--dfs-color)';
        conceptDesc.innerHTML = `<strong>DFS</strong> plunges as deep as possible into a graph before backtracking. It uses a <strong>Stack (Last-In-First-Out)</strong>. Notice how it chases a single path all the way to the end!`;
        dsTitle.innerHTML = 'Stack Status (LIFO - Last In, First Out)';
        dsTitle.style.color = 'var(--dfs-color)';
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

    array.forEach(nodeId => {
        const item = document.createElement('div');
        item.className = 'ds-item';
        item.textContent = nodeId;
        dsContainer.appendChild(item);
    });
}

function resetGraph() {
    nodes = initialNodes.map(node => ({ ...node, state: 'unvisited' }));
    isRunning = false;
    startBfsBtn.disabled = false;
    startDfsBtn.disabled = false;
    startNodeSelect.disabled = false;
    logBox.innerHTML = ''; 
    dsTitle.innerHTML = 'Data Structure Status';
    dsTitle.style.color = 'var(--text-color)';
    conceptTitle.innerHTML = 'Algorithm Concept';
    conceptTitle.style.color = 'var(--text-color)';
    conceptDesc.innerHTML = `Select <strong>Start BFS</strong> or <strong>Start DFS</strong> to see how they explore the graph differently!`;
    renderDataStructureVisual([], 'Data Structure'); 
    logMessage('Graph initialized. Ready to start.');
    drawGraph();
}

function getNode(id) {
    return nodes.find(n => n.id === id);
}

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#999';
    edges.forEach(([id1, id2]) => {
        const n1 = getNode(id1);
        const n2 = getNode(id2);
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.stroke();
    });

    nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
        
        if (node.state === 'unvisited') {
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#333';
        } else if (node.state === 'queued') {
            ctx.fillStyle = '#87CEFA'; 
            ctx.strokeStyle = '#333';
        } else if (node.state === 'current') {
            ctx.fillStyle = '#FFA500'; 
            ctx.strokeStyle = '#333';
        } else if (node.state === 'visited') {
            ctx.fillStyle = '#32CD32'; 
            ctx.strokeStyle = '#111';
        }

        ctx.fill();
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = (node.state === 'unvisited' || node.state === 'queued') ? '#333' : '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id, node.x, node.y);
    });
}

function lockControls() {
    isRunning = true;
    startBfsBtn.disabled = true;
    startDfsBtn.disabled = true;
    resetBtn.disabled = true; 
    startNodeSelect.disabled = true; 
    logBox.innerHTML = '';
}

function buildAdjacencyList() {
    const adjList = {};
    nodes.forEach(n => adjList[n.id] = []);
    edges.forEach(([u, v]) => {
        adjList[u].push(v);
        adjList[v].push(u);
    });
    return adjList;
}

// ---------------- BFS LOGIC (FIFO Queue) ----------------
async function runBFS() {
    if (isRunning) return;
    lockControls();
    updateConceptText('BFS');

    const adjList = buildAdjacencyList();
    const queue = [];
    const startNode = getNode(startNodeSelect.value); 
    
    logMessage(`<b>Start:</b> Pushing Node ${startNode.id} to Queue.`);
    queue.push(startNode.id);
    renderDataStructureVisual(queue, 'Queue');
    
    startNode.state = 'queued';
    drawGraph();
    await sleep(getSpeed());

    while (queue.length > 0) {
        if (!isRunning) break; 

        // FIFO: Take from the FRONT of the array
        const currentId = queue.shift();
        renderDataStructureVisual(queue, 'Queue');

        const currentNode = getNode(currentId);
        
        logMessage(`<b>Dequeue:</b> Node ${currentId} shifted from Queue to be processed.`);
        currentNode.state = 'current';
        drawGraph();
        await sleep(getSpeed());

        let foundNeighbors = false;

        for (let neighborId of adjList[currentId]) {
            const neighborNode = getNode(neighborId);
            
            if (neighborNode.state === 'unvisited') {
                foundNeighbors = true;
                logMessage(`↳ Found unvisited neighbor ${neighborId}. Pushing to Queue.`);
                neighborNode.state = 'queued';
                
                queue.push(neighborId);
                renderDataStructureVisual(queue, 'Queue');
                drawGraph();
                await sleep(getSpeed() * 0.8);
            }
        }

        if(!foundNeighbors) logMessage(`↳ No unvisited neighbors for Node ${currentId}.`);

        logMessage(`<b>Complete:</b> Node ${currentId} is fully visited.`);
        currentNode.state = 'visited';
        drawGraph();
        await sleep(getSpeed() * 0.8);
    }

    logMessage('<b>Finished:</b> BFS Algorithm has completed!');
    resetBtn.disabled = false;
}

// ---------------- DFS LOGIC (LIFO Stack) ----------------
async function runDFS() {
    if (isRunning) return;
    lockControls();
    updateConceptText('DFS');

    const adjList = buildAdjacencyList();
    const stack = [];
    const startNode = getNode(startNodeSelect.value); 
    
    logMessage(`<b>Start:</b> Pushing Node ${startNode.id} to Stack.`);
    stack.push(startNode.id);
    renderDataStructureVisual(stack, 'Stack');
    
    startNode.state = 'queued';
    drawGraph();
    await sleep(getSpeed());

    while (stack.length > 0) {
        if (!isRunning) break; 

        // LIFO: Take from the END of the array
        const currentId = stack.pop();
        renderDataStructureVisual(stack, 'Stack');

        const currentNode = getNode(currentId);
        
        logMessage(`<b>Pop:</b> Node ${currentId} popped from Stack to be processed.`);
        currentNode.state = 'current';
        drawGraph();
        await sleep(getSpeed());

        let foundNeighbors = false;

        // We reverse the neighbors array so that the visual traversal goes left-to-right (alphabetical)
        const neighbors = [...adjList[currentId]].reverse();

        for (let neighborId of neighbors) {
            const neighborNode = getNode(neighborId);
            
            if (neighborNode.state === 'unvisited') {
                foundNeighbors = true;
                logMessage(`↳ Found unvisited neighbor ${neighborId}. Pushing to Stack.`);
                neighborNode.state = 'queued';
                
                stack.push(neighborId);
                renderDataStructureVisual(stack, 'Stack');
                drawGraph();
                await sleep(getSpeed() * 0.8);
            }
        }

        if(!foundNeighbors) logMessage(`↳ No unvisited neighbors for Node ${currentId}.`);

        logMessage(`<b>Complete:</b> Node ${currentId} is fully visited.`);
        currentNode.state = 'visited';
        drawGraph();
        await sleep(getSpeed() * 0.8);
    }

    logMessage('<b>Finished:</b> DFS Algorithm has completed!');
    resetBtn.disabled = false;
}

// Initialize things when the page loads
setupDropdown();
resetGraph();
