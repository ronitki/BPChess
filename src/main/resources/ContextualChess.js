importPackage(Packages.il.ac.bgu.cs.bp.bpjs.Chess.events);
importPackage(Packages.il.ac.bgu.cs.bp.bpjs.context);
importPackage(Packages.il.ac.bgu.cs.bp.bpjs.Chess.context.schema);
importPackage(Packages.il.ac.bgu.cs.bp.bpjs.Chess.context.schema.piece);

var myColor;
var otherColor;
var blackKing;
var whiteKing;
//#region HELP FUNCTIONS
function getCell(i, j) {
    return CTX.getContextsOfType("Cell(" + i + "," + j + ")").get(0);
}
function getCellWithPiece(p) {
    try {
        return CTX.getContextsOfType("CellWithPiece(" + p + ")").get(0);
    } catch (e) {
        return null;
    }
}
function getPiece(p) {
    try {
        return CTX.getContextsOfType("SpecificPiece(" + p + ")").get(0);
    } catch (e) {
        return null;
    }
}
function getCellWithColor(c) {
    try {
        return CTX.getContextsOfType("CellWithColor(" + c + ")");
    } catch (e) {
        return null;
    }
}
function getCellWithType(t) {
    try {
        return CTX.getContextsOfType("CellWithType(" + t + ")");
    } catch (e) {
        return null;
    }
}
function getNonEmpty() {
    try {
        return CTX.getContextsOfType("NonEmptyCell");
    } catch (e) {
        return null;
    }
}
function isNonEmpty(cell) {
    return getNonEmpty().contains(cell);
}
function isType(cell, type) {
    return getCellWithType(type).contains(cell);
}
function isColor(cell, color) {
    return getCellWithColor(color).contains(cell);
}
function getRealPiece(cell) {
    var piece = {};
    if (getCellWithType(Type.King).contains(cell)) {
        piece.type = "King";
    }
    else if(getCellWithType(Type.Rook).contains(cell)) {
        piece.type = "Rook";
    }
    else{
        bp.log.info("Error");
    }
    if (getCellWithColor(Color.White).contains(cell)) {
        piece.color = "White";
    }
    else {
        piece.color = "Black";
    }
    piece.id = 1;
    return getPiece(piece.color + "_" + piece.type + "_" + piece.id);
}
function getOppositeColor(cell) {

    if (getCellWithColor(Color.Black).contains(cell))
        return Color.White;
    return Color.Black;

}
function getMyColor(cell) {

    if (getCellWithColor(Color.Black).contains(cell))
        return Color.Black;
    return Color.White;

}
//#endregion HELP FUNCTIONS

//#region GameRules
bp.registerBThread("EnforceTurns", function () {
    bp.sync({waitFor: bp.Event("init_end")});
    while (true) {
        bp.sync({waitFor: Move.ColorMoveEventSet(Color.White), block: Move.ColorMoveEventSet(Color.Black)});
        bp.sync({waitFor: Move.ColorMoveEventSet(Color.Black), block: Move.ColorMoveEventSet(Color.White)});

    }
});

bp.registerBThread("UpdateBoardOnMove", function () {
    bp.sync({waitFor: bp.Event("init_end")});
    while (true) {
        var move = bp.sync({waitFor: Move.AnyMoveEventSet()});
        var target= (Cell)((Move)(move).target);
        if(isNonEmpty(target)) {
            bp.sync({request: bp.Event("Update Started-Eat")});
        }
        else {
            bp.sync({request: bp.Event("Update Started-Move")});
        }
        bp.sync({
            request: CTX.Transaction(
                CTX.UpdateEvent("UpdateCell", {"cell": move.source, "piece": null}),
                CTX.UpdateEvent("UpdateCell", {"cell": move.target, "piece": move.piece}))
        });
    }
});


