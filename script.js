const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const para__sq = document.querySelector('#square');
const para__cl = document.querySelector('#circle');
let count__sq = 0;
let count__cl = 0;

let quanityBalls = random(10, 50);
let count__all = quanityBalls;

let player1Name;
let player2Name;

height = canvas.height = window.innerHeight;
width = canvas.width = window.innerWidth;

//-------------------------------Переключения кнопок 'Ready' и старт игры---------------------------
let readyOne = document.querySelector('#ready1');
let readyTwo = document.querySelector('#ready2');
let startBtn = document.querySelector('.start__btn');
let startWindow = document.querySelector('.greetings');

//События нажатия кнопок 'Ready'
readyOne.addEventListener('click', readyPlayer);
readyTwo.addEventListener('click', readyPlayer);

//Функция, блокирующая поле ввода имени при нажатии кнопки 'Ready'
function readyPlayer(event) {
    this.classList.toggle('active');
    let inputName = this.parentNode.querySelector('.player__input');

    if (this.classList.contains('active')) {
        inputName.setAttribute('readonly', 'readonly');
    } else {
        inputName.removeAttribute('readonly');
    }
    checkActive();
    event.preventDefault();
}

//Блокирование и разблокирование кнопки 'Start game'
function checkActive() {
    if ((readyOne.classList.contains('active')) && (readyTwo.classList.contains('active'))) {
        startBtn.removeAttribute('disabled');
    } else {
        startBtn.setAttribute('disabled', 'disabled');
    }
}

//------------------------Кнопка музыки-----------------------
const volumeBtn = document.querySelector('.volume__btn');
let imgVol = document.querySelector('#img__vol');
let imgMut = document.createElement('img');

imgMut.src = 'images__vol/volumeOff.svg';

volumeBtn.addEventListener('click', function () {
    this.classList.toggle('active');
    if (volumeBtn.classList.contains('active')) {
        volumeBtn.removeChild(imgVol);
        volumeBtn.appendChild(imgMut);
    } else {
        volumeBtn.removeChild(imgMut);
        volumeBtn.appendChild(imgVol);
    }
});

//------------------------Музыка-----------------------------
//Когда игра началась
const gameMusic = document.querySelector('#playSound');

function playMusic() {
    gameMusic.play();
    gameMusic.volume = 0.1;
    gameMusic.addEventListener('ended', function () {
        this.play();
    })
}
//Когда шар сьеден
function eatBallSound(sound) {
    sound.play();
    sound.volume = 0.2;
}

//-------------------Анимация фигур в окне старта и победы--------------------

//!!!!!!!! Исправить-----обнулить интервал при скрытии окна (для производительности)
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

//-----------------------Старт игры-------------------------------
//Клик Start game
startBtn.addEventListener('click', function (event) {
    startWindow.classList.add('start');
    if (!(volumeBtn.classList.contains('active'))) {
        playMusic();
    };
    namePlayers();
    loop();
    event.preventDefault();
});

//Функция, которая узнает имена игроков
function namePlayers() {
    let playersNames = document.querySelectorAll('.player__input');
    for (let i = 0; i < playersNames.length; i++) {
        player1Name = playersNames[0].value;
        player2Name = playersNames[1].value;
    };
};
//------------------------Конец игры----------------
//Повтор игры

let retryBtn = document.querySelector('.winner__retry')

retryBtn.addEventListener('click', function (event) {
    event.preventDefault();
    location.reload();
})

//--------------------Функция случайный номер----------------------------

