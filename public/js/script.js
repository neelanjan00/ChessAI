var board, game = new Chess();

/*The "AI" part starts here */

var minimaxRoot = function (depth, game, isMaximisingPlayer) {

    var newGameMoves = game.ugly_moves();
    var bestMove = -9999;
    var bestMoveFound;

    for (var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i]
        game.ugly_move(newGameMove);
        var value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
        game.undo();
        if (value >= bestMove) {
            bestMove = value;
            bestMoveFound = newGameMove;
        }
    }

    return bestMoveFound;
};

var minimax = function (depth, game, alpha, beta, isMaximisingPlayer) {
    positionCount++;
    if (depth === 0) {
        return -evaluateBoard(game.board());
    }

    var newGameMoves = game.ugly_moves();

    if (isMaximisingPlayer) {
        var bestMove = -9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            alpha = Math.max(alpha, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    } else {
        var bestMove = 9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            beta = Math.min(beta, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    }
};


/* Board Evaluation Logic, with piece position evaluation coupled with the piece-square tables logic */

var evaluateBoard = function (board) {
    var totalEvaluation = 0;

    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++)
            totalEvaluation += getPieceValue(board[i][j], i, j);
    }

    return totalEvaluation;
};

var reverseArray = function (array) {
    return array.slice().reverse();
};

