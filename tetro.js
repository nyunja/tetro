document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid");
    let cells = Array.from(document.querySelectorAll(".grid div"));
    const startBtn = document.querySelector("#start-button");
    let scoreDisplay = document.querySelector("#score")

    const width = 10;
    let nextRandom = 0;


    const colors = [
        'orange',
        'purple',
        'green',
        'blue',
        'pink',
    ];

    let timerId;

    const lTetrominoes = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2],
    ];

    const zTetrpminoes = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
    ];

    const tTetrominoes = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1],
    ];

    const oTetrominoes = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
    ];

    const iTetrominoes = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
    ];

    const tetrominoes = [lTetrominoes, zTetrpminoes, tTetrominoes, oTetrominoes, iTetrominoes];

    let currentPosition = 4;
    let currentRotation = 0;

    let random = Math.floor(Math.random() * tetrominoes.length);
    let currentTetromino = tetrominoes[random][currentRotation];

    function draw() {
        currentTetromino.forEach(index => {
            cells[currentPosition + index].classList.add("tetromino");
            cells[currentPosition + index].style.backgroundColor = colors[random];
        });
    }

    function undraw() {
        currentTetromino.forEach(index => {
            cells[currentPosition + index].classList.remove("tetromino");
            cells[currentPosition + index].style.backgroundColor = '';
        });
    }

    // timerId = setInterval(moveDown, 1000);

    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 38) {
            updateRotation();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }
    function updateRotation() {
        undraw();
        currentRotation++;
        if (currentRotation === currentTetromino.length) currentRotation = 0;
        currentTetromino = tetrominoes[random][currentRotation];
        draw();
    }

    document.addEventListener("keyup", control);

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    function freeze() {
        if (currentTetromino.some(index => cells[currentPosition + index + width].classList.contains("taken"))) {
            currentTetromino.forEach(index => cells[currentPosition + index].classList.add("taken"));
            random = nextRandom;
            // start dropping the next tetromino
            nextRandom = Math.floor(Math.random() * tetrominoes.length);
            currentTetromino = tetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShapes();
            addScore();
            gameOver();
        };
    }

    function moveLeft() {
        undraw();
        const isAtLeftEdge = currentTetromino.some(index => (currentPosition + index) % width === 0);

        if (!isAtLeftEdge) {
            currentPosition -= 1;
        }

        if (currentTetromino.some(index => cells[currentPosition + index + width].classList.contains("taken"))) {
            currentPosition += 1;
        }
        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = currentTetromino.some(index => (currentPosition + index) % width === width - 1);

        if (!isAtRightEdge) {
            currentPosition += 1;
        }

        if (currentTetromino.some(index => cells[currentPosition + index + width].classList.contains("taken"))) {
            currentPosition -= 1;
        }
        draw();
    }

    const displaySquares = document.querySelectorAll(".mini-grid div");
    const displayWidth = 4;
    let displayIndex = 0;

    const uNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],// zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
        [0, 1, displayWidth, displayWidth + 1], //oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
    ]
    function displayShapes() {
        displaySquares.forEach(square => {
            // remove the class tetromino from the grid
            square.classList.remove("tetromino");
            square.style.backgroundColor = '';
        });
        uNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add("tetromino");
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
        });
  
    }

    startBtn.addEventListener("click", () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom =Math.floor(Math.random() * tetrominoes.length);
            displayShapes();
        }
    });

    let score = 0;

    function addScore() {
        for (var i = 0; i < 199; i+=width) {
            let row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if (row.every(index => cells[index].classList.contains("taken"))) {
                score+= 10;
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    cells[index].classList.remove('taken');
                    cells[index].classList.remove('tetromino');
                    cells[index].style.backgroundColor= '';
                });
                let cellsRemoved = cells.splice(i,width)
                cells = cellsRemoved.concat(cells);
                cells.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    // game over function
    function gameOver() {
        if (currentTetromino.some(index => cells[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
        }
    }
});