bp.registerBThread("Wait For Database to be updated", function () {
    bp.sync({waitFor: bp.Event("init_end")});
   while(true) {
       var toWait;
       var i=0;
       var move=bp.sync({waitFor: [bp.Event("Update Started-Eat"),bp.Event("Update Started-Move")]});
       if(move.name.equals("Update Started-Eat")){
           toWait=9;
       }
       else{
           toWait=10;
       }
       while(i<toWait){
           bp.sync({waitFor: Move.ContextEventSet()});
           i++;
       }
       bp.sync({request: bp.Event("Update Ended")});
   }
});

bp.registerBThread("GetEngineMove", function () {
    bp.sync({waitFor: bp.Event("init_end")});
    while (true) {
        var input = bp.sync({waitFor: Move.EngineEventSet()}).name.split("-")[1];
        var i = input.charAt(0) - 48;
        var j = input.charAt(1) - 48;
        var cell = getCell(i, j);
        var piece = getRealPiece(cell);
        bp.sync({request: new Move(new Cell(i,j), new Cell(input.charAt(2) - 48, input.charAt(3) - 48), piece)});
    }
});

bp.registerBThread("GetMyColor", function () {
    myColor = bp.sync({waitFor: [bp.Event("color", "black"), bp.Event("color", "white")]}).data;
    if (myColor.localeCompare("black") === 0) {
        myColor = Color.Black;
        otherColor = Color.White;
    }
    else {
        myColor = Color.White;
        otherColor = Color.Black;
    }
    bp.sync({request: bp.Event("Color was updated")});
    while (true) {
        bp.sync({waitFor: bp.Event("My Turn"), block: Move.ColorMoveEventSet(myColor)});
        bp.sync({waitFor: Move.ColorMoveEventSet(myColor)});

    }
});

bp.registerBThread("block moving to the same place", function () {
    bp.sync({waitFor: bp.Event("init_end")});
    bp.sync({block: Move.SamePlaceMoveEventSet()});
});

bp.registerBThread("block out of board moves", function () {
    bp.sync({waitFor: bp.Event("init_end")});
    bp.sync({block: Move.OutOfBoardMoveEventSet()});
});

bp.registerBThread("announce engine turn", function () {
    bp.sync({waitFor: bp.Event("Color was updated")});
    bp.sync({waitFor: bp.Event("init_end")});
    while(true) {
        bp.sync({waitFor: Move.ColorMoveEventSet(otherColor)});
        bp.sync({waitFor: bp.Event("Update Ended")});
        bp.sync({request: bp.Event("EnginePlayed")});
    }
});

bp.registerBThread("announce my turn", function () {
    bp.sync({waitFor: bp.Event("Color was updated")});
    bp.sync({waitFor: bp.Event("init_end")});
    while(true) {
        bp.sync({waitFor: Move.ColorMoveEventSet(myColor)});
        bp.sync({waitFor: bp.Event("Update Ended")});
        bp.sync({request: bp.Event("My Color Played")});
    }

});

bp.registerBThread("delete piece upon eating", function () {
    bp.sync({waitFor: bp.Event("init_end")});
    while (true) {
        var move = bp.sync({waitFor: Move.AnyMoveEventSet()});
        var target= (Cell)((Move)(move).target);
        if(isNonEmpty(target)) {
            var piece = getRealPiece(target);
            bp.log.info("The piece is: " + piece);
            bp.sync({request: CTX.UpdateEvent("DeletePiece", {"p": piece})})
        }
    }
});

CTX.subscribe("Kill piece", "piece", function (p) {
    bp.sync({waitFor: bp.Event("init_end")});
    bp.sync({waitFor: CTX.ContextEndedEvent("Piece", p)});
    bp.sync({block: Move.PieceMoveEventSet(p)});
});

//TODO if happened no eventselect && my turn(||go) && chess = math else tie
//#endregion GameRules