var pawnEvalWhite =
    [
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
        [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
        [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
        [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
        [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
        [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    ];

var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval =
    [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
        [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
        [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
        [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
        [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
        [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ];

var bishopEvalWhite = [
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
    [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
    [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
    [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
    [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0]
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var evalQueen = [
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

var kingEvalWhite = [

    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
    [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0]
];

var kingEvalBlack = reverseArray(kingEvalWhite);

var getPieceValue = function (piece, x, y) {
    if (piece === null) {
        return 0;
    }
    var getAbsoluteValue = function (piece, isWhite, x, y) {
        if (piece.type === 'p') {
            return 10 + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x]);
        } else if (piece.type === 'r') {
            return 50 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x]);
        } else if (piece.type === 'n') {
            return 30 + knightEval[y][x];
        } else if (piece.type === 'b') {
            return 30 + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
        } else if (piece.type === 'q') {
            return 90 + evalQueen[y][x];
        } else if (piece.type === 'k') {
            return 900 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
        }
        throw "Unknown piece type: " + piece.type;
    };

    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x, y);
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
};


/* Board visualization and games state handling */

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

var makeBestMove = function () {
    var bestMove = getBestMove(game);
    game.ugly_move(bestMove);
    board.position(game.fen());
    renderMoveHistory(game.history());
    if (game.game_over()) {
        clearInterval(timer);
        alert('Game Over');
        if (game.in_checkmate()) {
            document.getElementById("gameOver").innerHTML = "<h3>Its a Checkmate!</h3>";
            if (game.turn() == 'b') {
                // player has won
                showModal();
            }
        } else if (game.in_draw()){
            document.getElementById("gameOver").innerHTML = "<h3>Its a Draw!</h3>";
        }

        document.getElementById("aiTime").innerHTML = `<h3>Total Time Taken by AI: ${formatTime(totalAISeconds)}</h3>`
        document.getElementById("playerTime").innerHTML = `<h3>Total Time Taken by the player: ${formatTime(Math.abs(totalSeconds - totalAISeconds))}</h3>`
    }
};


var positionCount;
var getBestMove = function (game) {
    if (game.game_over()) {
        clearInterval(timer);
        alert('Game Over');
        if (game.in_checkmate()) {
            document.getElementById("gameOver").innerHTML = "<h3>Its a Checkmate!</h3>";
            if (game.turn() == 'b') {
                // player has won
                showModal();
            }
        } else if (game.in_draw()){
            document.getElementById("gameOver").innerHTML = "<h3>Its a Draw!</h3>";
        }

        document.getElementById("aiTime").innerHTML = `<h3>Total Time Taken by AI: ${formatTime(totalAISeconds)}</h3>`
        document.getElementById("playerTime").innerHTML = `<h3>Total Time Taken by the player: ${formatTime(Math.abs(totalSeconds - totalAISeconds))}</h3>`
    }

    positionCount = 0;
    var depth = 3;

    var d = new Date().getTime();
    var bestMove = minimaxRoot(depth, game, true);
    var d2 = new Date().getTime();
    var moveTime = (d2 - d);
    var positionsPerS = (positionCount * 1000 / moveTime);

    $('#position-count').text(positionCount);
    $('#time').text(moveTime / 1000 + 's');
    $('#positions-per-s').text(positionsPerS);

    totalAISeconds += moveTime / 1000;

    return bestMove;
};

var renderMoveHistory = function (moves) {
    var historyElement = $('#move-history').empty();
    historyElement.empty();

    for (var i = 0; i < moves.length; i = i + 2) {
        historyElement.append('<span>' + moves[i] + ' ' + (moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
    }

    historyElement.scrollTop(historyElement[0].scrollHeight);
};

var onDrop = function (source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    removeGreySquares();

    if (move === null) {
        return 'snapback';
    }

    renderMoveHistory(game.history());
    window.setTimeout(makeBestMove, 250);
};

var onSnapEnd = function () {
    if (!gameStarted) {
        window.onbeforeunload = function () {
            return "You'll lose all your progress. Continue?";
        };
        timer = setInterval(setTime, 1000);
        document.getElementById('move-history-heading').style.display = 'block';
        gameStarted = 1;
    }
    board.position(game.fen());
};


/* Logic for suggesting all possible moves that a piece can execute by grey squares */

var onMouseoverSquare = function (square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function (square, piece) {
    removeGreySquares();
};

var removeGreySquares = function () {
    $('#board .square-55d63').css('background', '');
};

var greySquare = function (square) {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
};


/* Board Object Configuration and Initialization. */

var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
};

board = ChessBoard('board', cfg);

var gameStarted = 0;
var timer = null;

var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var hoursLabel = document.getElementById("hours");
var totalSeconds = 0;
var totalAISeconds = 0;

function setTime() {
    ++totalSeconds;

    document.getElementById("timer").innerHTML = `<h2><b>${formatTime(totalSeconds)}</b></h2>`;
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

function formatTime(seconds) {
    var hours = Math.floor(seconds / 3600);
    seconds -= Math.floor(seconds / 3600) * 3600;
    var minutes = Math.floor(seconds / 60)
    seconds -= Math.floor(seconds / 60) * 60;

    hours = hours <= 9 ? '0'.concat(hours.toString()) : hours
    minutes = minutes <= 9 ? '0'.concat(minutes.toString()) : minutes
    seconds = seconds <= 9 ? '0'.concat(Math.floor(seconds).toString()) : Math.floor(seconds)

    return `${hours} : ${minutes} : ${seconds}`
}

function formatDate(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '-' + (m <= 9 ? '0' + m : m) + '-' + y;
}

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBSlmCIVxKQPAO5p0auSLPQzoCYz9IFr3g",
    authDomain: "playchessai.firebaseapp.com",
    projectId: "playchessai",
    storageBucket: "playchessai.appspot.com",
    messagingSenderId: "614903980947",
    appId: "1:614903980947:web:c0cc972e3b1d2e1645fe66"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var leaderboard = [];
var leaderboardUpdated = false;
var db = firebase.firestore();

function showModal() {
    $('#nameInputModal').modal('show');
}

function submitDataToLeaderboard() {
    var winningDate = formatDate(new Date());
    var playerName = document.getElementById("playerName").value;
    var playerTotalSeconds = Math.floor(Math.abs(totalSeconds - totalAISeconds));

    db.collection("leaderboard").add({
        winningDate: winningDate,
        playerName: playerName,
        playerTotalSeconds: playerTotalSeconds
    }).then((docRef) => {
        alert("Leaderboard Updated!");
    }).catch((error) => {
        console.error("Error adding document: ", error);
        alert("Couldn't update the leaderboard, please try again!");
    });
}

db.collection("leaderboard").orderBy('playerTotalSeconds').onSnapshot(function (snapshot) {
    snapshot.forEach(function (doc) {
        leaderboard.push(doc.data());
    });
})

function showLeaderboard() {
    if (!leaderboardUpdated) {
        var leaderboardTable = document.getElementById("leaderboard-table")
        for (var i = 0; i < leaderboard.length; ++i) {
            var row = leaderboardTable.insertRow(i + 1);
            row.insertCell(0).innerHTML = i + 1;
            row.insertCell(1).innerHTML = leaderboard[i].winningDate;
            row.insertCell(2).innerHTML = leaderboard[i].playerName;
            row.insertCell(3).innerHTML = formatTime(leaderboard[i].playerTotalSeconds);
        }

        leaderboardUpdated = true;
    }
    $('#leaderboard').modal('show');
}