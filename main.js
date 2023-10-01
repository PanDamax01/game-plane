let board, boardWidth, boardHeight, context, planeWidth, planeHeight, planeX, planeY, planeImg, plane, towersWidth, towersHeight, towersX, towersY, toptowersImg, bottomtowersImg, velocityX, velocityY, gravity, gameOver, score, setVelocityY, spanScore, explosion, gameOverSpan, explosionSound, explosionSoundPeople

const main = () => {
	let btns = document.querySelectorAll('.btn')
    board = document.querySelector('.board')
    spanScore = document.querySelector('.score')
    explosion = document.querySelector('.explosion')
    gameOverSpan = document.querySelector('.game-over')
    settings()

	btns.forEach((el) => el.addEventListener('click', () => {
			if (el.classList.contains('btn--play')) {
				setTimeout(() => {
					btns[0].style.display = 'none'
					;[btns[1], btns[2]].forEach((el) => (el.style.display = 'block'))
				}, 200)
			} else if (el.classList.contains('btn--easy')) {
                setVelocityY = 0
                startGame()
			} else {
                startGame()
                setVelocityY = .6
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
    towersArray = []
    towersWidth = 80, towersHeight = 512, towersX = boardWidth, towersY = 0

    //physic
    velocityX = -2
    velocityY = 0
    gravity = .4
    setRepeat = 3500

    gameOver = false
    score = 0

    explosionSound = new Audio('./explosion-ground.wav')
    explosionSoundPeople = new Audio('./explosion-people.wav')

}

const startGame = () => {
    // window.onload = function () {
    // setVelocityY = 0

    document.querySelector('.menu').style.display = 'none'
    board.width = boardWidth
    board.height = boardHeight
    context = board.getContext('2d')

    planeImg = new Image()
    planeImg.src = 'img/plane.png'
    planeImg.onload = function() {
        context.drawImage(planeImg, plane.x, plane.y, plane.width, plane.height)
    }

    toptowersImg = new Image()
    toptowersImg.src = 'img/topSkyscraper.png'

    bottomtowersImg = new Image()
    bottomtowersImg.src = 'img/bottomSkyscraper.png'

    requestAnimationFrame(update)
    placetowerss()
    setInterval(placetowerss, setRepeat)
    document.addEventListener('keydown', movePlane)
    board.addEventListener('click', movePlane)

    board.addEventListener('mousedown', () => {
        gravity = 0
        velocityY = setVelocityY
    })
    board.addEventListener('mouseup', () => {
        gravity = 0.4
    })

    board.addEventListener('touchstart', () => {
        gravity = 0;
        velocityY = setVelocityY
    })
    board.addEventListener('touchend', () => {
        gravity = 0.4
        velocityY = -6
    })
    gameOverSpan.addEventListener('click', e => {
        movePlane(e)
    })

    explosion.addEventListener('click', e => {
        movePlane(e)
    })
}

function update() {
    requestAnimationFrame(update)
    if (gameOver) return
    context.clearRect(0, 0, board.width, board.height)

    velocityY += gravity
    plane.y = Math.max(plane.y + velocityY, 0)
    context.drawImage(planeImg, plane.x, plane.y, plane.width, plane.height)

    if (plane.y > board.height){
        gameOver = true
        explosion.style.display = 'block'
        explosion.setAttribute('src', './img/fall-plane.gif')
        gameOverSpan.style.display = 'block'
        explosionSound.play() // odhaczyć

        setTimeout(() => {
            explosion.style.display = 'none'
        }, 3400);
    }

    for (let i = 0; i < towersArray.length; i++) {
        let towers = towersArray[i]
        towers.x += velocityX
        context.drawImage(towers.img, towers.x, towers.y, towers.width, towers.height)

        if (!towers.passed && plane.x > towers.x + towers.width) {
            score += .5
            spanScore.textContent = score
            towers.passed = true

            if (score === 7) {
                velocityX = -3
                setRepeat = 3000
            } else if(score === 14){
                setInterval(placetowerss, setRepeat*4)
            } else if(score === 20){
                velocityX = -5
            }
        }

        if(detectCollision(plane, towers)){
            gameOver = true
            explosion.setAttribute('src', './img/explosion.gif')
            explosion.style.display = 'block'
            explosionSoundPeople.play()

            setTimeout(() => {
                explosion.style.display = 'none'
                gameOver ? gameOverSpan.style.display = 'block' : null
            }, 600); 
        }
    }

    while (towersArray.length > 0 && towersArray[0].x < -towersWidth) towersArray.shift()
}

function placetowerss() {
    if (gameOver) return
    let randomtowersY = towersY - towersHeight/4 - Math.random()*(towersHeight/2)
    let openingSpace = board.height/3
    
    let toptowers = {
        img: toptowersImg,
        x: towersX,
        y: randomtowersY,
        width: towersWidth,
        height: towersHeight,
        passed: false
    }
    towersArray.push(toptowers)

    let bottomtowers = {
        img: bottomtowersImg,
        x: towersX,
        y: randomtowersY + towersHeight + openingSpace,
        width: towersWidth,
        height: towersHeight,
        passed: false
    }
    towersArray.push(bottomtowers)
}

function movePlane(e) {
    if (e.type === 'click' || e.key === 'Space' || e.code === 'ArrowUp') {
        velocityY = -6
    }

    if (gameOver) {
        towersArray = []
        score = 0
        gravity = 0.4
        gameOver = false
        plane.y = planeY
        spanScore.textContent = score
        gameOverSpan.style.display = 'none'
        explosion.style.display = 'none'
        explosionSound.pause()
        explosionSound.currentTime = 0
        explosionSoundPeople.pause()
        explosionSoundPeople.currentTime = 0
    }
}

function detectCollision(a,b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
}

document.addEventListener('DOMContentLoaded', main)