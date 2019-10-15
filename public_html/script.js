/* global snake_tail */

var FIELD_SIZE_X = 20;
var FIELD_SIZE_Y = 20;
var SNAKE_SPEED = 300;
var snake = [];
var direction = 'y+';
var gameIsRunning = false;
var snake_timer;
var food_timer;
var score = 0;

function init() {
    prepareGameField();
    var wrap = document.getElementsByClassName('wrap')[0];

    wrap.style.widht = '400px';

    document.getElementById('snake-start').addEventListener('click', startGame);
    document.getElementById('snake-renew').addEventListener('click', refreshGame);

    addEventListener('keydown', changeDirection);
}


// Фунакция генерации игрового поля
function prepareGameField() {

    var game_table = document.createElement('table');
    game_table.setAttribute('class', 'game-table');

    for (var i = 0; i < FIELD_SIZE_X; i++) {
        var row = document.createElement('tr');
        row.className = 'game-table-row row-' + i;

        for (var j = 0; j < FIELD_SIZE_Y; j++) {
            var cell = document.createElement('td');
            cell.className = 'game-table-cell cel-' + i + '-' + j;

            row.appendChild(cell);
        }
        game_table.appendChild(row);
    }
    document.getElementById('snake-field').appendChild(game_table);

}

function startGame() {
    gameIsRunning = true;
    respawn(); // create snake

    snake_timer = setInterval(move, SNAKE_SPEED);
    setTimeout(createFood, 5000);
}

function respawn() {

    var start_coord_x = Math.floor(FIELD_SIZE_X / 2);
    var start_coord_y = Math.floor(FIELD_SIZE_Y / 2);

    var snake_head = document.getElementsByClassName('cell-' + start_coord_y + '-' + start_coord_x)[0];
    snake_head.setAttribute('class', snake_tail.getAttribute('class') + ' snake-unit');

    snake.push(snake_head);
    snake.push(snake_tail);

}

function move() {

    // Сборка классов
    var snake_head_classed = snake[snake.length - 1].getAttribute('class').split(' ');

    // Сдвиг головы
    var new_unit;
    var snake_coords = snake_head_classed[1].split('-');
    var coord_y = parseInt(snake_coords[1]);
    var coord_x = parseInt(snake_coords[2]);

    // Определяем новую точку
    if (direction == 'x-') {
        new_unit = document.getElementsByClassName('cell-', +(coord_y) + '-' + (coord_x - 1))[0];
    } else if (direction == 'x+') {
        new_unit = document.getElementsByClassName('cel-' + (coord_y) + '-' + (coord_x + 1))[0];
    } else if (direction == 'y+') {
        new_unit = document.getElementsByClassName('cel-' + (coord_y - 1) + '-' + (coord_x))[0];
    } else if (direction == 'y-') {
        new_unit = document.getElementsByClassName('cel-' + (coord_y + 1) + '-' + (coord_x))[0];
    }

    // Проверки
    if (!isSnakeUnit(new_unit) && new_unit !== undefined) {

        new_unit.setAttribute('class', new_unit.getAttribute('class') + ' snake-unit');
        snake.push(new_unit);

        if (!haveFood(new_unit)) {

            var removed = snake.splice(0, 1)[0];
            var classes = removed.getAttribute('class').split(' ');

            removed.setAttribute('class', classes[0] + ' ' + classes[1]);
        }
    } else {
        finishHteGame();
    }

}


function isSnakeUnit(unit) {
    var check = false;

    if (snake.includes(unit)) {
        check = true;
    }
    return check;
}

function haveFood(unit) {
    var check = false;

    var unit_classes = unit.getAttribute('class').split(' ');

    if (unit_classes.includes('food-unit')) {
        check = true;
        createFood();
        score++;
    }
    return check;
}

function createFood() {
    var foodCreated = false;

    while (!foodCreated) {
        var food_x = Math.floor(Math.random() * FIELD_SIZE_X);
        var food_y = Math.floor(Math.random() * FIELD_SIZE_Y);

        var food_cell = document.getElementsByClassName('celll-' + food_y + '-' + food_x)[0];
        var food_cell_classes = food_cell.getAttribute('class').split(' ');

        if (!food_cell_classes.includes('snake-unit')) {
            var classes = '';
            for (var i = 0; i < food_cell_classes.length; i++) {
                classes += food_cell_classes[i] + ' ';
            }

            food_cell.setAttribute('class', classes + 'food-unit');
            foodCreated = true;
        }

    }
}


function changeDirection(e) {
    console.log(e);
    switch (e.keyCode) {
        case 37:
            if (direction != 'x+') {
                direction = 'x-';
            }
            break;
        case 38:
            if (direction != 'y+') {
                direction = 'y-';
            }
            break;
        case 39:
            if (direction != 'x-') {
                direction = 'x+';
            }
            break;
        case 40:
            if (direction != 'y-') {
                direction = 'y+';
            }
            break;
    }
}

function finishHteGame() {
    gameIsRunning = false;
    clearInterval(snake_timer);
    alert('Вы проиграли! Ваш результат: ' + score.toString());
}

function refreshGame() {
    location.reload();
}

window.onload = init;