const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const height = canvas.height = window.innerHeight;
const width = canvas.width = window.innerWidth;

const para__sq = document.querySelector('#square');
const para__cl = document.querySelector('#circle');
const circleEatMusic = document.querySelector('#eatBall1');
const squareEatMusic = document.querySelector('#eatBall2');

const winnerWindow = document.querySelector('.winner');
const winnerCongraduation = document.querySelector('#winnerName');
const winnerImg = document.querySelector('.winner__img');

const readyOne = document.querySelector('#ready1');
const readyTwo = document.querySelector('#ready2');
const startBtn = document.querySelector('.start__btn');
const startWindow = document.querySelector('.greetings');

const volumeBtn = document.querySelector('.volume__btn');
const volumeImg = document.querySelector('#img__vol');
const gameMusic = document.querySelector('#playSound');

const countOfBalls = random(10, 20);
const balls = [];

const score = {
    scoreCount: {
        circle: 0,
        square: 0,
        allBalls: 0
    },
    setAllBalls(count){
        this.scoreCount.allBalls = count;
    },
    squareEated(){
        this.scoreCount.allBalls--;
        this.scoreCount.square++;
    },
    circleEated(){
        this.scoreCount.allBalls--;
        this.scoreCount.circle++;
    },
}

score.setAllBalls(countOfBalls)

class Shape {
    constructor(x, y, velX, velY, exist){
        this.x = x,
        this.y = y,
        this.velX = velX,
        this.velY = velY,
        this.exist = exist
    }
}

class Ball extends Shape{
    constructor(x, y, velX, velY, exist, color, size){
        super(x, y, velX, velY, exist)
        this.color = color,
        this.size = size
    }
    
    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    update () {
        if ((this.x + this.size) >= width) {
            this.velX = -(this.velX);
        } else if ((this.x - this.size) <= 0) {
            this.velX = -(this.velX);
        } else if ((this.y + this.size) >= height) {
            this.velY = -(this.velY);
        } else if ((this.y - this.size) <= 0) {
            this.velY = -(this.velY);
        }
    
        this.x += this.velX;
        this.y += this.velY;
    }
}

Ball.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            let dx = this.x - balls[j].x;
            let dy = this.y - balls[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size && balls[j].exist) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
            }
        }
    }
}

class EvilFigure extends Shape{
    constructor(x, y, exist){
        super(x, y, 20, 20, exist)
        this.color = 'white'
    }
    dontOutOnWindow() {
        if ((this.x + this.size) >= width) {
            this.x -= this.size;
        } else if ((this.x - this.size) <= 0) {
            this.x += this.size;
        } else if ((this.y + this.size) >= height) {
            this.y -= this.size;
        } else if ((this.y - this.size) <= 0) {
            this.y += this.size;
        }
    }
}

class EvilSquare extends EvilFigure {
    constructor(x, y, exist){
        super(x, y, exist)
        this.size = 17
    }

    draw () {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.strokeRect(this.x, this.y, this.size, this.size);
        ctx.fill();
    }
}

EvilSquare.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (balls[j].exist) {
            let dx = this.x - balls[j].x;
            let dy = this.y - balls[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].exist = false;
                this.size += 1;
                this.velX += 0.8;
                this.velY += 0.8;
                score.squareEated();

                showCounter(para__sq, player2Name, score.scoreCount.square)
                eatBallSound(squareEatMusic)

                if (score.scoreCount.allBalls === 0) {
                    checkPlayersWin();
                }
            }
        }
    }
}

class EvilCircle extends EvilFigure{
    constructor(x, y, exist){
        super(x, y, exist)
        this.size = 10
    }

    draw () {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
    }

}

EvilCircle.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (balls[j].exist) {
            let dx = this.x - balls[j].x;
            let dy = this.y - balls[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].exist = false;
                this.size += 0.6;
                this.velX += 0.8;
                this.velY += 0.8;
                score.circleEated();

                showCounter(para__cl, player1Name, score.scoreCount.circle)
                eatBallSound(circleEatMusic)
                
                if (score.scoreCount.allBalls === 0) {
                    checkPlayersWin();
                }
            }
        }
    }
}

const evilCircle = new EvilCircle(
    random(0, width), 
    random(0, height), 
    true
);

const evilSquare = new EvilSquare(
    random(0, width), 
    random(0, height), 
    true
);








function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function figuresMoves() {
    let figures = document.querySelectorAll('.figure__move');
    for (let i = 0; i < figures.length; i++) {
        let figure = figures[i];
        setInterval(function () {
            figure.classList.toggle('move');
        }, 800);
    }
}
figuresMoves();

function listenRetryBtn(){
    const retryBtn = document.querySelector('.winner__retry')

    retryBtn.addEventListener('click', function (event) {
        event.preventDefault();
        location.reload();
    })
}
listenRetryBtn()

