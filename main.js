// ==========================================
// main.js - Event Listeners & Graph Editor
// ==========================================
import * as utils from './utils.js';
import * as algos from './algorithms.js';

// --- INITIALIZATION ---
window.onload = () => {
    utils.setupDropdown();
    utils.drawGraph();
};

// --- BUTTON EVENT LISTENERS ---
document.getElementById('startBfsBtn').addEventListener('click', () => {
    utils.resetGraphData(); utils.drawGraph();
    algos.runBFS(document.getElementById('startNodeSelect').value);
});

document.getElementById('startDfsBtn').addEventListener('click', () => {
    utils.resetGraphData(); utils.drawGraph();
    algos.runDFS(document.getElementById('startNodeSelect').value);
});

document.getElementById('startDijkstraBtn').addEventListener('click', () => {
    utils.resetGraphData(); utils.drawGraph();
    algos.runDijkstra(document.getElementById('startNodeSelect').value);
});

document.getElementById('startFloydBtn').addEventListener('click', () => {
    utils.resetGraphData(); utils.drawGraph();
    algos.runFloydWarshall();
});

document.getElementById('startPrimsBtn').addEventListener('click', () => {
    utils.resetGraphData(); utils.drawGraph();
    algos.runPrims(document.getElementById('startNodeSelect').value);
});

document.getElementById('startKruskalBtn').addEventListener('click', () => {
    utils.resetGraphData(); utils.drawGraph();
    algos.runKruskal();
});

document.getElementById('resetBtn').addEventListener('click', () => {
    utils.resetGraphData();
    utils.unlockControls();
    utils.drawGraph();
});

document.getElementById('clearBtn').addEventListener('click', () => {
    utils.clearGraph();
    utils.resetGraphData();
    utils.setupDropdown();
    utils.drawGraph();
});

// --- USER INPUT GRAPH EDITOR LOGIC ---
const modeRun = document.getElementById('modeRun');
const modeEdit = document.getElementById('modeEdit');
const modeDelete = document.getElementById('modeDelete');
const editHint = document.getElementById('editHint');
const canvas = document.getElementById('graphCanvas');

let selectedNodeForEdge = null; 

// Toggle Hint visibility based on mode
document.querySelectorAll('input[name="appMode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        utils.resetGraphData(); 
        selectedNodeForEdge = null;

        if (e.target.value === 'edit') {
            editHint.innerHTML = '<i>Tap empty space to add a Node. Tap two Nodes to connect them!</i>';
            editHint.style.color = '#E91E63';
            editHint.style.display = 'block';
        } else if (e.target.value === 'delete') {
            editHint.innerHTML = '<i>Tap any Node to delete it!</i>';
            editHint.style.color = '#f44336'; 
            editHint.style.display = 'block';
        } else {
            editHint.style.display = 'none';
        }
        utils.drawGraph();
    });
});

// PERFORMANCE FIX: Use 'pointerdown' instead of 'mousedown' for instant mobile touch support
canvas.addEventListener('pointerdown', (e) => {
    if (modeRun.checked) return;

    // Prevent screen scrolling when tapping the canvas
    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    
    // ACCURACY FIX: Calculate the exact scale ratio between CSS size and internal Canvas size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Apply the scale to the mouse/touch coordinates
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Check if user tapped an existing node (hitbox radius of 25)
    const clickedNode = utils.nodes.find(n => Math.hypot(n.x - clickX, n.y - clickY) < 25);

    // --- DELETE MODE ---
    if (modeDelete.checked) {
        if (clickedNode) {
            utils.removeNode(clickedNode.id); // Vaporize the node!
            utils.setupDropdown();            // Update the dropdown menu
            utils.drawGraph();                // Redraw instantly
        }
        return; 
    }

    // --- EDIT MODE ---
    if (clickedNode) {
        if (!selectedNodeForEdge) {
            selectedNodeForEdge = clickedNode;
        } else {
            if (selectedNodeForEdge.id !== clickedNode.id) {
                let weight = prompt(`Enter edge weight between ${selectedNodeForEdge.id} and ${clickedNode.id}:`, "1");
                weight = parseInt(weight, 10);
                
                if (!isNaN(weight) && weight > 0) {
                    utils.addEdge(selectedNodeForEdge.id, clickedNode.id, weight);
                } else if (weight !== null) {
                    alert("Please enter a valid positive number for the weight!");
                }
            }
            selectedNodeForEdge = null;
        }
    } else {
        if(utils.nodes.length < 26) {
            utils.addNode(clickX, clickY);
            utils.setupDropdown();
        } else {
            alert("Maximum node limit reached for this sandbox!");
        }
        selectedNodeForEdge = null; 
    }

    // Use requestAnimationFrame for smoother high-performance drawing
    requestAnimationFrame(() => {
        utils.drawGraph(selectedNodeForEdge);
    });
});
