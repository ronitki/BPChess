importPackage(Packages.il.ac.bgu.cs.bp.bpjs.Chess.events);
importPackage(Packages.il.ac.bgu.cs.bp.bpjs.context);
importPackage(Packages.il.ac.bgu.cs.bp.bpjs.Chess.context.schema);
importPackage(Packages.il.ac.bgu.cs.bp.bpjs.Chess.context.schema.piece);

//my engine color
var myColor;
//enemy engine color
var otherColor;
var blackKing;
var whiteKing;
//the best direction for KRK strategy
var bestDirection;

//#region HELP FUNCTIONS

//get a specific cell
function getCell(i, j) {
    if (i >= 0 && i < size && j >= 0 && j < size)
        return CTX.getContextsOfType("Cell(" + i + "," + j + ")").get(0);
    else
        return "null";
}
//get a cell with piece p
function getCellWithPiece(p) {
    try {
        return CTX.getContextsOfType("CellWithPiece(" + p + ")").get(0);
    } catch (e) {
        return null;
    }
}
//get piece p
function getPiece(p) {
    try {
        return CTX.getContextsOfType("SpecificPiece(" + p + ")").get(0);
    } catch (e) {
        return null;
    }
}
//get all cells with color c
function getCellWithColor(c) {
    try {
        return CTX.getContextsOfType("CellWithColor(" + c + ")");
    } catch (e) {
        return null;
    }
}
//get all cells with type t
function getCellWithType(t) {
    try {
        return CTX.getContextsOfType("CellWithType(" + t + ")");
    } catch (e) {
        return null;
    }
}
//get all non empty cells
function getNonEmpty() {
    try {
        return CTX.getContextsOfType("NonEmptyCell");
    } catch (e) {
        return null;
    }
}
//check if cell is not empty
function isNonEmpty(cell) {
    return getNonEmpty().contains(cell);
}
//check if cell is of type
function isType(cell, type) {
    return getCellWithType(type).contains(cell);
}
//check is cell is of color
function isColor(cell, color) {
    return getCellWithColor(color).contains(cell);
}
//translate number glitch
function translateChar(num) {
    return num - 48;
}
//get piece object from cell
function getRealPiece(cell) {
    var piece = {};
    if (getCellWithType(Type.King).contains(cell)) {
        piece.type = "King";
    }
    else if (getCellWithType(Type.Rook).contains(cell)) {
        piece.type = "Rook";
    }
    else {
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
//get cell's opposite color
function getOppositeColor(cell) {
    if (getCellWithColor(Color.Black).contains(cell))
        return Color.White;
    return Color.Black;
}
//get cell's color
function getColor(cell) {
    if (getCellWithColor(Color.Black).contains(cell))
        return Color.Black;
    return Color.White;
}
//check if 2 cell are in a diagonal
function checkDiagonal(cell1, cell2) {
    if (Math.abs(cell1.i - cell2.i) === Math.abs(cell1.j - cell2.j))
        return true;
    return false;
}
//junction 2 lists
function junctionList(list1, list2) {
    var ansList = [];
    for (var i = 0; i < list1.size(); i++) {
        if (list2.contains(list1.get(i))) {
            ansList.push(list1.get(i));
        }
    }
    return ansList;
}
//#endregion HELP FUNCTIONS

//#region King Help Function

//check attacks from enemies from right
function checkEnemiesFromRight(cell, color) {
    for (var i = cell.i + 1; i < size; i++) {
        var currentCell = getCell(i, cell.j);
        if (isNonEmpty(currentCell) && !(isType(currentCell, Type.King) && isColor(currentCell, color))) { //there's someone in the cell
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
//check attacks from enemies from left
function checkEnemiesFromLeft(cell, color) {
    for (var i = cell.i - 1; i >= 0; i--) {
        var currentCell = getCell(i, cell.j);
        if (isNonEmpty(currentCell) && !(isType(currentCell, Type.King) && isColor(currentCell, color))) { //there's someone in the cell
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
//check attacks from enemies from up
function checkEnemiesFromUp(cell, color) {
    for (var j = cell.j + 1; j < size; j++) {
        var currentCell = getCell(cell.i, j);
        if (isNonEmpty(currentCell) && !(isType(currentCell, Type.King) && isColor(currentCell, color))) { //there's someone in the cell
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
//check attacks from enemies from down
function checkEnemiesFromDown(cell, color) {
    for (var j = cell.j - 1; j >= 0; j--) {
        var currentCell = getCell(cell.i, j);
        if (isNonEmpty(currentCell) && !(isType(currentCell, Type.King) && isColor(currentCell, color))) { //there's someone in the cell
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
//check attacks from enemies from up-right
function checkEnemiesFromUpRight(cell, color) {
    for (var i = cell.i + 1, j = cell.j + 1; j < size && i < size; j++, i++) {
        var currentCell = getCell(i, j);
        if (isNonEmpty(currentCell) && !(isType(currentCell, Type.King) && isColor(currentCell, color))) { //there's someone in the cell
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
//check attacks from enemies from up-left
function checkEnemiesFromUpLeft(cell, color) {
    for (var i = cell.i - 1, j = cell.j + 1; j < size && i >= 0; j++, i--) {
        var currentCell = getCell(i, j);
        if (isNonEmpty(currentCell) && !(isType(currentCell, Type.King) && isColor(currentCell, color))) { //there's someone in the cell
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
//check attacks from enemies from down-right
function checkEnemiesFromDownRight(cell, color) {
    for (var i = cell.i + 1, j = cell.j - 1; j >= 0 && i < size; j--, i++) {
        var currentCell = getCell(i, j);
        if (isNonEmpty(currentCell) && !(isType(currentCell, Type.King) && isColor(currentCell, color))) { //there's someone in the cell
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
//check attacks from enemies from down-left
function checkEnemiesFromDownLeft(cell, color) {
    for (var i = cell.i - 1, j = cell.j - 1; j >= 0 && i >= 0; j--, i--) {
        var currentCell = getCell(i, j);
        if (isNonEmpty(currentCell) && !(isType(currentCell, Type.King) && isColor(currentCell, color))) { //there's someone in the cell
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
//check attacks from knights
function checkKnightsAttacks(cell, color) {
    var knights = [];
    knights.push(getCell(cell.i + 1, cell.j + 2));
    knights.push(getCell(cell.i + 1, cell.j - 2));
    knights.push(getCell(cell.i - 1, cell.j + 2));
    knights.push(getCell(cell.i - 1, cell.j - 2));
    knights.push(getCell(cell.i + 2, cell.j + 1));
    knights.push(getCell(cell.i + 2, cell.j - 1));
    knights.push(getCell(cell.i - 2, cell.j + 1));
    knights.push(getCell(cell.i - 2, cell.j - 1));

    for (var i = 0; i < knights.length; i++) {
        if ((knights[i] !== "null") && (isType(knights[i], Type.Knight) && !isColor(knights[i], color)))
            return true;
    }

    return false;
}
//check if current cell is safe for the king
function kingController(currentCell, currentColor) {
    return (!checkEnemiesFromRight(currentCell, currentColor) && !checkEnemiesFromLeft(currentCell, currentColor) && !checkEnemiesFromUp(currentCell, currentColor) && !checkEnemiesFromDown(currentCell, currentColor) && !checkEnemiesFromUpLeft(currentCell, currentColor) && !checkEnemiesFromUpRight(currentCell, currentColor) && !checkEnemiesFromDownLeft(currentCell, currentColor) && !checkEnemiesFromDownRight(currentCell, currentColor) && !checkKnightsAttacks(currentCell, currentColor));
}
//#endregion King Help Function

//region KRK HELP FUNCTIONS

//get king cell, if isEnemy is true return enemy king else our king
function getKingCell(isEnemy) {
    var KingCell;
    if (myColor.equals(Color.White)) {
        if (isEnemy)
            KingCell = getCellWithPiece(blackKing);
        else
            KingCell = getCellWithPiece(whiteKing);
    }
    else {
        if (isEnemy)
            KingCell = getCellWithPiece(whiteKing);
        else
            KingCell = getCellWithPiece(blackKing);
    }
    return KingCell;
}
//check is rook in danger
function isRookInDanger(targetCell) {
    var enemyKingCell = getKingCell(true);
    var myKingCell = getKingCell(false);
    if (Math.abs(targetCell.i - enemyKingCell.i) <= 1 && Math.abs(targetCell.j - enemyKingCell.j) <= 1) {
        if (Math.abs(targetCell.i - myKingCell.i) <= 1 && Math.abs(targetCell.j - myKingCell.j) <= 1) {
            return false;
        }
        return true;
    }
    return false;
}
//calculate best direction
function getBestDirection() {
    var enemyKingCell = getKingCell(true);
    var right = 7 - enemyKingCell.i;
    var left = enemyKingCell.i;
    var up = 7 - enemyKingCell.j;
    var down = enemyKingCell.j;
    var min = right;
    var minName = "right";
    if (min > left) {
        min = left;
        minName = "left";
    }
    if (min > up) {
        min = up;
        minName = "up";
    }
    if (min > down) {
        min = down;
        minName = "down";
    }
    return minName;
}
//check if the 2 kings are opposite one to other
function areKingsOpposite() {
    var myKing = getKingCell(false);
    var enemyKing = getKingCell(true);
    var colDistance = Math.abs(myKing.i - enemyKing.i);
    var rowDistance = Math.abs(myKing.j - enemyKing.j);
    if ((colDistance === 0 && rowDistance === 2) || (colDistance === 2 && rowDistance === 0)) {
        if (bestDirection === "right") {
            if (myKing.i < enemyKing.i)
                return true;
        }
        else if (bestDirection === "left") {
            if (myKing.i > enemyKing.i)
                return true;
        }
        else if (bestDirection === "up") {
            if (myKing.j < enemyKing.j)
                return true;
        }
        else if (bestDirection === "down") {
            if (myKing.j > enemyKing.j)
                return true;
        }
    }
    return false;
}
//check if the rook is near to the opposite king
function isRookNearToTheKing(rook) {
    var enemyKing = getKingCell(true);
    var colDistance = Math.abs(rook.i - enemyKing.i);
    var rowDistance = Math.abs(rook.j - enemyKing.j);

    if (colDistance === 1 || rowDistance === 1) {
        return true;
    }
    return false;
}
//check if piece in cell is in the best direction
function isInDirection(cell) {
    var enemyKing = getKingCell(true);
    if (bestDirection === ("right")) {
        if (cell.i < enemyKing.i)
            return true;
    }
    else if (bestDirection === ("left")) {
        if (cell.i > enemyKing.i)
            return true;
    }
    else if (bestDirection === ("up")) {
        if (cell.j < enemyKing.j)
            return true;
    }
    else if (bestDirection === ("down")) {
        if (cell.j > enemyKing.j)
            return true;
    }
    return false;
}
//detect if the game state is KRK
function DetectKRKEndGame() {
    if (getCellWithColor(otherColor).size() > 1)
        return false;
    if (getCellWithColor(myColor).size() !== 2)
        return false;
    if (junctionList(getCellWithColor(myColor), getCellWithType(Type.Rook)).length !== 1)
        return false;

    return true;


}
//#endregion KRK HELP FUNCTIONS

//#region GameRules

//Enforce that white play one time and then black one
bp.registerBThread("EnforceTurns", function () {
    bp.sync({waitFor: bp.Event("init_end")});
    while (true) {
        bp.sync({waitFor: Move.ColorMoveEventSet(Color.White), block: Move.ColorMoveEventSet(Color.Black)});
        bp.sync({waitFor: Move.ColorMoveEventSet(Color.Black), block: Move.ColorMoveEventSet(Color.White)});
    }
});
//updates the db after a move happens
bp.registerBThread("UpdateBoardOnMove", function () {
    bp.sync({waitFor: bp.Event("init_end")});
    while (true) {
        var move = bp.sync({waitFor: Move.AnyMoveEventSet()});
        var target = (Cell)((Move)(move).target);
        if (isNonEmpty(target)) {
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
//wait db to finish update and then announce
bp.registerBThread("Wait For Database to be updated", function () {
    bp.sync({waitFor: bp.Event("init_end")});
    while (true) {
        var toWait;
        var i = 0;
        var move = bp.sync({waitFor: [bp.Event("Update Started-Eat"), bp.Event("Update Started-Move")]});
        if (move.name.equals("Update Started-Eat")) {
            toWait = 9;
        }
        else {
            toWait = 10;
        }
        while (i < toWait) {
            bp.sync({waitFor: Move.ContextEventSet()});
            i++;
        }
        bp.sync({request: bp.Event("Update Ended")});
    }
});
//execute the enemy engine move
bp.registerBThread("GetEngineMove", function () {
    bp.sync({waitFor: bp.Event("init_end")});
    while (true) {
        var input = bp.sync({waitFor: Move.EngineEventSet()}).name.split("-")[1];
        var i = translateChar(input.charAt(0));
        var j = translateChar(input.charAt(1));
        var cell = getCell(i, j);
        var piece = getRealPiece(cell);
        bp.sync({request: new Move(new Cell(i, j), new Cell(translateChar(input.charAt(2)), translateChar(input.charAt(3))), piece)});
    }
});
//get our color at the beggining of the game
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
//block piece move to the same place
bp.registerBThread("block moving to the same place", function () {
    bp.sync({waitFor: bp.Event("init_end")});
    bp.sync({block: Move.SamePlaceMoveEventSet()});
});
//block piece move out of the board
bp.registerBThread("block out of board moves", function () {
    bp.sync({waitFor: bp.Event("init_end")});
    bp.sync({block: Move.OutOfBoardMoveEventSet()});
});
//announce the enemy engine played
bp.registerBThread("announce engine played", function () {
    bp.sync({waitFor: bp.Event("Color was updated")});
    bp.sync({waitFor: bp.Event("init_end")});
    while (true) {
        bp.sync({waitFor: Move.ColorMoveEventSet(otherColor)});
        bp.sync({waitFor: bp.Event("Update Ended")});
        bp.sync({request: bp.Event("EnginePlayed")});
    }
});
//announce our engine played
bp.registerBThread("announce our engine played", function () {
    bp.sync({waitFor: bp.Event("Color was updated")});
    bp.sync({waitFor: bp.Event("init_end")});
    while (true) {
        bp.sync({waitFor: Move.ColorMoveEventSet(myColor)});
        bp.sync({waitFor: bp.Event("Update Ended")});
        bp.sync({request: bp.Event("My Color Played")});
    }

});
//delete piece once it is eaten from db
bp.registerBThread("delete piece upon eating", function () {
    bp.sync({waitFor: bp.Event("init_end")});
    while (true) {
        var move = bp.sync({waitFor: Move.AnyMoveEventSet()});
        var target = (Cell)((Move)(move).target);
        if (isNonEmpty(target)) {
            var piece = getRealPiece(target);
            bp.sync({request: CTX.UpdateEvent("DeletePiece", {"p": piece})})
        }
    }
});
//block all piece's moves once it is eaten
CTX.subscribe("Kill piece", "piece", function (p) {
    bp.sync({waitFor: bp.Event("init_end")});
    bp.sync({waitFor: CTX.ContextEndedEvent("Piece", p)});
    bp.sync({block: Move.PieceMoveEventSet(p)});
});
//#endregion GameRules

//#region KRK Strategy

//Detect If the Kings are opposite after K and R are in position
bp.registerBThread("DetectIfKingOpposite", function () {
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    bp.sync({request: bp.Event("Direction was updated")});
    while (true) {
        bp.sync({waitFor: [bp.Event("The rook is placed"), bp.Event("The king is placed")]});
        bp.sync({waitFor: [bp.Event("The rook is placed"), bp.Event("The king is placed")]});
        if (areKingsOpposite())
            bp.sync({request: bp.Event("Kings are opposite")});
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//After game starts choose best direction to push the king
bp.registerBThread("AnnounceBestDirection", function () {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    bp.sync({waitFor: bp.Event("KRK Started")});
    bestDirection = getBestDirection();
    bp.sync({request: bp.Event("Direction was updated")});
});
//detect the game's state is KRK
bp.registerBThread("DetectKRKStrategy", function () {
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});

    while (true) {
        if (DetectKRKEndGame())
            bp.sync({request: bp.Event("KRK Started")});
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//#endregion KRK Strategy

//#region KRK Rook Strategy

//Wait until the rook is in position
CTX.subscribe("WaitForRookInDirection", "Rook", function (rook) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    bp.sync({waitFor: bp.Event("Direction was updated")});
    while (true) {
        var rookCell = getCellWithPiece(rook);
        if (rookCell == null) { // If the piece is not on board
            break;
        }
        if (isColor(rookCell, otherColor)) {
            break;
        }
        if (isInDirection(rookCell)) {
            bp.sync({request: bp.Event("The rook is placed")});
        }
        else {
            bp.sync({request: bp.Event("The rook isn't placed")});
        }
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//ask in high priority the rook to move to the correct position
CTX.subscribe("AskRookGoToBestDirection", "Rook", function (rook) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    bp.sync({waitFor: bp.Event("Direction was updated")});
    while (true) {
        bp.sync({waitFor: bp.Event("The rook isn't placed")});
        var rookCell = getCellWithPiece(rook);
        var enemyKing = getKingCell(true);
        if (rookCell == null) { // If the piece is not on board
            break;
        }
        if (isColor(rookCell, otherColor)) {
            break;
        }
        var requests = [];
        if (bestDirection === ("right")) {
            for (var i = enemyKing.i - 1; i >= 0; i--) {
                requests.push(getCell(i, rookCell.j));

            }
        }
        else if (bestDirection === ("left")) {
            for (var i = enemyKing.i + 1; i < size; i++) {
                requests.push(getCell(i, rookCell.j));
            }
        }
        else if (bestDirection === ("up")) {
            for (var j = enemyKing.j - 1; j >= 0; j--) {
                requests.push(getCell(rookCell.i, j));
            }

        }
        else if (bestDirection === ("down")) {
            for (var j = enemyKing.j + 1; j < size; j++) {
                requests.push(getCell(rookCell.i, j));
            }
        }
        var legalMovesToRequest = requests.map(function (c) {
            return new Move(rookCell, c, rook);
        });
        bp.sync({request: legalMovesToRequest, waitFor: bp.Event("My Color Played")}, 90);
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//when the rook is both in position and in distance 1 from the enemy king
CTX.subscribe("AnnounceNearToTheKing", "Rook", function (rook) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    bp.sync({waitFor: bp.Event("Direction was updated")});
    while (true) {
        bp.sync({waitFor: bp.Event("The rook is placed")});
        var rookCell = getCellWithPiece(rook);
        if (rookCell == null) { // If the piece is not on board
            break;
        }
        if (isColor(rookCell, otherColor)) {
            break;
        }
        if (isRookNearToTheKing(rookCell)) {
            bp.sync({request: bp.Event("The rook is near")});
        }
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//when the rook is already in position, ask in high priority to push the king
CTX.subscribe("AskRookGoingToTheOpposite", "Rook", function (rook) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    bp.sync({waitFor: bp.Event("Direction was updated")});
    while (true) {
        bp.sync({waitFor: bp.Event("The rook is placed")});
        var rookCell = getCellWithPiece(rook);
        var enemyKing = getKingCell(true);
        if (rookCell == null) { // If the piece is not on board
            break;
        }
        if (isColor(rookCell, otherColor)) {
            break;
        }
        var request = [];
        if (bestDirection === ("left")) {
            for (var i = rookCell.i - 1; i > enemyKing.i; i--) {
                request.push(getCell(i, rookCell.j));
            }

        }
        else if (bestDirection === ("right")) {
            for (var i = rookCell.i + 1; i < enemyKing.i; i++) {
                request.push(getCell(i, rookCell.j));
            }
        }
        else if (bestDirection === ("down")) {
            for (var j = rookCell.j - 1; j > enemyKing.j; j--) {
                request.push(getCell(rookCell.i, j));
            }
        }
        else if (bestDirection === ("up")) {
            for (var j = rookCell.j + 1; j < enemyKing.j; j++) {
                request.push(getCell(rookCell.i, j));
            }
        }
        var legalMovesToRequest = request.map(function (c) {
            return new Move(rookCell, c, rook);
        });
        bp.sync({request: legalMovesToRequest, waitFor: bp.Event("My Color Played")}, 90);
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
// when in position, and rook is near the enemy king, stay in the row/col
CTX.subscribe("AskRookNotToGoBack", "Rook", function (rook) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    bp.sync({waitFor: bp.Event("Direction was updated")});
    while (true) {
        bp.sync({waitFor: bp.Event("The rook is placed")});
        bp.sync({waitFor: bp.Event("The rook is near")});
        var rookCell = getCellWithPiece(rook);
        if (rookCell == null) { // If the piece is not on board
            break;
        }
        if (isColor(rookCell, otherColor)) {
            break;
        }
        var request = [];
        if (bestDirection === ("right") || bestDirection === ("left")) {
            for (var j = 0; j < size; j++) {
                request.push(getCell(rookCell.i, j));
            }

        }
        else if (bestDirection === ("up") || bestDirection === ("down")) {
            for (var i = 0; i < size; i++) {
                request.push(getCell(i, rookCell.j));
            }
        }
        var legalMovesToRequest = request.map(function (c) {
            return new Move(rookCell, c, rook);
        });
        bp.sync({request: legalMovesToRequest, waitFor: bp.Event("My Color Played")}, 90);
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//block rook from choosing a move that can cause him to be eaten
CTX.subscribe("BlockRookFromBeingEaten", "Rook", function (rook) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    while (true) {
        var rookCell = getCellWithPiece(rook);
        if (rookCell == null) { // If the piece is not on board
            break;
        }
        if (isColor(rookCell, otherColor)) {
            break;
        }
        var movesToBlock = [];
        //left
        for (var i = rookCell.i - 1; i >= 0; i--) {
            if (isRookInDanger(getCell(i, rookCell.j))) {
                movesToBlock.push(getCell(i, rookCell.j));
            }
        }
        //right
        for (var i = rookCell.i + 1; i < size; i++) {
            if (isRookInDanger(getCell(i, rookCell.j))) {
                movesToBlock.push(getCell(i, rookCell.j));
            }
        }
        //down
        for (var j = rookCell.j - 1; j >= 0; j--) {
            if (isRookInDanger(getCell(rookCell.i, j))) {
                movesToBlock.push(getCell(rookCell.i, j));
            }
        }
        //up
        for (var j = rookCell.j + 1; j < size; j++) {
            if (isRookInDanger(getCell(rookCell.i, j))) {
                movesToBlock.push(getCell(rookCell.i, j));
            }
        }

        var illegalMovesToBlock = movesToBlock.map(function (c) {
            return new Move(rookCell, c, rook);
        });
        bp.sync({block: illegalMovesToBlock, waitFor: bp.Event("My Color Played")});
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//block moves the could make my king block my rook
CTX.subscribe("BlockRookFromBeBehindTheKing", "Rook", function (rook) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    while (true) {
        var rookCell = getCellWithPiece(rook);
        // If the piece is not on board
        if (rookCell == null) {
            break;
        }
        if (isColor(rookCell, otherColor)) {
            break;
        }
        var myking = getKingCell(false);
        var enemyking = getKingCell(true);
        if (bestDirection === "left") {
            if (myking.i - 1 === enemyking.i) {
                if ((rookCell.j < myking.j && myking.j < enemyking.j) || (rookCell.j > myking.j && myking.j > enemyking.j)) {
                    bp.sync({
                        block: new Move(rookCell, getCell(enemyking.i + 1, rookCell.j), rook),
                        waitFor: bp.Event("My Color Played")
                    });
                }
            }
        }
        else if (bestDirection === "right") {
            if (myking.i + 1 === enemyking.i) {
                if ((rookCell.j < myking.j && myking.j < enemyking.j) || (rookCell.j > myking.j && myking.j > enemyking.j)) {
                    bp.sync({
                        block: new Move(rookCell, getCell(enemyking.i - 1, rookCell.j), rook),
                        waitFor: bp.Event("My Color Played")
                    });
                }
            }
        }
        else if (bestDirection === "up") {
            if (myking.j + 1 === enemyking.j) {
                if ((rookCell.i < myking.i && myking.i < enemyking.i) || (rookCell.i > myking.i && myking.i > enemyking.i)) {
                    bp.sync({
                        block: new Move(rookCell, getCell(rookCell.i, enemyking.j - 1), rook),
                        waitFor: bp.Event("My Color Played")
                    });
                }
            }
        }
        else if (bestDirection === "down") {
            if (myking.j - 1 === enemyking.j) {
                if ((rookCell.i < myking.i && myking.i < enemyking.i) || (rookCell.i > myking.i && myking.i > enemyking.i)) {
                    bp.sync({
                        block: new Move(rookCell, getCell(rookCell.i, enemyking.j + 1), rook),
                        waitFor: bp.Event("My Color Played")
                    });
                }
            }
        }
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//when rook and king in position, ask in very high priority the rook to cause chess
CTX.subscribe("AskRookToChess", "Rook", function (rook) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    bp.sync({waitFor: bp.Event("Direction was updated")});
    while (true) {
        bp.sync({waitFor: bp.Event("The rook is placed")});
        bp.sync({waitFor: bp.Event("Kings are opposite")});
        var rookCell = getCellWithPiece(rook);
        if (rookCell == null) { // If the piece is not on board
            break;
        }
        if (isColor(rookCell, otherColor)) {
            break;
        }
        var enemyKing = getKingCell(true);
        if (bestDirection === ("right") || bestDirection === ("left")) {
            bp.sync({
                request: new Move(rookCell, getCell(enemyKing.i, rookCell.j), rook),
                waitFor: bp.Event("My Color Played")
            }, 100);
        }
        else if (bestDirection === ("up") || bestDirection === ("down")) {
            bp.sync({
                request: new Move(rookCell, getCell(rookCell.i, enemyKing.j), rook),
                waitFor: bp.Event("My Color Played")
            }, 100);
        }
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//when the rook is in position, ask in 95 priority to come as close as possible to the enemy king
CTX.subscribe("AskRookToBeNear", "Rook", function (rook) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    bp.sync({waitFor: bp.Event("Direction was updated")});
    while (true) {
        bp.sync({waitFor: bp.Event("The rook is placed")});
        var rookCell = getCellWithPiece(rook);
        if (rookCell == null) { // If the piece is not on board
            break;
        }
        if (isColor(rookCell, otherColor)) {
            break;
        }
        var enemyKing = getKingCell(true);
        if (bestDirection === "right") {
            bp.sync({
                request: new Move(rookCell, getCell(enemyKing.i - 1, rookCell.j), rook),
                waitFor: bp.Event("My Color Played")
            }, 95);
        }
        else if (bestDirection === ("left")) {
            bp.sync({
                request: new Move(rookCell, getCell(enemyKing.i + 1, rookCell.j), rook),
                waitFor: bp.Event("My Color Played")
            }, 95);
        }
        else if (bestDirection === ("up")) {
            bp.sync({
                request: new Move(rookCell, getCell(rookCell.i, enemyKing.j - 1), rook),
                waitFor: bp.Event("My Color Played")
            }, 95);
        }
        else if (bestDirection === ("down")) {
            bp.sync({
                request: new Move(rookCell, getCell(rookCell.i, enemyKing.j + 1), rook),
                waitFor: bp.Event("My Color Played")
            }, 95);
        }
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//when rook in danger' block king from moving
CTX.subscribe("DetectRookInDanger", "Rook", function (rook) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    bp.sync({waitFor: bp.Event("Direction was updated")});
    while (true) {
        var move;
        var rookCell = getCellWithPiece(rook);
        if (rookCell == null) { // If the piece is not on board
            break;
        }
        if (isColor(rookCell, otherColor)) {
            break;
        }
        var myKing = getKingCell(false);
        if (isRookInDanger(rookCell)) {
            bp.sync({block: Move.PieceMoveEventSet(getRealPiece(myKing)), waitFor: bp.Event("My Color Played")});
        }
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//#endregion KRK Rook Strategy

//#region KRK King Strategy

//request king to move to the enemy king's direction
function requestKingsCorners(kingCell, enemyKing) {
    var requests = [];
    if (bestDirection === ("right")) {
        requests = fillLeftOrRightCorner(kingCell, enemyKing, requests, 1);
    }
    else if (bestDirection === ("left")) {
        requests = fillLeftOrRightCorner(kingCell, enemyKing, requests, -1);
    }
    else if (bestDirection === ("down")) {
        requests = fillUpOrDownCorner(kingCell, enemyKing, requests, -1);
    }
    else if (bestDirection === ("up")) {
        requests = fillUpOrDownCorner(kingCell, enemyKing, requests, 1);
    }
    var ans = [];
    for (var i = 0; i < requests.length; i++) {
        if (requests[i] !== "null")
            ans.push(requests[i]);
    }

    return ans;
}
//fills all the cells in left or right corners directions
function fillLeftOrRightCorner(kingCell, enemyKing, requests, number) {
    if (kingCell.j < enemyKing.j) {
        requests.push(getCell(kingCell.i, kingCell.j + 1));
        requests.push(getCell(kingCell.i + number, kingCell.j + 1));
        requests.push(getCell(kingCell.i + number, kingCell.j));
    }
    else if (kingCell.j > enemyKing.j) {
        requests.push(getCell(kingCell.i + number, kingCell.j - 1));
        requests.push(getCell(kingCell.i, kingCell.j - 1));
        requests.push(getCell(kingCell.i + number, kingCell.j));
    }
    else {
        requests.push(getCell(kingCell.i + number, kingCell.j));
        requests.push(getCell(kingCell.i + number, kingCell.j + 1));
        requests.push(getCell(kingCell.i + number, kingCell.j - 1));
    }
    return requests;
}
//fills all the cells in up or down corners directions
function fillUpOrDownCorner(kingCell, enemyKing, requests, number) {
    if (kingCell.i < enemyKing.i) {
        requests.push(getCell(kingCell.i, kingCell.j + number));
        requests.push(getCell(kingCell.i + 1, kingCell.j + number));
        requests.push(getCell(kingCell.i + 1, kingCell.j));
    }
    else if (kingCell.i > enemyKing.i) {
        requests.push(getCell(kingCell.i - 1, kingCell.j));
        requests.push(getCell(kingCell.i - 1, kingCell.j + number));
        requests.push(getCell(kingCell.i, kingCell.j + number));
    }
    else {
        requests.push(getCell(kingCell.i, kingCell.j + number));
        requests.push(getCell(kingCell.i + 1, kingCell.j + number));
        requests.push(getCell(kingCell.i - 1, kingCell.j + number));
    }
    return requests;
}
//wait until the king is in position
CTX.subscribe("WaitForKingInDirection", "King", function (king) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    bp.sync({waitFor: bp.Event("Direction was updated")});
    while (true) {
        var kingCell = getCellWithPiece(king);
        if (kingCell == null) { // If the piece is not on board
            break;
        }
        if (isColor(kingCell, otherColor)) {
            break;
        }
        if (isInDirection(kingCell)) {
            bp.sync({request: bp.Event("The king is placed")});
        }
        else {
            bp.sync({request: bp.Event("The king isn't placed")});
        }
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//ask king in high priority to go to the correct direction
CTX.subscribe("AskKingGoToBestDirection", "King", function (king) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    bp.sync({waitFor: bp.Event("Direction was updated")});
    while (true) {
        bp.sync({waitFor: bp.Event("The king isn't placed")});
        var kingCell = getCellWithPiece(king);
        var enemyKing = getKingCell(true);
        if (kingCell == null) { // If the piece is not on board
            break;
        }
        if (isColor(kingCell, otherColor)) {
            break;
        }
        var requests = [];
        if (bestDirection === ("right")) {
            requests=fillKingDirectionLeftOrRight(kingCell,requests,-1);
        }
        else if (bestDirection === ("left")) {
            requests=fillKingDirectionLeftOrRight(kingCell,requests,1);
        }
        else if (bestDirection === ("down")) {
            requests=fillKingDirectionUpOrDown(kingCell,requests,1);
        }
        else if (bestDirection === ("up")) {
            requests=fillKingDirectionUpOrDown(kingCell,requests,-1);
        }
        var legalMovesToRequest = requests.map(function (c) {
            if (c !== "null")
                return new Move(kingCell, c, king);
        });
        var _legalMovesToRequest = legalMovesToRequest.filter(function (c) {
            return c != null;
        });
        bp.sync({request: _legalMovesToRequest, waitFor: bp.Event("My Color Played")}, 90);
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//fills all the cells in left or right directions
function fillKingDirectionLeftOrRight(kingCell, requests, number) {
    requests.push(getCell(kingCell.i + number, kingCell.j));
    requests.push(getCell(kingCell.i + number, kingCell.j + 1));
    requests.push(getCell(kingCell.i + number, kingCell.j - 1));
    return requests;
}
//fills all the cells in up or down directions
function fillKingDirectionUpOrDown(kingCell, requests, number) {
    requests.push(getCell(kingCell.i, kingCell.j + number));
    requests.push(getCell(kingCell.i + 1, kingCell.j + number));
    requests.push(getCell(kingCell.i - 1, kingCell.j + number));
    return requests;
}
//when in position, ask for the moves that make you closer to the enemy king
CTX.subscribe("AskKingToGoCloseToTheEnemyKing", "King", function (king) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    bp.sync({waitFor: bp.Event("Direction was updated")});
    while (true) {
        bp.sync({waitFor: bp.Event("The king is placed")});
        var high = false;
        var kingCell = getCellWithPiece(king);
        var enemyKing = getKingCell(true);
        if (kingCell == null) { // If the piece is not on board
            break;
        }
        if (isColor(kingCell, otherColor)) {
            break;
        }
        var requests = requestKingsCorners(kingCell, enemyKing);

        var legalMovesToRequest = requests.map(function (c) {
            return new Move(kingCell, c, king);
        });

        bp.sync({request: legalMovesToRequest, waitFor: bp.Event("My Color Played")}, 90);
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//make sure that king doesnt block the rooks way, when both in position
CTX.subscribe("BlockKingToBlockTheRook", "King", function (king) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    bp.sync({waitFor: bp.Event("Direction was updated")});
    while (true) {
        // bp.sync({waitFor: bp.Event("The king is placed")});
        var myPieces = getCellWithColor(myColor);
        var rooks = getCellWithType(Type.Rook);
        var myRook = junctionList(myPieces, rooks)[0];
        var kingCell = getCellWithPiece(king);
        var enemyKing = getKingCell(true);
        if (kingCell == null) { // If the piece is not on board
            break;
        }
        if (isColor(kingCell, otherColor)) {
            break;
        }
        if (!myRook) {
            break;
        }
        var movesToBlock = [];
        if (bestDirection === ("right") || bestDirection === ("left")) {
            if (myRook.j > enemyKing.j && kingCell.j <= myRook.j && kingCell.j > enemyKing.j) {
                movesToBlock.push(getCell(myRook.i, kingCell.j - 1));
                movesToBlock.push(getCell(myRook.i, kingCell.j));
                movesToBlock.push(getCell(myRook.i, kingCell.j + 1));
            }
            if (myRook.j < enemyKing.j && kingCell.j >= myRook.j && kingCell.j < enemyKing.j) {
                movesToBlock.push(getCell(myRook.i, kingCell.j + 1));
                movesToBlock.push(getCell(myRook.i, kingCell.j));
                movesToBlock.push(getCell(myRook.i, kingCell.j - 1));
            }
        }
        else if (bestDirection === ("up") || bestDirection === ("down")) {
            if (myRook.i > enemyKing.i && kingCell.i <= myRook.i && kingCell.i > enemyKing.i) {
                movesToBlock.push(getCell(kingCell.i - 1, myRook.j));
                movesToBlock.push(getCell(kingCell.i, myRook.j));
                movesToBlock.push(getCell(kingCell.i + 1, myRook.j));
            }
            if (myRook.i < enemyKing.i && kingCell.i >= myRook.i && kingCell.i < enemyKing.i) {
                movesToBlock.push(getCell(kingCell.i + 1, myRook.j));
                movesToBlock.push(getCell(kingCell.i, myRook.j));
                movesToBlock.push(getCell(kingCell.i - 1, myRook.j));
            }
        }
        var illegalMovesToBlock = movesToBlock.map(function (c) {
            if (c !== "null")
                return new Move(kingCell, c, king);
        });
        var _illegalMovesToBlock = illegalMovesToBlock.filter(function (c) {
            return c != null;
        });
        bp.sync({block: _illegalMovesToBlock, waitFor: bp.Event("My Color Played")});
        bp.sync({waitFor: bp.Event("EnginePlayed")});

    }
});
//never leave our rook undefended
CTX.subscribe("BlockKingFromLeavingTheRookUndefended", "King", function (king) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    bp.sync({waitFor: bp.Event("Direction was updated")});
    while (true) {
        var myPieces = getCellWithColor(myColor);
        var rooks = getCellWithType(Type.Rook);
        var myRook = junctionList(myPieces, rooks)[0];
        var kingCell = getCellWithPiece(king);
        var enemyKing = getKingCell(true);
        if (kingCell == null) { // If the piece is not on board
            break;
        }
        if (isColor(kingCell, otherColor)) {
            break;
        }
        if (!myRook) {
            break;
        }
        var movesToBlock = [];
        if (Math.abs(myRook.i - enemyKing.i) <= 1 && Math.abs(myRook.j - enemyKing.j) <= 1) {
            if (Math.abs(myRook.i - kingCell.i) <= 1 && Math.abs(myRook.j - kingCell.j) <= 1) {
                bp.sync({block: Move.PieceMoveEventSet(king), waitFor: bp.Event("My Color Played")});
            }
        }
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//when in position, block our king from going opposite to the enemy king
CTX.subscribe("BlockKingGoingToTheOppositeToTheKing", "King", function (king) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    bp.sync({waitFor: bp.Event("Direction was updated")});
    while (true) {
        bp.sync({waitFor: bp.Event("The king is placed")});
        var kingCell = getCellWithPiece(king);
        var enemyCell = getKingCell(true);
        if (kingCell == null) { // If the piece is not on board
            break;
        }
        if (isColor(kingCell, otherColor)) {
            break;
        }
        var movesToBlock = [];
        if (bestDirection === ("right")) {
            bp.sync({
                block: new Move(kingCell, getCell(enemyCell.i - 2, enemyCell.j), king),
                waitFor: bp.Event("My Color Played")
            });
        }
        else if (bestDirection === ("left")) {
            bp.sync({
                block: new Move(kingCell, getCell(enemyCell.i + 2, enemyCell.j), king),
                waitFor: bp.Event("My Color Played")
            });
        }
        else if (bestDirection === ("up")) {
            bp.sync({
                block: new Move(kingCell, getCell(enemyCell.i, enemyCell.j - 2), king),
                waitFor: bp.Event("My Color Played")
            });
        }
        else if (bestDirection === ("down")) {
            bp.sync({
                block: new Move(kingCell, getCell(enemyCell.i, enemyCell.j + 2), king),
                waitFor: bp.Event("My Color Played")
            });
        }
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//block king from being right next to the king
CTX.subscribe("BlockKingGoingToTheBeforeLastOneRow", "King", function (king) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    bp.sync({waitFor: bp.Event("Direction was updated")});
    while (true) {
        bp.sync({waitFor: bp.Event("The king is placed")});
        var kingCell = getCellWithPiece(king);
        var enemyKing = getKingCell(true);
        if (kingCell == null) { // If the piece is not on board
            break;
        }
        if (isColor(kingCell, otherColor)) {
            break;
        }
        var movesToBlock = [];
        if (bestDirection === "left") {
            movesToBlock.push(getCell(1, kingCell.j));
            movesToBlock.push(getCell(1, kingCell.j - 1));
            movesToBlock.push(getCell(1, kingCell.j + 1));
        }
        if (bestDirection === "right") {
            movesToBlock.push(getCell(6, kingCell.j));
            movesToBlock.push(getCell(6, kingCell.j - 1));
            movesToBlock.push(getCell(6, kingCell.j + 1));
        }
        if (bestDirection === "down") {
            movesToBlock.push(getCell(kingCell.i, 1));
            movesToBlock.push(getCell(kingCell.i + 1, 1));
            movesToBlock.push(getCell(kingCell.i - 1, 1));
        }
        if (bestDirection === "up") {
            movesToBlock.push(getCell(kingCell.i, 6));
            movesToBlock.push(getCell(kingCell.i + 1, 6));
            movesToBlock.push(getCell(kingCell.i - 1, 6));
        }
        var illegalMovesToBlock = movesToBlock.map(function (c) {
            if (c !== "null")
                return new Move(kingCell, c, king);
        });
        var _illegalMovesToBlock = illegalMovesToBlock.filter(function (c) {
            return c != null;
        });
        bp.sync({block: _illegalMovesToBlock, waitFor: bp.Event("My Color Played")});
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//ask the king to come close to the enemy king
CTX.subscribe("AskKingToCloseOnTheEnemy", "King", function (king) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    bp.sync({waitFor: bp.Event("Direction was updated")});
    while (true) {
        bp.sync({waitFor: bp.Event("The king is placed")});
        bp.sync({waitFor: bp.Event("The rook is near")});
        var kingCell = getCellWithPiece(king);
        var enemyKing = getKingCell(true);
        if (kingCell == null) { // If the piece is not on board
            break;
        }
        if (isColor(kingCell, otherColor)) {
            break;
        }
        var requests = requestKingsCorners(kingCell, enemyKing);

        var legalMovesToRequest = requests.map(function (c) {
            return new Move(kingCell, c, king);
        });
        var right = (bestDirection === "right" && kingCell.i < 6 && (kingCell.i + 2 === enemyKing.i || kingCell.i + 1 === enemyKing.i ));
        var left = (bestDirection === "left" && kingCell.i > 1 && (kingCell.i - 2 === enemyKing.i || kingCell.i - 1 === enemyKing.i));
        var up = (bestDirection === "up" && kingCell.j < 6 && (kingCell.j + 2 === enemyKing.j || kingCell.j + 1 === enemyKing.j));
        var down = (bestDirection === "down" && kingCell.j > 1 && (kingCell.j - 2 === enemyKing.j || kingCell.j - 1 === enemyKing.j));

        if (right || left || up || down) {
            bp.sync({request: legalMovesToRequest, waitFor: bp.Event("My Color Played")}, 95);
        }

        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//#endregion KRK King Strategy

//#region RookBehaviors

//when the king is in chess, block all the rooks moves
bp.registerBThread("Block Rook When Check", function () {
    bp.sync({waitFor: bp.Event("init_end")});
    while (true) {
        bp.sync({waitFor: bp.Event("Chess Event")});
        var enemies = getCellWithColor(myColor);
        var rooks = getCellWithType(Type.Rook);
        var enemyRooks = junctionList(enemies, rooks);
        for (var i = 0; i < enemyRooks.length; i++) {
            bp.sync({block: Move.PieceMoveEventSet(getRealPiece(enemyRooks[i])), waitFor: Move.AnyMoveEventSet()});
        }
    }
});
//ask for all the rook's legal moves
CTX.subscribe("AskLegalMovesForRook", "Rook", function (rook) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
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

        var legalMoves = cells.map(function (c) {
            return new Move(rookCell, c, rook);
        });

        bp.sync({request: legalMoves, waitFor: bp.Event("My Color Played")});
        bp.sync({waitFor: bp.Event("EnginePlayed")});

    }
});
// block all rook's moves that can cause our king to be in chess
CTX.subscribe("BlockMovesCauseChessForRook", "Rook", function (rook) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    while (true) {
        var myRookCell = getCellWithPiece(rook);
        if (myRookCell == null) { // If the piece is not on board
            break;
        }
        if (isColor(myRookCell, otherColor)) {
            break;
        }
        var myKingCell = getKingCell(false);
        var enemies = getCellWithColor(otherColor);
        var rooks = getCellWithType(Type.Rook);
        var queens = getCellWithType(Type.Queen);
        var bishops = getCellWithType(Type.Bishop);
        var enemyRooks = junctionList(enemies, rooks);
        var enemyQueen = junctionList(enemies, queens)[0];
        var enemyBishops = junctionList(enemies, bishops);
        var illegalMoves = [];
        //rook
        //check columns
        for (var i = 0; i < enemyRooks.length; i++) {
            if (enemyRooks[i].i === myKingCell.i && myKingCell.i === myRookCell.i) {
                if ((enemyRooks[i].j < myRookCell.j && myRookCell.j < myKingCell.j) || (enemyRooks[i].j > myRookCell.j && myRookCell.j > myKingCell.j)) {
                    for (var c = 0; c < size; c++) {
                        if (c !== myRookCell.i) {
                            illegalMoves.push(getCell(c, myRookCell.j));
                        }
                    }
                }
            }
        }
        //check rows
        for (var i = 0; i < enemyRooks.length; i++) {
            if (enemyRooks[i].j === myKingCell.j && myKingCell.j === myRookCell.j) {
                if ((enemyRooks[i].i < myRookCell.i && myRookCell.i < myKingCell.i) || (enemyRooks[i].i > myRookCell.i && myRookCell.i > myKingCell.i)) {
                    for (var j = 0; j < size; j++) {
                        if (j !== myRookCell.j) {
                            illegalMoves.push(getCell(myRookCell.i, j));
                        }
                    }
                }
            }
        }
        //queen
        //check cols
        if (enemyQueen) {
            if (enemyQueen.i === myKingCell.i && myKingCell.i === myRookCell.i) {
                if ((enemyQueen.j < myRookCell.j && myRookCell.j < myKingCell.j) || (enemyQueen.j > myRookCell.j && myRookCell.j > myKingCell.j)) {
                    for (var c = 0; c < size; c++) {
                        if (c !== myRookCell.i) {
                            illegalMoves.push(getCell(c, myRookCell.j));
                        }
                    }

                }
            }
            //check rows
            if (enemyQueen.j === myKingCell.j && myKingCell.j === myRookCell.j) {
                if ((enemyQueen.i < myRookCell.i && myRookCell.i < myKingCell.i) || (enemyQueen.i > myRookCell.i && myRookCell.i > myKingCell.i)) {
                    for (var j = 0; j < size; j++) {
                        if (j !== myRookCell.j) {
                            illegalMoves.push(getCell(myRookCell.i, j));
                        }
                    }

                }
            }
            //check diagonal
            if (checkDiagonal(enemyQueen, myKingCell) && checkDiagonal(myKingCell, myRookCell)) {
                var lowerCol = (enemyQueen.i < myRookCell.i && myRookCell.i < myKingCell.i);
                var upperCol = (enemyQueen.i > myRookCell.i && myRookCell.i > myKingCell.i);
                var lowerRow = (enemyQueen.j < myRookCell.j && myRookCell.j < myKingCell.j);
                var upperRow = (enemyQueen.j > myRookCell.j && myRookCell.j > myKingCell.j);
                if ((lowerCol && (lowerRow || upperRow)) || (upperCol && (lowerRow || upperRow))) {
                    bp.sync({block: Move.PieceMoveEventSet(rook), waitFor: bp.Event("My Color Played")});
                    bp.sync({waitFor: bp.Event("EnginePlayed")});
                }
            }
        }
        //bishop
        //check diagonal
        for (var i = 0; i < enemyBishops.length; i++) {
            if (checkDiagonal(enemyBishops[i], myKingCell) && checkDiagonal(myKingCell, myRookCell)) {
                var lowerCol = (enemyBishops[i].i < myRookCell.i && myRookCell.i < myKingCell.i);
                var upperCol = (enemyBishops[i].i > myRookCell.i && myRookCell.i > myKingCell.i);
                var lowerRow = (enemyBishops[i].j < myRookCell.j && myRookCell.j < myKingCell.j);
                var upperRow = (enemyBishops[i].j > myRookCell.j && myRookCell.j > myKingCell.j);
                if ((lowerCol && (lowerRow || upperRow)) || (upperCol && (lowerRow || upperRow))) {
                    bp.sync({block: Move.PieceMoveEventSet(rook), waitFor: bp.Event("My Color Played")});
                    bp.sync({waitFor: bp.Event("EnginePlayed")});
                }
            }
        }
        var illegalMovesToBlock = illegalMoves.map(function (c) {
            return new Move(myRookCell, c, rook);
        });
        bp.sync({block: illegalMovesToBlock, waitFor: bp.Event("My Color Played")});
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//block all illegal moves of the rook
CTX.subscribe("BlockillegalMovesForRook", "Rook", function (rook) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    while (true) {
        var rookCell = getCellWithPiece(rook);
        if (rookCell == null) { // If the piece is not on board
            break;
        }
        if (isColor(rookCell, otherColor)) {
            break;
        }
        var illegalMoves = [];
        //right
        for (var i = rookCell.i + 1; i < size; i++) {
            var c = getCell(i, rookCell.j);
            if (isNonEmpty(c)) {
                if (!isColor(c, getOppositeColor(rookCell))) {
                    illegalMoves.push(c);
                }
                i++;
                while (i < size) {
                    illegalMoves.push(getCell(i, rookCell.j));
                    i++;
                }
            }

        }
        //left
        for (var i = rookCell.i - 1; i >= 0; i--) {
            var c = getCell(i, rookCell.j);
            if (isNonEmpty(c)) {
                if (!isColor(c, getOppositeColor(rookCell))) {
                    illegalMoves.push(c);
                }
                i--;
                while (i >= 0) {
                    illegalMoves.push(getCell(i, rookCell.j));
                    i--;
                }
            }

        }
        //up
        for (var j = rookCell.j + 1; j < size; j++) {
            var c = getCell(rookCell.i, j);

            if (isNonEmpty(c)) {
                if (!isColor(c, getOppositeColor(rookCell))) {
                    illegalMoves.push(c);
                }
                j++;
                while (j < size) {
                    illegalMoves.push(getCell(rookCell.i, j));
                    j++;
                }
            }
        }
        //down
        for (var j = rookCell.j - 1; j >= 0; j--) {
            var c = getCell(rookCell.i, j);
            if (isNonEmpty(c)) {
                if (!isColor(c, getOppositeColor(rookCell))) {
                    illegalMoves.push(c);
                }
                j--;
                while (j >= 0) {
                    illegalMoves.push(getCell(rookCell.i, j));
                    j--;
                }
            }
        }

        var illegalMovesToBlock = illegalMoves.map(function (c) {
            return new Move(rookCell, c, rook);
        });

        bp.sync({block: illegalMovesToBlock, waitFor: bp.Event("My Color Played")});
        bp.sync({waitFor: bp.Event("EnginePlayed")});

    }
});
//#endregion RookBehaviors

//#region KingBehaviors

//ask all 8 kings moves
CTX.subscribe("AskMoveForKing", "King", function (king) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (king.color.equals(Color.Black)) {
        blackKing = king;
    }
    else {
        whiteKing = king;
    }
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    while (true) {
        var kingCell = getCellWithPiece(king);
        if (kingCell === null)
            break;
        if (isColor(kingCell, otherColor))
            break;
        var cells = [];
        var currentCell;
        var currentColor = getColor(kingCell);
        cells.push(getCell(kingCell.i - 1, kingCell.j - 1));
        cells.push(getCell(kingCell.i, kingCell.j - 1));
        cells.push(getCell(kingCell.i + 1, kingCell.j - 1));
        cells.push(getCell(kingCell.i - 1, kingCell.j));
        cells.push(getCell(kingCell.i + 1, kingCell.j));
        cells.push(getCell(kingCell.i - 1, kingCell.j + 1));
        cells.push(getCell(kingCell.i, kingCell.j + 1));
        cells.push(getCell(kingCell.i + 1, kingCell.j + 1));
        var legalMoves = cells.map(
            function (c) {
                if (c !== "null")
                    return new Move(kingCell, c, king);
            });
        var _legalMoves = legalMoves.filter(function (c) {
            return c != null;
        });
        bp.sync({request: _legalMoves, waitFor: bp.Event("My Color Played")});
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//block all illegal kings moves
CTX.subscribe("BlockIllegalMoveForKing", "King", function (king) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (king.color.equals(Color.Black)) {
        blackKing = king;
    }
    else {
        whiteKing = king;
    }
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    while (true) {
        var kingCell = getCellWithPiece(king);
        if (kingCell === null)
            break;
        if (isColor(kingCell, otherColor))
            break;
        var cellsToBlock = [];
        var currentCell;
        var currentColor = getColor(kingCell);
        var i = kingCell.i;
        var j = kingCell.j;

        cellsToBlock.push(getCell(kingCell.i - 1, kingCell.j - 1));
        cellsToBlock.push(getCell(kingCell.i, kingCell.j - 1));
        cellsToBlock.push(getCell(kingCell.i + 1, kingCell.j - 1));
        cellsToBlock.push(getCell(kingCell.i - 1, kingCell.j));
        cellsToBlock.push(getCell(kingCell.i + 1, kingCell.j));
        cellsToBlock.push(getCell(kingCell.i - 1, kingCell.j + 1));
        cellsToBlock.push(getCell(kingCell.i, kingCell.j + 1));
        cellsToBlock.push(getCell(kingCell.i + 1, kingCell.j + 1));

        var IllegalcellsToBlock = cellsToBlock.map(
            function (c) {
                if ((c !== "null") && (!kingController(c, currentColor) || (isNonEmpty(c) && isColor(c, currentColor))))
                    return new Move(kingCell, c, king);
            });
        var _IllegalcellsToBlock = IllegalcellsToBlock.filter(function (c) {
            return c != null;
        });

        bp.sync({block: _IllegalcellsToBlock, waitFor: bp.Event("My Color Played")});
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//detect chess and announce it
CTX.subscribe("DetectChess", "King", function (king) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if (king.color.equals(Color.Black)) {
        blackKing = king;
    }
    else {
        whiteKing = king;
    }
    if (myColor.equals(Color.Black))
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    while (true) {
        var kingCell = getCellWithPiece(king);
        if (kingCell === null)
            break;
        if (isColor(kingCell, otherColor))
            break;
        var cells = [];

        var currentColor = getColor(kingCell);
        if (!kingController(kingCell, currentColor)) {
            bp.sync({request: bp.Event("Chess Event"), waitFor: bp.Event("My Color Played")});
        }
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//#endregion KingBehaviors