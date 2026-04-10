const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const logBox = document.getElementById('logBox');
const queueContainer = document.getElementById('queueContainer');

// New elements for the features
const startNodeSelect = document.getElementById('startNodeSelect');
const speedControl = document.getElementById('speedControl');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to get current speed from the slider
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

// Populate the dropdown menu once when the script loads
function setupDropdown() {
    startNodeSelect.innerHTML = '';
    initialNodes.forEach(node => {
        const option = document.createElement('option');
        option.value = node.id;
        option.textContent = node.id;
        startNodeSelect.appendChild(option);
    });
}

function logMessage(msg) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    const time = new Date().toLocaleTimeString([], { hour12: false });
    entry.innerHTML = `<span style="color: #888;">[${time}]</span> ${msg}`;
    logBox.appendChild(entry);
    logBox.scrollTop = logBox.scrollHeight;
}

function renderQueueVisual(queueArray) {
    queueContainer.innerHTML = ''; 
    
    if (queueArray.length === 0) {
        queueContainer.innerHTML = '<span class="empty-queue-msg">Queue is empty</span>';
        return;
    }

    queueArray.forEach(nodeId => {
        const item = document.createElement('div');
        item.className = 'queue-item';
        item.textContent = nodeId;
        queueContainer.appendChild(item);
    });
}

function resetGraph() {
    nodes = initialNodes.map(node => ({ ...node, state: 'unvisited' }));
    isRunning = false;
    startBtn.disabled = false;
    startNodeSelect.disabled = false; // Allow changing start node again
    logBox.innerHTML = ''; 
    renderQueueVisual([]); 
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

async function runBFS() {
    if (isRunning) return;
    isRunning = true;
    startBtn.disabled = true;
    resetBtn.disabled = true; 
    startNodeSelect.disabled = true; // Lock dropdown while running
    logBox.innerHTML = '';

    const adjList = {};
    nodes.forEach(n => adjList[n.id] = []);
    edges.forEach(([u, v]) => {
        adjList[u].push(v);
        adjList[v].push(u);
    });

    const queue = [];
    
    // CHANGE 1: Get the starting node from the dropdown
    const selectedId = startNodeSelect.value;
    const startNode = getNode(selectedId); 
    
    logMessage(`<b>Start:</b> Pushing Node ${startNode.id} to Queue.`);
    
    queue.push(startNode.id);
    renderQueueVisual(queue);
    
    startNode.state = 'queued';
    drawGraph();
    
    // CHANGE 2: Use getSpeed() for dynamic animation speed
    await sleep(getSpeed());

    while (queue.length > 0) {
        if (!isRunning) break; 

        const currentId = queue.shift();
        renderQueueVisual(queue);

        const currentNode = getNode(currentId);
        
        logMessage(`<b>Dequeue:</b> Node ${currentId} popped from Queue to be processed.`);
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
                renderQueueVisual(queue);
                
                drawGraph();
                
                // Adjusting speed slightly for sub-steps so it doesn't take forever
                await sleep(getSpeed() * 0.8);
            }
        }

        if(!foundNeighbors) {
            logMessage(`↳ No unvisited neighbors for Node ${currentId}.`);
        }

        logMessage(`<b>Complete:</b> Node ${currentId} is fully visited.`);
        currentNode.state = 'visited';
        drawGraph();
        await sleep(getSpeed() * 0.8);
    }

    logMessage('<b>Finished:</b> BFS Algorithm has completed!');
    resetBtn.disabled = false;
}

// Initialize things when the page loads
setupDropdown();
resetGraph();