//#region RookBehaviors
CTX.subscribe("AskMoveForRook", "Rook", function (rook) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if(myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    while (true) {
        var rookCell = getCellWithPiece(rook);
        if (rookCell == null) { // If the piece is not on board
            break;
        }
        if (isColor(rookCell, otherColor)) {
            break;
        }
        var cells = [];
        //right
        for (var i = rookCell.i + 1; i < size; i++) {
            var c = getCell(i, rookCell.j);
            if (isNonEmpty(c)) {
                if (isColor(c, getOppositeColor(rookCell))) {
                    cells.push(c);
                }
                break;
            }
            cells.push(c);

        }
        //left
        for (var i = rookCell.i - 1; i >= 0; i--) {
            var c = getCell(i, rookCell.j);
            if (isNonEmpty(c)) {
                if (isColor(c, getOppositeColor(rookCell))) {
                    cells.push(c);
                }
                break;
            }
            cells.push(c);

        }
        //up
        for (var j = rookCell.j + 1; j < size; j++) {
            var c = getCell(rookCell.i, j);

            if (isNonEmpty(c)) {
                if (isColor(c, getOppositeColor(rookCell))) {
                    cells.push(c);
                }
                break;
            }
            cells.push(c);
        }
        //down
        for (var j = rookCell.j - 1; j >= 0; j--) {
            var c = getCell(rookCell.i, j);
            if (isNonEmpty(c)) {
                if (isColor(c, getOppositeColor(rookCell))) {
                    cells.push(c);
                }
                break;
            }
            cells.push(c);
        }

        for (var start = 0; start < cells.length; start++) {
            if (checkifCauseChess(rookCell, cells[start], rook)) {
                cells.splice(start, 1);
                start--;
            }
        }
        var legalMoves = cells.map(function (c) {
            return new Move(rookCell, c, rook);
        });
        bp.log.info("Rook Legal Moves: "+legalMoves);
        bp.sync({request: legalMoves, waitFor: bp.Event("My Color Played")});
        bp.sync({waitFor: bp.Event("EnginePlayed")});

    }
});
//#endregion RookBehaviors

function checkRight(cell, color) {
    for (var i = cell.i + 1; i < size; i++) {
        var currentCell = getCell(i, cell.j);
        if (isNonEmpty(currentCell)) { //there's someone in the cell
            if (!isColor(currentCell, color)) { // the piece is enemy piece
                if (isType(currentCell, Type.Rook) || isType(currentCell, Type.Queen)) {
                    return true;
                }
                if (isType(currentCell, Type.King) && i === cell.i + 1) {
                    return true;
                }
            }
            else {
                return false;
            }
        }
    }
    return false;
}

function checkLeft(cell, color) {
    for (var i = cell.i - 1; i >= 0; i--) {
        var currentCell = getCell(i, cell.j);
        if (isNonEmpty(currentCell)) { //there's someone in the cell
            if (!isColor(currentCell, color)) { // the piece is enemy piece
                if (isType(currentCell, Type.Rook) || isType(currentCell, Type.Queen)) {
                    return true;
                }
                if (isType(currentCell, Type.King) && i === cell.i - 1) {
                    return true;
                }
            }
            else {
                return false;
            }
        }
    }
    return false;
}

function checkUp(cell, color) {
    for (var j = cell.j + 1; j < size; j++) {
        var currentCell = getCell(cell.i, j);
        if (isNonEmpty(currentCell)) { //there's someone in the cell
            if (!isColor(currentCell, color)) { // the piece is enemy piece
                if (isType(currentCell, Type.Rook) || isType(currentCell, Type.Queen)) {
                    return true;
                }
                if (isType(currentCell, Type.King) && j === cell.j + 1) {
                    return true;
                }
            }
            else {
                return false;
            }
        }
    }
    return false;
}

function checkDown(cell, color) {
    for (var j = cell.j - 1; j >= 0; j--) {
        var currentCell = getCell(cell.i, j);
        if (isNonEmpty(currentCell)) { //there's someone in the cell
            if (!isColor(currentCell, color)) { // the piece is enemy piece
                if (isType(currentCell, Type.Rook) || isType(currentCell, Type.Queen)) {
                    return true;
                }
                if (isType(currentCell, Type.King) && j === cell.j - 1) {
                    return true;
                }
            }
            else {
                return false;
            }
        }
    }
    return false;
}

