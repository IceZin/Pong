class Board {
    constructor(ctx) {
        this.ctx = ctx;
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
    }

    circle (x, y, radius) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 25, 0, Math.PI * 2);
    }

    rect (x, y, w, h) {
        this.ctx.beginPath();
        this.ctx.rect(x, y, w, h);
    }

    fill (color) {
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }

    clear () {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    draw () {
        this.ctx.stroke();
    }
}

class Game {
    constructor(ctx) {
        this.board = new Board(ctx);
        this.scores = document.querySelectorAll(".score");

        this.scores.forEach(score => {
            score.innerHTML = "0";
        })

        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this.ballRadius = 20;

        this.rectH = 200;
        this.rectW = 20;

        this.ballX = Math.round(this.width / 2);
        this.ballY = Math.round(Math.random() * (this.height - (this.ballRadius * 4))) + this.ballRadius * 2;

        this.velocityX = 2;
        this.velocityY = 2;

        this.directionX = Math.round(Math.random() * 2) - 1;
        this.directionY = Math.round(Math.random() * 2) - 1;

        while (this.directionX == 0) this.directionX = Math.round(Math.random() * 2) - 1;
        while (this.directionY == 0) this.directionY = Math.round(Math.random() * 2) - 1;

        this.playersXPos = [20, this.width - 40];
        this.playersYPos = [this.height / 2, this.height / 2];

        this.playerYDirection = 0;

        this.points = [0, 0];

        this.lasthit = undefined;

        document.addEventListener("keydown", this.keydown.bind(this));

        document.addEventListener("keyup", this.keyup.bind(this));
    }

    keydown (e) {
        if (e.key == "ArrowDown") {
            this.playerYDirection = 4;
        } else if (e.key == "ArrowUp") {
            this.playerYDirection = -4;
        }
    }

    keyup (e) {
        if (e.key == "ArrowDown" || e.key == "ArrowUp") {
            this.playerYDirection = 0;
        }
    }

    reset () {
        this.ballX = Math.round(this.width / 2);
        this.ballY = Math.round(Math.random() * (this.height - (this.ballRadius * 4))) + this.ballRadius * 2;
        this.playersYPos = [this.height / 2, this.height / 2];

        this.directionX = Math.round(Math.random() * 2) - 1;
        this.directionY = Math.round(Math.random() * 2) - 1;

        while (this.directionX == 0) this.directionX = Math.round(Math.random() * 2) - 1;
        while (this.directionY == 0) this.directionY = Math.round(Math.random() * 2) - 1;

        this.lasthit = undefined;
    }

    stop () {
        this.board.clear();

        document.removeEventListener("keydown", this.keydown, true);
        document.removeEventListener("keyup", this.keyup, true);
    }

    render () {
        this.board.clear();

        this.board.circle(this.ballX, this.ballY, this.ballRadius)
        this.board.fill("#FFFFFF")

        for (let i = 0; i < 2; i++) {
            if (i == 0) this.playerControl();
            else this.botControl();

            this.board.rect(this.playersXPos[i], this.playersYPos[i] - this.rectH / 2, this.rectW, this.rectH);
            this.board.fill("#FFFFFF");
        }

        this.board.draw()
    }

    botControl () {
        if (this.ballY > this.playersYPos[1] && this.playersYPos[1] + this.rectH / 2 < this.height) {
            this.playersYPos[1] += this.velocityY - 0.3;
        } else if (this.ballY < this.playersYPos[1] && this.playersYPos[1] - this.rectH / 2 > 0) {
            this.playersYPos[1] -= this.velocityY - 0.3;
        }
    }

    playerControl() {
        if (this.playerYDirection > 0 && this.playersYPos[0] + this.rectH / 2 > this.height) return;
        if (this.playerYDirection < 0 && this.playersYPos[0] - this.rectH / 2 < 0) return;

        this.playersYPos[0] += this.playerYDirection;
    }

    checkHit () {
        for (let i = 0; i < 2; i++) {
            if (this.ballX - this.ballRadius < this.playersXPos[i] + this.rectW && this.ballX + this.ballRadius > this.playersXPos[i]) {
                if (this.ballY > this.playersYPos[i] - this.rectH / 2 && this.ballY < this.playersYPos[i] + this.rectH / 2) {
                    if (this.lasthit == i) break;

                    this.directionX *= -1;
                    this.lasthit = i;
                } else {
                    continue
                }
            } else {
                continue
            }
        }
    }

    process () {
        this.ballX += this.velocityX * this.directionX;
        this.ballY += this.velocityY * this.directionY;

        this.checkHit();

        if (this.ballX + this.ballRadius > this.width || this.ballX - this.ballRadius < 0) {
            if (this.directionX == 1) {
                this.points[0] += 1
                this.scores[0].innerHTML = this.points[0];
            } else {
                this.points[1] += 1
                this.scores[1].innerHTML = this.points[1];
            }

            this.reset();
        }

        if (this.ballY + this.ballRadius > this.height || this.ballY - this.ballRadius < 0) this.directionY *= -1;

        this.render()
    }
}