function listenStartBtn(){
    startBtn.addEventListener('click', function (event) {
        startWindow.classList.add('start');
        if (!(volumeBtn.classList.contains('mute'))) {
            playMusic();
        };
        namePlayers();
        loop();
        event.preventDefault();
    });
}
listenStartBtn()

function listenReadyBtn(){
    readyOne.addEventListener('click', readyPlayer);
    readyTwo.addEventListener('click', readyPlayer);
}
listenReadyBtn()

function readyPlayer(event) {
    this.classList.toggle('active');
    const inputName = this.parentNode.querySelector('.player__input');

    if (this.classList.contains('active')) {
        inputName.setAttribute('readonly', 'readonly');
    } else {
        inputName.removeAttribute('readonly');
    }
    toggleBlockedStartBtn();
    event.preventDefault();
}

function toggleBlockedStartBtn() {
    if ((readyOne.classList.contains('active')) && (readyTwo.classList.contains('active'))) {
        startBtn.removeAttribute('disabled');
    } else {
        startBtn.setAttribute('disabled', 'disabled');
    }
}

function volumeBtnActivate(){
    const srcInVolBtn = {
        on: 'img/images__vol/volumeOn.svg',
        off: 'img/images__vol/volumeOff.svg'
    }
    
    volumeBtn.addEventListener('click', function(){
        this.classList.toggle('mute');
        if (volumeBtn.classList.contains('mute')) {
            volumeImg.setAttribute('src', srcInVolBtn.off)
        } else {
            volumeImg.setAttribute('src', srcInVolBtn.on)
        }
    })
}
volumeBtnActivate()

function playMusic() {
    gameMusic.play();
    gameMusic.volume = 0.1;
    gameMusic.addEventListener('ended', function () {
        this.play();
    })
}

function namePlayers() {
    const playersNames = document.querySelectorAll('.player__input');
    for (let i = 0; i < playersNames.length; i++) {
        player1Name = playersNames[0].value;
        player2Name = playersNames[1].value;
    };
};


function checkPlayersWin() {
    whoWinner(score.scoreCount.square, player2Name, 'square');
    whoWinner(score.scoreCount.circle, player1Name, 'circle');
}

function whoWinner(count, playerName, figure) {
    winnerWindow.classList.add('active');
    if (count > ( countOfBalls / 2)) {
        winner(playerName, figure);
    } else if (count === (countOfBalls / 2)) {
        draw();
        return
    } else {
        return false
    }
}

function winner(nameWinner, figure) {
    winnerCongraduation.textContent = `${nameWinner}`;
    winnerImg.classList.add(figure);
}

function draw() {
    winnerCongraduation.textContent = `${player1Name} and ${player2Name}`;
    document.querySelector('.winneris').textContent = 'DRAW!!!';
    document.querySelector('.nicegame').textContent = 'nice game!!!';
}

function eatBallSound(sound) {
    sound.play();
    sound.volume = 0.2;
}

function setControl() {
    window.onkeydown = function (e) {
        let eC = evilCircle;
        let eS = evilSquare;
        if (e.keyCode === 65) {
            eC.x -= eC.velX;
        } else if (e.keyCode === 68) {
            eC.x += eC.velX;
        } else if (e.keyCode === 87) {
            eC.y -= eC.velY;
        } else if (e.keyCode === 83) {
            eC.y += eC.velY;
        } else if (event.keyCode === 74) {
            eS.x -= eS.velX;
        } else if (event.keyCode === 76) {
            eS.x += eS.velX;
        } else if (event.keyCode === 73) {
            eS.y -= eS.velY;
        } else if (event.keyCode === 75) {
            eS.y += eS.velY;
        }
    }
}

function showCounter(place, name, count) {
    if (name === '') {
        place.textContent = `${place === para__sq ? 'Square' : 'Circle'}: ${count} !`;
    }else{
        place.textContent = `${name}: ${count}!`;
    }
}

function createBalls(){
    while (balls.length < countOfBalls) {
        const size = random(10, 20);
        const randomColor = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
        let ball = new Ball(
            random(0 + size, width - size),
            random(0 + size, height - size),
            random(-7, 7),
            random(-7, 7),
            true,
            randomColor,
            size
        )
        balls.push(ball);
    }
}

function renderBalls(){
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exist) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }
}

function renderEvilFigures(){
    evilSquare.draw();
    evilSquare.dontOutOnWindow();
    evilSquare.collisionDetect();
    evilCircle.draw();
    evilCircle.dontOutOnWindow();
    evilCircle.collisionDetect();
}

function loop(){
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    renderBalls();
    renderEvilFigures();
    requestAnimationFrame(loop);
}

createBalls();
setControl();
loop();