function checkUpRight(cell, color) {
    for (var i = cell.i + 1, j = cell.j + 1; j < size && i < size; j++, i++) {
        var currentCell = getCell(i, j);
        if (isNonEmpty(currentCell)) { //there's someone in the cell
            if (!isColor(currentCell, color)) { // the piece is enemy piece
                if (isType(currentCell, Type.Bishop) || isType(currentCell, Type.Queen)) {
                    return true;
                }
                if (i === cell.i + 1 && j === cell.j + 1) {
                    if (isType(currentCell, Type.King)) {
                        return true;
                    }
                    if (isType(currentCell, Type.Pawn) && color.equals(Color.Black)) {
                        return true;
                    }
                }
            }
            else {
                return false;
            }
        }
    }
    return false;
}

function checkUpLeft(cell, color) {
    for (var i = cell.i - 1, j = cell.j + 1; j < size && i >= 0; j++, i--) {
        var currentCell = getCell(i, j);
        if (isNonEmpty(currentCell)) { //there's someone in the cell
            if (!isColor(currentCell, color)) { // the piece is enemy piece
                if (isType(currentCell, Type.Bishop) || isType(currentCell, Type.Queen)) {
                    return true;
                }
                if (i === cell.i - 1 && j === cell.j + 1) {
                    if (isType(currentCell, Type.King)) {
                        return true;
                    }
                    if (isType(currentCell, Type.Pawn) && color.equals(Color.Black)) {
                        return true;
                    }
                }
            }
            else {
                return false;
            }
        }
    }
    return false;
}

function checkDownRight(cell, color) {
    for (var i = cell.i + 1, j = cell.j - 1; j >= 0 && i < size; j--, i++) {
        var currentCell = getCell(i, j);
        if (isNonEmpty(currentCell)) { //there's someone in the cell
            if (!isColor(currentCell, color)) { // the piece is enemy piece
                if (isType(currentCell, Type.Bishop) || isType(currentCell, Type.Queen)) {
                    return true;
                }
                if (i === cell.i + 1 && j === cell.j - 1) {
                    if (isType(currentCell, Type.King)) {
                        return true;
                    }
                    if (isType(currentCell, Type.Pawn) && color.equals(Color.Black)) {
                        return true;
                    }
                }
            }
            else {
                return false;
            }
        }
    }
    return false;
}

function checkDownLeft(cell, color) {
    for (var i = cell.i - 1, j = cell.j - 1; j >= 0 && i >= 0; j--, i--) {
        var currentCell = getCell(i, j);
        if (isNonEmpty(currentCell)) { //there's someone in the cell
            if (!isColor(currentCell, color)) { // the piece is enemy piece
                if (isType(currentCell, Type.Bishop) || isType(currentCell, Type.Queen)) {
                    return true;
                }
                if (i === cell.i - 1 && j === cell.j - 1) {
                    if (isType(currentCell, Type.King)) {
                        return true;
                    }
                    if (isType(currentCell, Type.Pawn) && color.equals(Color.Black)) {
                        return true;
                    }
                }
            }
            else {
                return false;
            }
        }
    }
    return false;
}

