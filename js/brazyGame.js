//gets the canvas so we can modidy it
var canvas = document.getElementById("myCanvas");
//how to actualy do graphics with the canvas
var ctx = canvas.getContext("2d");

var score = 0;
var lives = 3;

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

//ball props
var x = canvas.width/2;
var y = canvas.height-30;
var ballRadius = 10;

//paddle props
var paddleHeight = 10;
var paddleWidth = 125;
var paddleX = (canvas.width-paddleWidth)/2;

//control info
var rightPressed = false;
var leftPressed = false;

//brick info
var brickRowCount = 3;
var brickColumnCount = 9;
var brickWidth = canvas.width/(brickColumnCount+1);
var brickHeight = 20;
var brickPadding = brickWidth/(brickColumnCount+1);
var brickOffsetTop = 30;
var brickOffsetLeft = brickPadding;

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX - paddleWidth/2 > 0 && relativeX- paddleHeight < canvas.width- paddleWidth/2) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}
//control end
function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
      for(var r=0; r<brickRowCount; r++) {
        var b = bricks[c][r];
        if(b.status == 1) {
          if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
            dy = -dy;
            b.status = 0;
            ++score;
            if(score >= brickRowCount*brickColumnCount) {
                alert("YOU WIN, CONGRATULATIONS!");
                document.location.reload();
                clearInterval(interval); // Needed for Chrome to end game
            }
          }
        }
      }
    }
}
  

var dx = 2;
var dy = -2;

var orgdx = dx;
var orgdy = dy;


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
  
//game util
function drawBall(){
    //makes a circle
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
      for(var r=0; r<brickRowCount; r++) {
        if(bricks[c][r].status == 1) {
          var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
          var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

//main event 
function draw() {
    //deletes the rect before drawing it to prevent the lineness
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    x += dx;
    y += dy;

    if(y + dy < ballRadius) {
        dy = -dy;

    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            ctx.fillStyle = getRandomColor();
            dy = -dy;
            dy = 1.05*dy;
            dx = 1.05*dx;
        }
        else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
                clearInterval(interval); // Needed for Chrome to end game
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30 ;
                dx = orgdx;
                dy = orgdy;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    requestAnimationFrame(draw);
}

//event loop
//calls draw every 10 milliseconds
draw();



// //makes a red rectangle
// ctx.beginPath();
// ctx.rect(20, 40, 50, 50);
// ctx.fillStyle = '#FF0000';
// ctx.fill();
// ctx.closePath();

// //makes a green circle
// ctx.beginPath();
// ctx.arc(240, 160, 20, 0, Math.PI*2, false);
// ctx.fillStyle = "green";
// ctx.fill();
// ctx.closePath();

// //makes a hollow blue rect
// ctx.beginPath();
// ctx.rect(160, 10, 100, 40);
// ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
// ctx.stroke();
// ctx.closePath();