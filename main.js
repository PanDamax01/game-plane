

let board, boardWidth = 460, boardHeight = 640, context

// zamienic na plane
let birdWidth = 124, birdHeight = 64, birdX = boardWidth/8, birdY = boardHeight/2, birdImg

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

// pipe zaminic na wiezowce
let pipeArray = []
let pipeWidth = 80, pipeHeight = 412, pipeX = boardWidth, pipeY = 0

let topPipeImg
let bottomPipeImg

//physic
let velocityX = -2
let velocityY = 0
let gravity = .4

let gameOver = false
let score = 0

window.onload = function () {
    board = document.getElementById('board')
    board.width = boardWidth
    board.height = boardHeight
    context = board.getContext('2d')

    // context.fillStyle = 'green' // zielone tlo
    // context.fillRect(bird.x, bird.y, bird.width, bird.height)

    birdImg = new Image()
    birdImg.src = 'img/plane.png'
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)
    }

    topPipeImg = new Image()
    topPipeImg.src = 'img/topSkyscraper.png'

    bottomPipeImg = new Image()
    bottomPipeImg.src = 'img/bottomSkyscraper.png'
    
    requestAnimationFrame(update)
    // placePipes()
    setInterval(placePipes, 3500)
    document.addEventListener('keydown', moveBrid)
    document.addEventListener('click', moveBrid)
}

function update() {
    requestAnimationFrame(update)
    if (gameOver) return
    context.clearRect(0, 0, board.width, board.height)

    velocityY += gravity
    bird.y = Math.max(bird.y + velocityY, 0)
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)

    if (bird.y > board.height) gameOver = true

    //.zamienisc na forecha lub cos
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i]
        pipe.x += velocityX
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height)

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += .5
            pipe.passed = true
        }

        if(detectCollision(bird, pipe))gameOver = true
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) pipeArray.shift()

    context.fillStyle = 'white'
    context.font = '45px sans-serif'
    context.fillText(score, 5, 45)

    if (gameOver) context.fillText("GAME OVER", 5, 90)
}

function placePipes() {
    if (gameOver) return
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2)
    let openingSpace = board.height/3

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe)
    
    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe)
}

function moveBrid(e) {
    // if (e.code === 'Space' || e.code === 'ArrowUp'){
        velocityY = -6
    // }

    if (gameOver) {
        bird.y = birdY
        pipeArray = []
        score = 0
        gameOver = false
    }
}

function detectCollision(a,b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
}