function checkKnights(cell, color) {
    if (cell.i + 1 < size) {
        if (cell.j + 2 < size) {
            var currentCell = getCell(cell.i + 1, cell.j + 2);
            if (isType(currentCell, Type.Pawn) && !isColor(currentCell, color)) {
                return true;
            }
        }
        if (cell.j - 2 >= 0) {
            var currentCell = getCell(cell.i + 1, cell.j - 2);
            if (isType(currentCell, Type.Pawn) && !isColor(currentCell, color)) {
                return true;
            }
        }
    }
    if (cell.i - 1 >= 0) {
        if (cell.j + 2 < size) {
            var currentCell = getCell(cell.i - 1, cell.j + 2);
            if (isType(currentCell, Type.Pawn) && !isColor(currentCell, color)) {
                return true;
            }
        }
        if (cell.j - 2 >= 0) {
            var currentCell = getCell(cell.i - 1, cell.j - 2);
            if (isType(currentCell, Type.Pawn) && !isColor(currentCell, color)) {
                return true;
            }
        }
    }
    if (cell.i + 2 < size) {
        if (cell.j + 1 < size) {
            var currentCell = getCell(cell.i + 2, cell.j + 1);
            if (isType(currentCell, Type.Pawn) && !isColor(currentCell, color)) {
                return true;
            }
        }
        if (cell.j - 1 >= 0) {
            var currentCell = getCell(cell.i + 2, cell.j - 1);
            if (isType(currentCell, Type.Pawn) && !isColor(currentCell, color)) {
                return true;
            }
        }
    }
    if (cell.i - 2 >= 0) {
        if (cell.j + 1 < size) {
            var currentCell = getCell(cell.i - 2, cell.j + 1);
            if (isType(currentCell, Type.Pawn) && !isColor(currentCell, color)) {
                return true;
            }
        }
        if (cell.j - 1 >= 0) {
            var currentCell = getCell(cell.i - 2, cell.j - 1);
            if (isType(currentCell, Type.Pawn) && !isColor(currentCell, color)) {
                return true;
            }
        }
    }
    return false;
}

function checkEmpty(cell) {
    return !isNonEmpty(cell);
}
//#region KingBehaviors
function kingController(currentCell, currentColor) {
    return (!checkRight(currentCell, currentColor) && !checkLeft(currentCell, currentColor) && !checkUp(currentCell, currentColor) && !checkDown(currentCell, currentColor) && !checkUpLeft(currentCell, currentColor) && !checkUpRight(currentCell, currentColor) && !checkDownLeft(currentCell, currentColor) && !checkDownRight(currentCell, currentColor) && !checkKnights(currentCell, currentColor));
}

CTX.subscribe("AskMoveForKing", "King", function (king) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (king.color.equals(Color.Black)) {
        blackKing = king;
    }
    else {
        whiteKing = king;
    }
    if(myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    while (true) {
        var kingCell = getCellWithPiece(king);
        if (kingCell === null)
            break;
        if (isColor(kingCell, otherColor))
            break;
        var cells = [];
        var currentCell;
        var currentColor = getMyColor(kingCell);
        if (!kingController(kingCell, currentColor)) {
            bp.sync({request: bp.Event("Chess Event")});
        }
        var i = kingCell.i;
        var j = kingCell.j;
        if (i - 1 >= 0 && j - 1 >= 0) {
            currentCell = getCell(kingCell.i - 1, kingCell.j - 1);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell))
                cells.push(currentCell);
            else if (kingController(currentCell, currentColor) && !checkEmpty(currentCell)&& !isColor(currentCell,currentColor)) {
                if (!checkifCauseChess(kingCell, currentCell, king)) {
                    cells.push(currentCell);
                }
            }
        }
        if (j - 1 >= 0) {
            currentCell = getCell(kingCell.i, kingCell.j - 1);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell))
                cells.push(currentCell);
            else if (kingController(currentCell, currentColor) && !checkEmpty(currentCell)&& !isColor(currentCell,currentColor)) {
                if (!checkifCauseChess(kingCell, currentCell, king)) {
                    cells.push(currentCell);
                }
            }
        }
        if (i + 1 < size && j - 1 >= 0) {
            currentCell = getCell(kingCell.i + 1, kingCell.j - 1);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell))
                cells.push(currentCell);
            else if (kingController(currentCell, currentColor) && !checkEmpty(currentCell)&& !isColor(currentCell,currentColor)) {
                if (!checkifCauseChess(kingCell, currentCell, king)) {
                    cells.push(currentCell);
                }
            }
        }
        if (i - 1 >= 0) {
            currentCell = getCell(kingCell.i - 1, kingCell.j);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell))
                cells.push(currentCell);
            else if (kingController(currentCell, currentColor) && !checkEmpty(currentCell)&& !isColor(currentCell,currentColor)) {
                if (!checkifCauseChess(kingCell, currentCell, king)) {
                    cells.push(currentCell);
                }
            }
        }
        if (i + 1 < size) {
            currentCell = getCell(kingCell.i + 1, kingCell.j);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell)) {
                cells.push(currentCell);
            }
            else if (kingController(currentCell, currentColor) && !checkEmpty(currentCell)&& !isColor(currentCell,currentColor)) {
                if (!checkifCauseChess(kingCell, currentCell, king)) {
                    cells.push(currentCell);
                }
            }
        }
        if (i - 1 >= 0 && j + 1 < size) {
            currentCell = getCell(kingCell.i - 1, kingCell.j + 1);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell)) {
                cells.push(currentCell);
            }
            else if (kingController(currentCell, currentColor) && !checkEmpty(currentCell) && !isColor(currentCell,currentColor)) {
                if (!checkifCauseChess(kingCell, currentCell, king)) {
                    cells.push(currentCell);
                }
            }
        }
        if (j + 1 < size) {
            currentCell = getCell(kingCell.i, kingCell.j + 1);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell))
                cells.push(currentCell);
            else if (kingController(currentCell, currentColor) && !checkEmpty(currentCell)&& !isColor(currentCell,currentColor)) {
                if (!checkifCauseChess(kingCell, currentCell, king)) {
                    cells.push(currentCell);
                }
            }
        }
        if (i + 1 < size && j + 1 < size) {
            currentCell = getCell(kingCell.i + 1, kingCell.j + 1);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell))
                cells.push(currentCell);
            else if (kingController(currentCell, currentColor) && !checkEmpty(currentCell)&& !isColor(currentCell,currentColor)) {
                if (!checkifCauseChess(kingCell, currentCell, king)) {
                    cells.push(currentCell);
                }
            }
        }
        var legalMoves = cells.map(
            function (c) {
                return new Move(kingCell, c, king);
            });
        bp.log.info("King moves: " + legalMoves);
        bp.sync({request: legalMoves, waitFor: bp.Event("My Color Played")});
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//#endregion KingBehaviors

