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
function getKingCell(isEnemy){
    var KingCell;
    if(myColor.equals(Color.White)){
        if(isEnemy)
            KingCell=getCellWithPiece(blackKing);
        else
            KingCell=getCellWithPiece(whiteKing);
    }
    else{
        if(isEnemy)
            KingCell=getCellWithPiece(whiteKing);
        else
            KingCell=getCellWithPiece(blackKing);
    }
    return KingCell;
}
function isRookInDanger(targetCell){
    var enemyKingCell=getKingCell(true);
    var myKingCell=getKingCell(false);
    if(Math.abs(targetCell.i-enemyKingCell.i)<=1 && Math.abs(targetCell.j-enemyKingCell.j)<=1){
        if(Math.abs(targetCell.i-myKingCell.i)<=1 && Math.abs(targetCell.j-myKingCell.j)<=1) {
            return false;
        }
        return true;
    }
    return false;
}
function isTheMovePushTheKing(targetCell,bestDirection,distance) {
    var enemyKingCell=getEnemyKingCell();
    if(bestDirection==="right"){
        if(targetCell.i===enemyKingCell.i-distance){
            return true;
        }
    }
    else if(bestDirection==="left"){
        if(targetCell.i===enemyKingCell.i+distance){
            return true;
        }
    }
    else if(bestDirection==="up"){
        if(targetCell.j===enemyKingCell.j-distance){
            return true;
        }
    }
    else if(bestDirection==="down"){
        if(targetCell.j===enemyKingCell.j+distance){
            return true;
        }
    }
    return false;
}
function getBestDirection(){
    var right=7-enemyKingCell.i;
    var left=enemyKingCell.i;
    var up=7-enemyKingCell.j;
    var down=enemyKingCell.j;
    var min=right;
    var minName="right";
    if(min>left){
        min=left;
        minName="left";
    }
    if(min>up){
        min=up;
        minName="up";
    }
    if(min>down){
        min=down;
        minName="down";
    }
    return minName;
}
function checkDiagonal(cell1,cell2){
    if(Math.abs(cell1.i-cell2.i)==Math.abs(cell1.j-cell2.j))
        return true;
    return false;
}
function junctionList(list1,list2){
    var ansList=[];
    for (var i=0;i<list1.size();i++){
        if(list2.contains(list1.get(i))){
            ansList.push(list1.get(i));
        }
    }
    return ansList;
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

bp.registerBThread("EnforceUpdateAfterMove", function () {
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

CTX.subscribe("Kill piece", "piece", function (p) {
    bp.sync({waitFor: bp.Event("init_end")});
    bp.sync({waitFor: CTX.ContextEndedEvent("Piece", p)});
    bp.sync({block: Move.PieceMoveEventSet(p)});
});

//TODO if happened no eventselect && my turn(||go) && chess = math else tie
//#endregion GameRules

//#region RookBehaviors
CTX.subscribe("AskLegalMovesForRook", "Rook", function (rook) {
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


        var legalMoves = cells.map(function (c) {
            return new Move(rookCell, c, rook);
        });

        bp.sync({request: legalMoves, waitFor: bp.Event("My Color Played")});
        bp.sync({waitFor: bp.Event("EnginePlayed")});

    }
});

CTX.subscribe("BlockMovesCauseChessForRook", "Rook", function (rook) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    if(myColor.equals(Color.Black))
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
        var enemyQueen = junctionList(enemies, queens);
        var enemyBishops = junctionList(enemies, bishops);
        var illegalMoves=[];
        //rook
        //check columns
        for (var i = 0; i < enemyRooks.length; i++) {
            if (enemyRooks[i].i === myKingCell.i && myKingCell.i === myRookCell.i) {
                if ((enemyRooks[i].j < myRookCell.j && myRookCell.j < myKingCell.j) || (enemyRooks[i].j > myRookCell.j && myRookCell.j > myKingCell.j)) {
                    for (var c=0;c<size;c++){
                        if(c !== myRookCell.i) {
                            bp.log.info("c: "+c);
                            bp.log.info("j: "+myRookCell.j);
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
                    for (var j=0;j<size;j++){
                        if(j !== myRookCell.j) {
                            illegalMoves.push(getCell(myRookCell.i, j));
                        }
                    }
                }
            }
        }
        //queen
        //check cols
        if (enemyQueen.i === myKingCell.i && myKingCell.i === myRookCell.i) {
            if ((enemyQueen.j < myRookCell.j && myRookCell.j < myKingCell.j) || (enemyQueen.j > myRookCell.j && myRookCell.j > myKingCell.j)) {
                for (var c=0;c<size;c++){
                    if(c !== myRookCell.i) {
                        illegalMoves.push(getCell(c, myRookCell.j));
                    }
                }

            }
        }
        //check rows
        if (enemyQueen.j === myKingCell.j && myKingCell.j === myRookCell.j) {
            if ((enemyQueen.i < myRookCell.i && myRookCell.i < myKingCell.i) || (enemyQueen.i > myRookCell.i && myRookCell.i > myKingCell.i)) {
                for (var j=0;j<size;j++){
                    if(j !== myRookCell.j) {
                        illegalMoves.push(getCell(myRookCell.i, j));
                    }
                }

            }
        }
        //check diagonal
        if (checkDiagonal(enemyQueen,myKingCell)&& checkDiagonal(myKingCell,myRookCell)) {
            bp.sync({block:  Move.PieceMoveEventSet(myRookCell), waitFor: bp.Event("My Color Played")});
            bp.sync({waitFor: bp.Event("EnginePlayed")});

        }
        //bishop
        //check diagonal
        for (var i = 0; i < enemyBishops.length; i++) {
            if (checkDiagonal(enemyBishops[i], myKingCell) && checkDiagonal(myKingCell, myRookCell)) {
                bp.sync({block:  Move.PieceMoveEventSet(myRookCell), waitFor: bp.Event("My Color Played")});
                bp.sync({waitFor: bp.Event("EnginePlayed")});
            }
        }
        var illegalMovesToBlock = illegalMoves.map(function (c) {
            return new Move(myRookCell, c, rook);
        });
        bp.sync({block: illegalMovesToBlock, waitFor: bp.Event("My Color Played")});
        bp.sync({waitFor: bp.Event("EnginePlayed")});
    }
});
//#endregion RookBehaviors

function calculateRookStrategy(legalmoves){
    var bestDirection=getBestDirection();
    for (var i = 0; i < legalMoves.length; i++) {
        var targetCell=legalmoves[i].target;
        if (isTheMovePushTheKing(targetCell,bestDirection,2)) {
            legalmoves[i].setPriority(15);
        }
        if (isTheMovePushTheKing(targetCell,bestDirection,1)) {
            legalmoves[i].setPriority(30);
        }
        if (isRookInDanger(targetCell)) {
            legalmoves[i].setPriority(-50);
        }
    }
}

//#region King Help Function
function checkRight(cell, color) {
    for (var i = cell.i + 1; i < size; i++) {
        var currentCell = getCell(i, cell.j);
        if (isNonEmpty(currentCell)) { //there's someone in the cell
            if (!isColor(currentCell, color) || (isType(currentCell, Type.King)&&isColor(currentCell, color)) ) { // the piece is enemy piece
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
            if (!isColor(currentCell, color)|| (isType(currentCell, Type.King)&&isColor(currentCell, color))) { // the piece is enemy piece
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
            if (!isColor(currentCell, color)|| (isType(currentCell, Type.King)&&isColor(currentCell, color))) { // the piece is enemy piece
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
            if (!isColor(currentCell, color)|| (isType(currentCell, Type.King)&&isColor(currentCell, color))) { // the piece is enemy piece
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
            if (!isColor(currentCell, color)|| (isType(currentCell, Type.King)&&isColor(currentCell, color))) { // the piece is enemy piece
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
            if (!isColor(currentCell, color)|| (isType(currentCell, Type.King)&&isColor(currentCell, color))) { // the piece is enemy piece
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
            if (!isColor(currentCell, color)|| (isType(currentCell, Type.King)&&isColor(currentCell, color))) { // the piece is enemy piece
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
            if (!isColor(currentCell, color)|| (isType(currentCell, Type.King)&&isColor(currentCell, color))) { // the piece is enemy piece
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

function kingController(currentCell, currentColor) {
    return (!checkRight(currentCell, currentColor) && !checkLeft(currentCell, currentColor) && !checkUp(currentCell, currentColor) && !checkDown(currentCell, currentColor) && !checkUpLeft(currentCell, currentColor) && !checkUpRight(currentCell, currentColor) && !checkDownLeft(currentCell, currentColor) && !checkDownRight(currentCell, currentColor) && !checkKnights(currentCell, currentColor));
}

//#endregion King Help Function

//#region KingBehaviors

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
                    cells.push(currentCell);
            }
        }
        if (j - 1 >= 0) {
            currentCell = getCell(kingCell.i, kingCell.j - 1);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell))
                cells.push(currentCell);
            else if (kingController(currentCell, currentColor) && !checkEmpty(currentCell)&& !isColor(currentCell,currentColor)) {
                    cells.push(currentCell);
            }
        }
        if (i + 1 < size && j - 1 >= 0) {
            currentCell = getCell(kingCell.i + 1, kingCell.j - 1);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell))
                cells.push(currentCell);
            else if (kingController(currentCell, currentColor) && !checkEmpty(currentCell)&& !isColor(currentCell,currentColor)) {
                    cells.push(currentCell);
            }
        }
        if (i - 1 >= 0) {
            currentCell = getCell(kingCell.i - 1, kingCell.j);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell))
                cells.push(currentCell);
            else if (kingController(currentCell, currentColor) && !checkEmpty(currentCell)&& !isColor(currentCell,currentColor)) {
                    cells.push(currentCell);
            }
        }
        if (i + 1 < size) {
            currentCell = getCell(kingCell.i + 1, kingCell.j);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell)) {
                cells.push(currentCell);
            }
            else if (kingController(currentCell, currentColor) && !checkEmpty(currentCell)&& !isColor(currentCell,currentColor)) {
                    cells.push(currentCell);
            }
        }
        if (i - 1 >= 0 && j + 1 < size) {
            currentCell = getCell(kingCell.i - 1, kingCell.j + 1);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell)) {
                cells.push(currentCell);
            }
            else if (kingController(currentCell, currentColor) && !checkEmpty(currentCell) && !isColor(currentCell,currentColor)) {
                    cells.push(currentCell);
            }
        }
        if (j + 1 < size) {
            currentCell = getCell(kingCell.i, kingCell.j + 1);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell))
                cells.push(currentCell);
            else if (kingController(currentCell, currentColor) && !checkEmpty(currentCell)&& !isColor(currentCell,currentColor)) {
                    cells.push(currentCell);
            }
        }
        if (i + 1 < size && j + 1 < size) {
            currentCell = getCell(kingCell.i + 1, kingCell.j + 1);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell))
                cells.push(currentCell);
            else if (kingController(currentCell, currentColor) && !checkEmpty(currentCell)&& !isColor(currentCell,currentColor)) {
                    cells.push(currentCell);
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