function random(min, max) {
    num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

//---------------------------Функция, которая не позволяет фигуре выходить за пределы экрана--------------------

function checkBoundsForPrototypes() {
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

//---------------------Конструкторы для шаров-------------------------------

function Ball(x, y, velX, velY, exist, color, size) {
    Shape.call(this, x, y, velX, velY, exist);
    this.color = color,
        this.size = size
}

function Shape(x, y, velX, velY, exist) {
    this.x = x,
        this.y = y,
        this.velX = velX,
        this.velY = velY,
        this.exist = exist
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

//----------------------Конструктор злого круга--------------------------

function EvilCircle(x, y, exist) {
    Shape.call(this, x, y, 20, 20, exist);
    this.color = 'white';
    this.size = 10;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

//-------------------Конструктор злого квадрата---------------------

function EvilSquare(x, y, exist) {
    Shape.call(this, x, y, 20, 20, exist);
    this.color = 'white';
    this.size = 17;
}

EvilSquare.prototype = Object.create(Shape.prototype);
EvilSquare.prototype.constructor = EvilSquare;

// ------------------Функции злого квадрата------------------------

//Функция, которая рисует фигуру
EvilSquare.prototype.draw = function () {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.strokeRect(this.x, this.y, this.size, this.size);
    ctx.fill();
}

//Установка в прототип функции, которая не позволяет фигуре выходить за экран
EvilSquare.prototype.checkBounds = checkBoundsForPrototypes;

//Функция сьедания кружков квадратом
EvilSquare.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {

        if (balls[j].exist) {
            let dx = this.x - balls[j].x;
            let dy = this.y - balls[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].exist = false;

                count__sq++;
                count__all--;
                this.size += 1;
                this.velX += 0.8;
                this.velY += 0.8;
                counter(para__sq, player2Name, count__sq, 'Square');
                eatBallSound(document.querySelector('#eatBall2'));
                if (count__all === 0) {
                    checkPlayersWin();
                }
            }
        }
    }
}



//----------------------------------Функции злого круга------------------------------------------

//Нарисовать
EvilCircle.prototype.draw = function () {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
}

//Установка в прототип функции, которая не позволяет фигуре выходить за экран
EvilCircle.prototype.checkBounds = checkBoundsForPrototypes;

//Функция, фиксирующая столкновения шаров со злым кругом
EvilCircle.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {

        if (balls[j].exist) {
            let dx = this.x - balls[j].x;
            let dy = this.y - balls[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].exist = false;
                count__cl++;
                count__all--;
                this.size += 0.6;
                this.velX += 0.8;
                this.velY += 0.8;
                counter(para__cl, player1Name, count__cl, 'Circle');
                eatBallSound(document.querySelector('#eatBall1'));
                if (count__all === 0) {
                    checkPlayersWin();
                }
            }
        }
    }
}
//-----------------Победитель--------------------------
let winnerWindow = document.querySelector('.winner');
let winnerCongraduation = document.querySelector('#winnerName');
let winnerImg = document.querySelector('.winner__img');

//Главная функция конца игры
function checkPlayersWin() {
    whoWinner(count__sq, player2Name, 'square');
    whoWinner(count__cl, player1Name, 'circle');
}

//Функция, вызывающая окно победителя и определяющая кто победитель
function whoWinner(count, playerName, figure) {
    winnerWindow.classList.add('active');
    if (count > (quanityBalls / 2)) {
        winner(playerName, figure);
    } else if (count === (quanityBalls / 2)) {
        draw();
        return
    } else {
        return false
    }
}

//Функция, прописывающая имя победителя
function winner(nameWinner, figure) {
    winnerCongraduation.textContent = `${nameWinner}`;
    winnerImg.classList.add(figure);
}

//Функция ничья
function draw() {
    winnerCongraduation.textContent = `${player1Name} and ${player2Name}`;
    document.querySelector('.winneris').textContent = 'DRAW!!!';
    document.querySelector('.nicegame').textContent = 'nice game!!!';
}
//Счетчик
function counter(place, name, count, figure) {
    place.textContent = `${name}: ${count}!`;
    if (name === '') {
        place.textContent = `${figure}: ${count} !`;
    }
}

//--------------------------------------Функции для шаров----------------------------------------------

//Нарисовать
Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

//Движение + отскакивание от стены
Ball.prototype.update = function () {
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

//Изменение цвета при столкновении шаров с шарами
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

//---------------------------Создание фигур игроков--------------------------

//Новый злой квадрат
let evilSquare = new EvilSquare(
    random(0, width),
    random(0, height),
    true
);

//Новый злой круг
let evilCircle = new EvilCircle(
    random(0, width),
    random(0, height),
    true
);

//Вызов функции контроля фигур
setControl();

//Массив шаров
let balls = []
while (balls.length < quanityBalls) {
    const size = random(10, 20);
    let ball = new Ball(
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        true,
        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
        size
    )
    balls.push(ball);
}

//Функция, которая позволяет контролировать фигуры
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

//Основная функция активации игры
function loop() {

    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exist) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }
    evilSquare.draw();
    evilSquare.checkBounds();
    evilSquare.collisionDetect();

    evilCircle.draw();
    evilCircle.checkBounds();
    evilCircle.collisionDetect();
    requestAnimationFrame(loop);
}