console.debug("Puzzle app started!");

let map;
let userMarker;
let puzzlePieces = [];
let correctPositions = {};

document.addEventListener('DOMContentLoaded', function() {
    initMap();
    requestNotificationPermission();
    setupEventListeners();
    createPuzzleBoard();
});

function initMap() {
    map = L.map('map').setView([52.2297, 21.0122], 13);
    
    // Mapa satelitarna Esri WorldImagery
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19
    }).addTo(map);
    
    console.debug("Map initialized with satellite view");
}

function getMyLocation() {
    if (!navigator.geolocation) {
        alert('Geolokalizacja nie jest wspierana przez twoją przeglądarkę');
        return;
    }
    
    const coordsDiv = document.getElementById('coordinates');
    coordsDiv.textContent = 'Pobieranie lokalizacji...';
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            coordsDiv.textContent = `Współrzędne: ${lat.toFixed(6)}, ${lon.toFixed(6)}`;
            
            map.setView([lat, lon], 15);
            
            if (userMarker) {
                map.removeLayer(userMarker);
            }
            
            userMarker = L.marker([lat, lon]).addTo(map);
            userMarker.bindPopup('Twoja lokalizacja').openPopup();
            
            console.debug(`Location: ${lat}, ${lon}`);
        },
        function(error) {
            coordsDiv.textContent = `Błąd: ${error.message}`;
            console.error('Geolocation error:', error);
        }
    );
}

function captureMap() {
    console.debug("Capturing map...");
    
    leafletImage(map, function(err, canvas) {
        if (err) {
            console.error('Error capturing map:', err);
            alert('Błąd podczas eksportowania mapy. Spróbuj ponownie.');
            return;
        }
        
        console.debug("Map captured successfully");
        
        const targetCanvas = document.getElementById('mapCanvas');
        targetCanvas.width = 400;
        targetCanvas.height = 400;
        
        const ctx = targetCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 400, 400);
        
        console.debug("Canvas resized to 400x400");
        
        setTimeout(() => splitIntoPuzzles(targetCanvas), 100);
    });
}

function splitIntoPuzzles(sourceCanvas) {
    const pieceSize = 100; 
    const gridSize = 4; 
    puzzlePieces = [];
    
    const shuffledArea = document.getElementById('shuffledPieces');
    shuffledArea.innerHTML = '';
    
    let positions = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
        positions.push(i);
    }
    positions = shuffleArray(positions);
    
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const pieceIndex = row * gridSize + col;
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.draggable = true;
            piece.dataset.correctRow = row;
            piece.dataset.correctCol = col;
            piece.dataset.correctIndex = pieceIndex;
            
            const bgX = -col * pieceSize;
            const bgY = -row * pieceSize;
            piece.style.backgroundImage = `url(${sourceCanvas.toDataURL()})`;
            piece.style.backgroundPosition = `${bgX}px ${bgY}px`;
            
            piece.addEventListener('dragstart', handleDragStart);
            piece.addEventListener('dragend', handleDragEnd);
            
            puzzlePieces.push(piece);
            shuffledArea.appendChild(piece);
        }
    }
    
    console.debug("Puzzle pieces created:", puzzlePieces.length);
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function createPuzzleBoard() {
    const board = document.getElementById('puzzleBoard');
    board.innerHTML = '';
    
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const cell = document.createElement('div');
            cell.className = 'board-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.dataset.index = row * 4 + col;
            
            cell.addEventListener('dragover', handleDragOver);
            cell.addEventListener('drop', handleDrop);
            cell.addEventListener('dragleave', handleDragLeave);
            
            board.appendChild(cell);
        }
    }
}

let draggedPiece = null;

function handleDragStart(e) {
    draggedPiece = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    e.target.classList.add('drag-over');
    return false;
}

function handleDragLeave(e) {
    e.target.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    e.preventDefault();
    
    const cell = e.target.classList.contains('board-cell') ? e.target : e.target.closest('.board-cell');
    if (!cell) return;
    
    cell.classList.remove('drag-over');
    
    if (draggedPiece) {
        const existingPiece = cell.querySelector('.puzzle-piece');
        const oldParent = draggedPiece.parentElement;
        
        if (existingPiece) {
            oldParent.appendChild(existingPiece);
        }
        
        cell.appendChild(draggedPiece);
        
        checkPuzzleCompletion();
    }
    
    return false;
}

function checkPuzzleCompletion() {
    const cells = document.querySelectorAll('.board-cell');
    let correctCount = 0;
    let totalPieces = 0;
    
    cells.forEach(cell => {
        const piece = cell.querySelector('.puzzle-piece');
        if (piece) {
            totalPieces++;
            const correctRow = parseInt(piece.dataset.correctRow);
            const correctCol = parseInt(piece.dataset.correctCol);
            const cellRow = parseInt(cell.dataset.row);
            const cellCol = parseInt(cell.dataset.col);
            
            if (correctRow === cellRow && correctCol === cellCol) {
                cell.classList.add('correct');
                correctCount++;
            } else {
                cell.classList.remove('correct');
            }
        }
    });
    
    console.debug(`Correct pieces: ${correctCount}/${totalPieces}`);
    
    if (correctCount === 16 && totalPieces === 16) {
        console.debug("Puzzle completed!");
        showCompletionNotification();
    }
}

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            console.debug('Notification permission:', permission);
        });
    }
}

function showCompletionNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('Gratulacje! 🎉', {
            body: 'Udało Ci się ułożyć wszystkie puzzle!',
            icon: 'https://cdn-icons-png.flaticon.com/512/2666/2666505.png',
            requireInteraction: false
        });
        
        notification.onclick = function() {
            window.focus();
            notification.close();
        };
        
        setTimeout(() => notification.close(), 5000);
    } else {
        alert('Gratulacje! Ułożyłeś wszystkie puzzle! 🎉');
    }
}

function setupEventListeners() {
    document.getElementById('myLocationBtn').addEventListener('click', getMyLocation);
    document.getElementById('getMapBtn').addEventListener('click', captureMap);
}
