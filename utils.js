// ==========================================
// utils.js - State, Data, UI, and Canvas Logic
// ==========================================

export let nodes = [
    { id: 'A', x: 275, y: 50, state: 'unvisited', distance: Infinity, parent: null, mstLinks: [] },
    { id: 'B', x: 125, y: 150, state: 'unvisited', distance: Infinity, parent: null, mstLinks: [] },
    { id: 'C', x: 425, y: 150, state: 'unvisited', distance: Infinity, parent: null, mstLinks: [] }
];
export let edges = [
    ['A', 'B', 6], ['A', 'C', 2], ['B', 'C', 3]
];

export let isRunning = false;
export const setRunning = (val) => isRunning = val;
export const getNode = (id) => nodes.find(n => n.id === id);
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const getSpeed = () => parseInt(document.getElementById('speedControl').value, 10);

// --- GRAPH EDITOR FUNCTIONS ---
export const clearGraph = () => { nodes.length = 0; edges.length = 0; };

// BUG FIX: Smart Node Naming
export const addNode = (x, y) => {
    let newId = null;
    
    // Loop through A (65) to Z (90) to find the first unused letter
    for (let i = 0; i < 26; i++) {
        let letter = String.fromCharCode(65 + i);
        // If this letter doesn't exist in our nodes array yet, claim it!
        if (!nodes.find(n => n.id === letter)) {
            newId = letter;
            break;
        }
    }

    // Only add if we found a valid letter (keeps us under the 26 limit automatically)
    if (newId) {
        nodes.push({ id: newId, x, y, state: 'unvisited', distance: Infinity, parent: null, mstLinks: [] });
    } else {
        alert("Maximum node limit (26) reached for this sandbox!");
    }
};

export const addEdge = (u, v, weight) => {
    const exists = edges.find(e => (e[0] === u && e[1] === v) || (e[0] === v && e[1] === u));
    if (exists) exists[2] = weight; 
    else edges.push([u, v, weight]);
};

export const removeNode = (id) => {
    const nodeIndex = nodes.findIndex(n => n.id === id);
    if (nodeIndex !== -1) {
        nodes.splice(nodeIndex, 1);
    }
    
    // Remove ANY edges that were connected to this node
    for (let i = edges.length - 1; i >= 0; i--) {
        if (edges[i][0] === id || edges[i][1] === id) {
            edges.splice(i, 1);
        }
    }
};

export const resetGraphData = () => {
    nodes.forEach(n => { n.state = 'unvisited'; n.distance = Infinity; n.parent = null; n.mstLinks = []; });
    document.getElementById('logBox').innerHTML = '';
    document.getElementById('resultsWrapper').style.display = 'none';
};

// --- UI FUNCTIONS ---
export const setupDropdown = () => {
    const select = document.getElementById('startNodeSelect');
    select.innerHTML = '';
    
    // Sort nodes alphabetically so dropdown looks clean even if we add 'D' later
    const sortedNodes = [...nodes].sort((a, b) => a.id.localeCompare(b.id));
    
    sortedNodes.forEach(n => {
        const opt = document.createElement('option');
        opt.value = n.id; opt.textContent = n.id;
        select.appendChild(opt);
    });
};

export const logMessage = (msg) => {
    const box = document.getElementById('logBox');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `<span style="color: #888;">[${new Date().toLocaleTimeString([], {hour12:false})}]</span> ${msg}`;
    box.appendChild(entry);
    box.scrollTop = box.scrollHeight;
};

export const updateConceptText = (algo, titleHTML, descHTML, color) => {
    const t = document.getElementById('conceptTitle');
    t.innerHTML = titleHTML; t.style.color = color;
    document.getElementById('conceptDesc').innerHTML = descHTML;
    document.getElementById('complexityBox').style.borderLeftColor = color;
    document.getElementById('dsTitle').style.color = color;
};

export const renderDataStructureVisual = (array, type) => {
    const c = document.getElementById('dsContainer');
    document.getElementById('dsTitle').innerHTML = type;
    if(array.length===0) return c.innerHTML = `<span class="empty-ds-msg">Empty</span>`;
    c.innerHTML = array.map(item => `<div class="ds-item">${item}</div>`).join('');
};

export const displayResults = (title, htmlContent, color) => {
    document.getElementById('resultsTitle').innerHTML = title;
    document.getElementById('resultsTitle').style.color = color;
    document.getElementById('resultsContent').style.borderLeftColor = color;
    document.getElementById('resultsContent').innerHTML = htmlContent;
    document.getElementById('resultsWrapper').style.display = 'block';
};

export const lockControls = () => {
    isRunning = true;
    document.querySelectorAll('.controls button, .edit-bar input').forEach(b => b.disabled = true);
};
export const unlockControls = () => {
    isRunning = false;
    document.querySelectorAll('.controls button, .edit-bar input').forEach(b => b.disabled = false);
};

// --- CANVAS RENDERER ---
const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');

export const drawGraph = (selectedNode = null) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    edges.forEach(([id1, id2, weight]) => {
        const n1 = getNode(id1); const n2 = getNode(id2);
        if (!n1 || !n2) return;
        const isPath = (n1.parent === n2.id) || (n2.parent === n1.id) || n1.mstLinks.includes(n2.id) || n2.mstLinks.includes(n1.id);
        
        ctx.beginPath(); ctx.moveTo(n1.x, n1.y); ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = isPath ? '#32CD32' : '#ccc'; ctx.lineWidth = isPath ? 4 : 2; ctx.stroke();
        
        const midX = (n1.x + n2.x)/2; const midY = (n1.y + n2.y)/2;
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(midX, midY, 10, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#e91e63'; ctx.font = 'bold 13px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(weight, midX, midY);
    });

    nodes.forEach(node => {
        ctx.beginPath(); ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
        
        if (selectedNode && selectedNode.id === node.id) {
            ctx.fillStyle = '#fff'; ctx.strokeStyle = '#e91e63'; ctx.lineWidth = 5; 
        } else {
            ctx.lineWidth = 3;
            if (node.state === 'unvisited') { ctx.fillStyle = '#fff'; ctx.strokeStyle = '#333'; }
            else if (node.state === 'queued') { ctx.fillStyle = '#87CEFA'; ctx.strokeStyle = '#333'; }
            else if (node.state === 'current') { ctx.fillStyle = '#FFA500'; ctx.strokeStyle = '#333'; }
            else if (node.state === 'visited') { ctx.fillStyle = '#32CD32'; ctx.strokeStyle = '#111'; }
            else if (node.state === 'via') { ctx.fillStyle = '#9C27B0'; ctx.strokeStyle = '#fff'; }
        }

        ctx.fill(); ctx.stroke();
        
        ctx.fillStyle = (node.state === 'unvisited' || node.state === 'queued' || node.state === 'current' || (!selectedNode && node.state === 'unvisited')) ? '#333' : '#fff'; 
        ctx.font = 'bold 16px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; 
        ctx.fillText(node.id, node.x, node.y);
        
        if (node.distance !== Infinity && node.distance !== null) {
            ctx.fillStyle = '#e91e63'; ctx.font = 'bold 14px Arial'; ctx.fillText(`d: ${node.distance}`, node.x, node.y + 40);
        }
    });
};
