(function () {
    "use strict";
    let square = document.querySelector(".wrapper")
        , statusField = document.getElementById("status")
        , moveCount = 0
        , userToken = "X"
        , aiToken = "O"
        , userTurn = true
        , userStart = true
        , userMove = true
        , board = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        , winningCombos = [
            [0, 1, 2]
            , [3, 4, 5]
            , [6, 7, 8]
            , [0, 3, 6]
            , [1, 4, 7]
            , [2, 5, 8]
            , [0, 4, 8]
            , [2, 4, 6]
        , ];
    var ui = {
            scores: {
                scores: document.querySelector('.scores')
                , player1: document.querySelector('.player1 .score')
                , player2: document.querySelector('.player2 .score')
                , ties: document.querySelector('.ties .score')
            }
        }
        , computerScores = {
            player1: 0
            , player2: 0
            , ties: 0
        }
        //    var wincount = 0;
        //    var tiecount = 0;
    statusField.innerHTML = "Tic Tac Toe";
    // modal
    (function () {
        var wrapper = document.querySelector(".wrapper");
        //        modal.style.display = "block";
        wrapper.addEventListener("click", function (e) {
            userToken = "X";
            userToken == "X" ? aiToken = "O" : aiToken = "X";
            modal.style.display = "none";
            if (userToken === "O") {
                userMove = false;
                userStart = false;
                aiMove();
            }
            else {
                statusUserMove();
            }
        });
    })();
    square.addEventListener("click", getClickedField);

    function clearBoard() {
        board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        moveCount = 0;
        for (let i = 0; i < 9; i++) {
            let element = document.getElementById(i);
            element.innerHTML = "";
            element.classList.remove("markWinner");
        }
        userStart = !userStart;
        if (!userStart) {
            aiMove();
        }
        else {
            statusUserMove();
        }
    }

    function getClickedField(e) {
        if (e.target.id && !board[e.target.id] && moveCount < 9) {
            // add clicked square to board array
            board[e.target.id] = userToken;
            // mark clicked square
            document.getElementById(e.target.id).innerHTML = userToken;
            moveCount++;
            // check if this move was a winning move
            // should never be true :)
            let winner = checkWinner(userToken);
            if (winner) {
                markWinner(winner);
                moveCount = 10;
                setTimeout(clearBoard, 3000);
            }
            // if moves left call aiMove
            if (moveCount < 9) {
                userTurn = false;
                statusField.innerHTML = "Thinking...";
                // add timeout for aiMove so player can see the move
                setTimeout(aiMove, 100);
            }
        }
        // square is full, no winner, it's a tie
        if (moveCount >= 9) {
            statusTie()
        }
    }

    function checkWinner(token) {
        let winner = "";
        winningCombos.forEach(function (arr) {
            if (token == board[arr[0]] && token == board[arr[1]] && token == board[arr[2]]) {
                winner = arr;
            }
        });
        return winner;
    }

    function markWinner(winner) {
        for (let i = 0; i < 3; i++) {
            document.getElementById(winner[i]).classList.add("markWinner");
        }
        ui.scores.player2.innerHTML = computerScores.player1;
    }

    function aiMove() {
        let num;
        // AI moves first, takes the corner
        if (moveCount === 0) {
            num = 0
        }
        // AI moves second, takes the center if free;
        // else takes corner
        else if (moveCount === 1) {
            if (!board[4]) {
                num = 4;
            }
            else {
                num = 0;
            }
        }
        // check for fork possibility
        else if (moveCount === 2) {
            // if center is free AI takes center
            if (board[4] === 0) {
                num = 4;
            }
            // if user has center
            // AI already has a corner, so it takes the opposite corner
            if (board[4] === userToken) {
                num = 8;
            }
            // block fork
        }
        else if (moveCount == 3 && board[1] == userToken && board[3] == userToken) {
            num = 0;
        }
        else if (moveCount === 3 && board[4] === userToken && board[8] == userToken) {
            num = 2;
        }
        else {
            let winArray;
            // check if AI has a move to win
            winArray = checkTwoToWin(aiToken);
            if (winArray) {
                // get position to win
                num = getPosition(winArray);
                document.getElementById(num).innerHTML = aiToken;
                statusAiWins(winArray);
                moveCount = 10;
                return;
            }
            // check if AI need to block
            else if (checkTwoToWin(userToken)) {
                let blockArray = checkTwoToWin(userToken);
                num = getPosition(blockArray);
            }
            else if (blockFork()) {
                num = blockFork();
            }
            else {
                num = selectMove();
            }
        }
        board[num] = aiToken;
        document.getElementById(num).innerHTML = aiToken;
        moveCount++;
        // square is full, no winner
        if (moveCount >= 9) {
            statusTie();
        }
        else {
            statusUserMove();
        }
    }

    function statusUserMove() {
        statusField.innerHTML = "Your move  (" + userToken + ")";
    }

    function statusTie() {
        statusField.innerHTML = "It's a tie";
        ui.scores.ties.innerHTML = ++computerScores.ties;
        setTimeout(clearBoard, 2000);
    }

    function statusAiWins(arr) {
        statusField.innerHTML = "Computer wins!";
        ++computerScores.player1
        markWinner(arr);
        setTimeout(clearBoard, 2000);
    }

    function getPosition(arr) {
        for (let i = 0; i < 3; i++) {
            if (!board[arr[i]]) {
                return arr[i];
            }
        }
    }

    function checkTwoToWin(token) {
        let winArray = "";
        winningCombos.forEach(function (arr) {
            if (board[arr[0]] == token && board[arr[1]] == token && board[arr[2]] == 0 || board[arr[0]] == token && board[arr[1]] == 0 && board[arr[2]] == token || board[arr[0]] == 0 && board[arr[1]] == token && board[arr[2]] == token) {
                winArray = arr;
            }
        });
        return winArray;
    }
    // check if AI has a chance to win in next move
    function checkGoodMove(board, token) {
        let result = true;
        let token2 = token == "O" ? "X" : "O";
        winningCombos.forEach(function (arr) {
            if (board[arr[0]] == token && board[arr[1]] == token && board[arr[2]] == token2 || board[arr[0]] == token && board[arr[1]] == token2 && board[arr[2]] == token || board[arr[0]] == token2 && board[arr[1]] == token && board[arr[2]] == token) {
                result = false;
            }
        });
        return result;
    }

    function blockFork() {
        if (board[4] == aiToken) {
            if (board[0] == userToken && board[8] == userToken || board[2] == userToken && board[6] == userToken && !board[1]) {
                return 1;
            }
        }
        return 0;
    }

    function selectMove() {
        let num;
        let boardCopy = board.slice();
        // get all free cells
        let emptyCells = board.map(function (e, i) {
            if (!e) {
                return i;
            }
            return;
        }).filter(function (a) {
            return a !== undefined;
        });
        num = emptyCells[0];
        // Take empty cell, put it on the board
        // and check if AI has chance to win in the next move
        for (let i = 0; i < emptyCells.length; i++) {
            boardCopy[emptyCells[i]] = aiToken;
            let result = checkGoodMove(boardCopy, aiToken);
            if (result) {
                num = emptyCells[i];
            }
            // remove temp move
            boardCopy[emptyCells[i]] = 0;
        }
        return num;
    }
})();