// 瀏覽器版打磚塊遊戲 - GitHub Pages 部署版 (Google Chrome Dinosaur Game 風格)
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

// 設定畫布大小，適應手機與桌面螢幕
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

document.body.style.margin = 0;
document.body.style.overflow = "hidden";
document.body.style.backgroundColor = "white";
ctx.fillStyle = "black";
ctx.strokeStyle = "black";
ctx.lineWidth = 2;

// 球拍
const paddle = {
    width: 150,
    height: 15,
    x: canvas.width / 2 - 75,
    y: canvas.height - 50,
    speed: 10,
    dx: 0
};

// 球 (降低球速以適應手機操作)
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 70,
    radius: 10,
    speed: 3,
    dx: 2,
    dy: -2
};

// 磚塊設置
const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 50;
const brickOffsetLeft = 30;

const bricks = [];
for (let row = 0; row < brickRowCount; row++) {
    bricks[row] = [];
    for (let col = 0; col < brickColumnCount; col++) {
        bricks[row][col] = {
            x: col * (brickWidth + brickPadding) + brickOffsetLeft,
            y: row * (brickHeight + brickPadding) + brickOffsetTop,
            status: 1
        };
    }
}

// 監聽鍵盤事件 (桌面版)
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") paddle.dx = paddle.speed;
    else if (e.key === "ArrowLeft") paddle.dx = -paddle.speed;
});
window.addEventListener("keyup", () => {
    paddle.dx = 0;
});

// 手機觸控支援
canvas.addEventListener("touchmove", (e) => {
    let touchX = e.touches[0].clientX;
    paddle.x = touchX - paddle.width / 2;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
    e.preventDefault();
});

// 更新遊戲邏輯
function update() {
    // 移動球拍
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;

    // 移動球
    ball.x += ball.dx;
    ball.y += ball.dy;

    // 碰撞邊界
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx *= -1;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }
    if (ball.y + ball.radius > canvas.height) {
        alert("Game Over!");
        document.location.reload();
    }

    // 球與球拍碰撞
    if (
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width &&
        ball.y + ball.radius > paddle.y
    ) {
        ball.dy *= -1;
        let diff = ball.x - (paddle.x + paddle.width / 2);
        ball.dx = diff * 0.2;
    }

    // 球與磚塊碰撞
    bricks.forEach((row) => {
        row.forEach((brick) => {
            if (brick.status === 1) {
                if (
                    ball.x > brick.x &&
                    ball.x < brick.x + brickWidth &&
                    ball.y - ball.radius < brick.y + brickHeight &&
                    ball.y + ball.radius > brick.y
                ) {
                    ball.dy *= -1;
                    brick.status = 0;
                }
            }
        });
    });
}

// 渲染畫面
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 畫磚塊（黑白風格）
    bricks.forEach((row) => {
        row.forEach((brick) => {
            if (brick.status === 1) {
                ctx.fillStyle = "black";
                ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);
                ctx.strokeRect(brick.x, brick.y, brickWidth, brickHeight);
            }
        });
    });
    
    // 畫球拍
    ctx.fillStyle = "black";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    // 畫球
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

// 遊戲循環
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
