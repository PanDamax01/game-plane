let board, boardWidth, boardHeight, context, planeWidth, planeHeight, planeX, planeY, planeImg, plane, pipeWidth, pipeHeight, pipeX, pipeY, topPipeImg,
bottomPipeImg, velocityX, velocityY, gravity, gameOver, score

const main = () => {
	let btns = document.querySelectorAll('.btn')
    board = document.querySelector('.board')
    settings()

	btns.forEach((el) => el.addEventListener('click', () => {
			if (el.classList.contains('btn--play')) {
				setTimeout(() => {
					btns[0].style.display = 'none'
					;[btns[1], btns[2]].forEach((el) => (el.style.display = 'block'))
				}, 200)
			} else if (el.classList.contains('btn--easy')) {
				console.log('easy')
                startGame()
			} else {
				console.log('hard')
                startGame()
			}
		})
	)
}

const settings = () => {
    // settings board
    boardWidth = board.offsetWidth
    boardHeight = board.offsetHeight

    // setings plane
    planeWidth = 110, planeHeight = 34, planeX = boardWidth/8, planeY = boardHeight/2

    plane = {
    x: planeX,
    y: planeY,
    width: planeWidth,
    height: planeHeight
}

    //towers setting
    // pipe zaminic na towers
    pipeArray = []
    pipeWidth = 80, pipeHeight = 412, pipeX = boardWidth, pipeY = 0

    //physic
    velocityX = -2
    velocityY = 0
    gravity = .4

    gameOver = false
    score = 0

}


const startGame = () => {
    document.querySelector('.menu').style.display = 'none'
    board.width = boardWidth
    board.height = boardHeight
    context = board.getContext('2d')

    planeImg = new Image()
    planeImg.src = 'img/plane.png'
    planeImg.onload = function() {
        context.drawImage(planeImg, plane.x, plane.y, plane.width, plane.height)
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

    document.addEventListener('mousedown', function() {
        gravity = 0;
        velocityY = .2
    });

    document.addEventListener('mouseup', function() {
        gravity = 0.4;
    });

    document.addEventListener('touchstart', function(event) {
        event.preventDefault(); 
        gravity = 0;
        velocityY = 0.2;
    });
    
    document.addEventListener('touchend', function(e) {
        gravity = 0.4;
        velocityY = -6
    });
}

function update() {
    requestAnimationFrame(update)
    if (gameOver) return
    context.clearRect(0, 0, board.width, board.height)

    velocityY += gravity
    plane.y = Math.max(plane.y + velocityY, 0)
    context.drawImage(planeImg, plane.x, plane.y, plane.width, plane.height)

    if (plane.y > board.height) gameOver = true

    //.zamienisc na forecha lub cos
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i]
        pipe.x += velocityX
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height)

        if (!pipe.passed && plane.x > pipe.x + pipe.width) {
            score += .5
            pipe.passed = true
        }

        if(detectCollision(plane, pipe))gameOver = true
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
    if (e.type === 'click' || e.code === 'Space' || e.code === 'ArrowUp') {
        velocityY = -6
    }

    if (gameOver) {
        plane.y = planeY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}

function detectCollision(a,b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
}

document.addEventListener('DOMContentLoaded', main)