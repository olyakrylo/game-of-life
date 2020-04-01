function main() {
    let method = process.argv[2];
    switch(method) {
        case 'g': {
            let m = Number(process.argv[3]);
            let n = Number(process.argv[4]);
            if (!m || !n) {
                console.log("Для генерации ожидается ввод в формате 'node game.js g m n'");
                break;
            }
            startGame( genStartState(m, n) );
            break;
        };
        case 'f': {
            let fileName = process.argv[3];
            if (!fileName) {
                console.log("Для ввода из файла ожидается ввод в формате 'node game.js f filename.txt'");
                break;
            }
            let startState = getStateFromFile(fileName);
            if (!startState) {
                console.log("В файле ошибка");
                break;
            }
            startGame(startState);
            break;
        };
        default: {
            console.log("Для генерации ввод в формате 'node game.js g m n', для чтения из файла 'node game.js f filename.txt'");
            return;
        }
    }
}


function startGame(state) {
    console.log('Стартовое поле:');
    printState(state);

    setTimeout(function count() {
        state = getNewState(state);
        printState(state);
        if (!areAllZeros(state)) {
            setTimeout(count, 1000);
        } else {
            console.log('Не осталось ни одной живой клетки :(')
        }
    }, 1000);
}


function getStateFromFile(fileName) {
    const fs = require("fs");
    let fileContent;

    try {
        fileContent = fs.readFileSync(fileName, "utf8");
    } catch {
        console.log("Такого файла нет...");
        return null;
    }

    let rows = fileContent.trim().split('\r\n');

    let [m, n] = rows[0].trim().split(' ').map(x => Number(x));
    if (!m || !n) return null;

    let matrix = rows.slice(1);
    if (matrix.length !== m) return null; 

    let state = [];
    for (let row of matrix) {
        let array = row.trim().split(' ').map(x => Number(x));
        if (array.filter(x => isNaN(x)).length || array.length !== n) {
            return null;
        }
        state.push(array);
    }

    return state;
}


function genStartState(m, n) {
    let state = [];
    for (let i = 0; i < m; ++i) {
        state[i] = [];
        for (let j = 0; j < n; ++j) {
            state[i].push(Math.round(Math.random()));
        }
    }
    return state;
}


function getNewState(currState) {
    let res = [];
    for (let i in currState) {
        res[i] = [];
        for (let j in currState[i]) {
            let aliveNeighbours = countAliveNeighbours(Number(i), Number(j));
            if (currState[i][j] === 0) {
                res[i].push(aliveNeighbours === 3 ? 1 : 0);
                continue;
            }
            res[i].push(aliveNeighbours === 2 || aliveNeighbours === 3 ? 1 : 0);
        }
    }
    return res;

    function countAliveNeighbours(i, j) {
        let count = 0;
        let neighbourIndicies = [[i - 1, j], [i + 1, j],
                                 [i, j + 1], [i, j - 1], 
                                 [i - 1, j + 1], [i + 1, j - 1],
                                 [i + 1, j + 1], [i - 1, j - 1]];
        for (let indices of neighbourIndicies) {
            let x = indices[0], y = indices[1];
            if (x >= 0 && x < currState.length &&
                y >= 0 && y < currState[0].length) {
                    count += currState[x][y] === 1 ? 1 : 0;
                }
        }
        return count;
    }
}


function printState(state) {
    for (let row of state) {
        console.log( row.join(' ') );
    }
    console.log();
}


function areAllZeros(state) {
    for (let row of state) {
        if (row.includes(1)) {
            return false;
        }
    }
    return true;
}

main();