function checkifCauseChess(source, target, piece) {
    // bp.log.info("Enter func");
    return false;
    var ans = false;
    var kingCell;
    var tempPiece = {};
    if (isNonEmpty(target)) {
        if (isColor(target, Color.White)) {
            tempPiece.color = Color.White;
        }
        else {
            tempPiece.color = Color.Black;
        }
        if (isType(target, Type.Rook)) {
            tempPiece.type = Type.Rook;
        }
        tempPiece.id = 1;
        var realPiece = getPiece(tempPiece.color + "_" + tempPiece.type + "_" + tempPiece.id);
        bp.sync({
            request: CTX.Transaction(
                CTX.UpdateEvent("UpdateCell", {"cell": source, "piece": null}),
                CTX.UpdateEvent("UpdateCell", {"cell": target, "piece": piece}))
        });
        if (myColor.equals(Color.White)) {
            kingCell = getCellWithPiece(whiteKing);
        }
        else {
            kingCell = getCellWithPiece(blackKing);
        }

        if (!kingController(kingCell, myColor)) {
            ans = true;
        }
        bp.sync({
            request: CTX.Transaction(
                CTX.UpdateEvent("UpdateCell", {"cell": source, "piece": piece}),
                CTX.UpdateEvent("UpdateCell", {"cell": target, "piece": realPiece}))
        });
    }

    else {
        bp.sync({
            request: CTX.Transaction(
                CTX.UpdateEvent("UpdateCell", {"cell": source, "piece": null}),
                CTX.UpdateEvent("UpdateCell", {"cell": target, "piece": piece}))
        });
        if (myColor.equals(Color.White)) {
            kingCell = getCellWithPiece(whiteKing);
        }
        else {
            kingCell = getCellWithPiece(blackKing);
        }

        if (!kingController(kingCell, myColor)) {
            ans = true;
        }
        bp.sync({
            request: CTX.Transaction(
                CTX.UpdateEvent("UpdateCell", {"cell": source, "piece": piece}),
                CTX.UpdateEvent("UpdateCell", {"cell": target, "piece": null}))
        });
    }
    bp.log.info("Out Fun");
    return ans;
}

