const gameCanvas = document.getElementById("gameCanvas")
const ctx = gameCanvas.getContext("2d")
let foodX
let foodY
let isChangingDirection

function clearCanvas(){
    ctx.fillStyle = "white"
    ctx.strokeStyle = "grey" 
    // Draw the "background" of the canvas
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    // Draw the border of the canvas
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height)
}


let snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150}
]
let score = 0
let dx = 10
let dy = 0

function drawSnake(){
    snake.forEach(drawSnakePart)
}


function drawSnakePart(snakePart){
    ctx.fillStyle = "lightgreen"
    ctx.strokeStyle = "darkgreen"
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10)
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10) 
}

function changeDirection(event){
    const LEFT_KEY = "ArrowLeft"
    const RIGHT_KEY = "ArrowRight"
    const UP_KEY = "ArrowUp"
    const DOWN_KEY = "ArrowDown"
    const keyPressed = event.key
    if (isChangingDirection) return
    isChangingDirection = true
    const goingUp = dy === -10
    const goingDown = dy === 10
    const goingRight = dx === 10
    const goingLeft = dx === -10

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10
        dy = 0
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0
        dy = -10
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10
        dy = 0
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0
        dy = 10
    }

}

function advanceSnake(){
    const head = {x: snake[0].x + dx, y: snake[0].y + dy}
    snake.unshift(head)

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY
    if(didEatFood){
        score += 10
        document.getElementById("score").innerHTML = `Score: ${score}`
        createFood()
    }else{
        snake.pop()
    }

}

function main(){
    if (didGameEnd()) {
        document.getElementById("gameOver").style.display = "block"
        return
    }

    setTimeout(function onTick() { //This main() is called repeatedly to keep the snake moving
        isChangingDirection = false
        clearCanvas()
        drawFood()
        advanceSnake()
        drawSnake()
        main()
    }, 100)
}
createFood()
main()

document.addEventListener("keydown", changeDirection)

function randomTen(min, max){
    return Math.round((Math.random() * (max - min) + min) / 10) * 10
}

function createFood() {
    foodX = randomTen(0, gameCanvas.width - 10)
    foodY = randomTen(0, gameCanvas.height - 10)
    snake.forEach(function isFoodOnSnake(part){
        const foodIsOnSnake = part.x === foodX && part.y === foodY
        if(foodIsOnSnake) {
            createFood() //if the food is on any part of the snake, create new food
        }
    })
}

function drawFood(){
    ctx.fillStyle = "red"
    ctx.strokeStyle = "darkred"
    ctx.fillRect(foodX, foodY, 10, 10)
    ctx.strokeRect(foodX, foodY, 10, 10)
}

function didGameEnd(){
    for (let i =4; i<snake.length; i++){
        const didCollide = snake[0].x === snake[i].x && snake[0].y === snake[i].y
        if(didCollide) return true
    }

    const hitLeftWall = snake[0].x < 0
    const hitRightWall = snake[0].x > gameCanvas.width - 10
    const hitTopWall = snake[0].y < 0
    const hitBottomWall = snake[0].y > gameCanvas.height - 10

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
}