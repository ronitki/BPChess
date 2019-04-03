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
function isType(cell,type){
    return getCellWithType(type).contains(cell);
}
function isColor(cell, color) {
    return getCellWithColor(color).contains(cell);
}
function getRealPiece(input){
    var i=input.charAt(0)-97;
    var j=input.charAt(1)-49;
    var cell=getCell(i,j);
    var piece={};
    if(getCellWithType(Type.King).contains(cell)){
        piece.type="King";
    }
    else{
        piece.type="Rook";
    }
    if(getCellWithColor(Color.White).contains(cell)){
        piece.color="White";
    }
    else{
        piece.color="Black";
    }
    piece.id=1;
    return getPiece(piece.color+"_"+piece.type+"_"+piece.id);
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
    while (true) {
        bp.sync({waitFor: Move.ColorMoveEventSet(Color.White), block: Move.ColorMoveEventSet(Color.Black)});
        bp.sync({waitFor: Move.ColorMoveEventSet(Color.Black), block: Move.ColorMoveEventSet(Color.White)});

    }
});

bp.registerBThread("UpdateMove", function () {
    while (true) {
        var move= bp.sync({waitFor: Move.AnyMoveEventSet()});
        bp.sync({request: CTX.UpdateEvent("UpdateCell",{"cell":move.source,"piece":null})},100);
        bp.sync({request: CTX.UpdateEvent("UpdateCell",{"cell":move.target,"piece":move.piece})},100);
        bp.sync({ request: bp.Event("Database Updated") });
        //ronit1
    }
});

bp.registerBThread("GetHisMove", function () {
    while (true) {
         bp.sync({waitFor: [bp.Event("HisMove")]});
        var input= bp.sync({waitFor: Move.AnyEventSet()}).name;
        var piece=getRealPiece(input);
        bp.sync({request: CTX.UpdateEvent("UpdateCell",{"cell":new Cell(input.charAt(0)-97,input.charAt(1)-49),"piece":null})},100);
        bp.sync({request: CTX.UpdateEvent("UpdateCell",{"cell":new Cell(input.charAt(2)-97,input.charAt(3)-49),"piece":piece})},100);
        bp.sync({request: bp.Event("Database Updated") });
        bp.sync({request: new Move(new Cell(input.charAt(0)-97,input.charAt(1)-49),new Cell(input.charAt(2)-97,input.charAt(3)-49),piece)},100);


    }
});

bp.registerBThread("GetMyColor", function () {
    myColor = bp.sync({waitFor: [bp.Event("color", "black"), bp.Event("color", "white")]}).data;
    if (myColor.localeCompare("black")===0) {
        myColor = Color.Black;
        otherColor = Color.White;
    }
    else {
        myColor = Color.White;
        otherColor = Color.Black;
    }

    while (true) {
        bp.sync({waitFor: bp.Event("My Turn"), block: Move.ColorMoveEventSet(myColor)});
        bp.sync({waitFor: Move.ColorMoveEventSet(myColor)});

    }
});

bp.registerBThread("block moving to the same place", function () {
    bp.sync({block: Move.SamePlaceMoveEventSet()});
});

bp.registerBThread("block out of board moves", function () {
    bp.sync({block: Move.OutOfBoardMoveEventSet()});
});

bp.registerBThread("delete piece upon eating", function () {
    while (true) {
        var move = bp.sync({waitFor: Move.EatMoveEventSet()});
        bp.sync({request: CTX.UpdateEvent("DeletePiece", {"p": move.target.piece})})
    }
});

CTX.subscribe("Kill piece", "piece", function (p) {
    bp.sync({waitFor: CTX.ContextEndedEvent("Piece", p)});
    bp.sync({block: Move.PieceMoveEventSet(p)});
});
//TODO add bt that forbids my moves that will cause chess to me
//TODO for each piece - add bt that wait for my turn and then blocks all moves that will cause check

//#endregion GameRules

//#region RookBehaviors
CTX.subscribe("AskMoveForRook", "Rook", function (rook) {
    bp.sync({waitFor: bp.Event("Context Population Ended")});
    bp.sync({waitFor: bp.Event("init_end")});
    while (true) {
        var rookCell = getCellWithPiece(rook);
        if (rookCell == null) { // If the piece is not on board
            break;
        }
        if(isColor(rookCell,otherColor)){
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

        for (var start=0; start<cells.length;start++){
            if(checkifCauseChess(rookCell,cells[start],rook)){
                cells.splice(start,1);
                start--;
            }
        }
        var legalMoves = cells.map(c => new Move(rookCell, c, rook));
        bp.log.info("Rook legal moves are: "+ legalMoves);
        bp.sync({request: [legalMoves[0]]});
        bp.sync({waitFor: bp.Event("Database Updated")});
        //TODO interrupt contextEnded "interrupt: CTX.ContextEnded("Piece", p)});"
    }
});
//#endregion RookBehaviors

function checkRight(cell, color) {
    for (var i = cell.i + 1; i < size; i++) {
        var currentCell = getCell(i, cell.j);
        if (isNonEmpty(currentCell)) { //there's someone in the cell
            if (!isColor(currentCell,color)) { // the piece is enemy piece
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
            if (!isColor(currentCell,color)) { // the piece is enemy piece
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
            if (!isColor(currentCell,color)) { // the piece is enemy piece
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
            if (!isColor(currentCell,color)) { // the piece is enemy piece
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
    for (var i = cell.i + 1, j = cell.j + 1; j < size &&  i < size; j++, i++) {
        var currentCell = getCell(i, j);
        if (isNonEmpty(currentCell)) { //there's someone in the cell
            if (!isColor(currentCell,color)) { // the piece is enemy piece
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
            if (!isColor(currentCell,color)) { // the piece is enemy piece
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
            if (!isColor(currentCell,color)) { // the piece is enemy piece
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
            if (!isColor(currentCell,color)) { // the piece is enemy piece
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
            if (isType(currentCell, Type.Pawn) && !isColor(currentCell,color)) {
                return true;
            }
        }
        if (cell.j - 2 >= 0) {
            var currentCell = getCell(cell.i + 1, cell.j - 2);
            if (isType(currentCell, Type.Pawn) && !isColor(currentCell,color)) {
                return true;
            }
        }
    }
    if (cell.i - 1 >= 0) {
        if (cell.j + 2 < size) {
            var currentCell = getCell(cell.i - 1, cell.j + 2);
            if (isType(currentCell, Type.Pawn) && !isColor(currentCell,color)) {
                return true;
            }
        }
        if (cell.j - 2 >= 0) {
            var currentCell = getCell(cell.i - 1, cell.j - 2);
            if (isType(currentCell, Type.Pawn) && !isColor(currentCell,color)) {
                return true;
            }
        }
    }
    if (cell.i + 2 < size) {
        if (cell.j + 1 < size) {
            var currentCell = getCell(cell.i + 2, cell.j + 1);
            if (isType(currentCell, Type.Pawn) && !isColor(currentCell,color)) {
                return true;
            }
        }
        if (cell.j - 1 >= 0) {
            var currentCell = getCell(cell.i + 2, cell.j - 1);
            if (isType(currentCell, Type.Pawn) && !isColor(currentCell,color)) {
                return true;
            }
        }
    }
    if (cell.i - 2 >= 0) {
        if (cell.j + 1 < size) {
            var currentCell = getCell(cell.i - 2, cell.j + 1);
            if (isType(currentCell, Type.Pawn) && !isColor(currentCell,color)) {
                return true;
            }
        }
        if (cell.j - 1 >= 0) {
            var currentCell = getCell(cell.i - 2, cell.j - 1);
            if (isType(currentCell, Type.Pawn) && !isColor(currentCell,color)) {
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
    bp.sync({ waitFor: bp.Event("Context Population Ended") });
    bp.sync({ waitFor: bp.Event("init_end") });
    if(king.color.equals(Color.Black)){
        blackKing=king;
    }
    else{
        whiteKing=king;
    }
    while (true) {
        bp.log.info("I am here with: "+ king);
        var kingCell = getCellWithPiece(king);
        if(kingCell===null)
            break;
        if(isColor(kingCell,otherColor))
            break;
        var cells = [];
        var currentCell;
        var currentColor= getMyColor(kingCell);
        if(!kingController(kingCell,currentColor)){
            //TODO: call chess event
            bp.sync({ request: bp.Event("Chess Event") });
        }
        var i=kingCell.i;
        var j=kingCell.j;
        if(i-1>=0 && j-1>=0) {
            currentCell = getCell(kingCell.i - 1, kingCell.j - 1);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell))
                cells.push(currentCell);
            else if (kingController(currentCell, currentColor) &&!checkEmpty(currentCell)){
                if(!checkifCauseChess(kingCell,currentCell,king)){
                    cells.push(currentCell);
                }
            }
        }
        if( j-1>=0) {
            currentCell = getCell(kingCell.i, kingCell.j - 1);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell))
                cells.push(currentCell);
            else if (kingController(currentCell, currentColor) &&!checkEmpty(currentCell)){
                if(!checkifCauseChess(kingCell,currentCell,king)){
                    cells.push(currentCell);
                }
            }
        }
        if(i+1<size && j-1>=0) {
            currentCell = getCell(kingCell.i + 1, kingCell.j - 1);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell))
                cells.push(currentCell);
            else if (kingController(currentCell, currentColor) &&!checkEmpty(currentCell)){
                if(!checkifCauseChess(kingCell,currentCell,king)){
                    cells.push(currentCell);
                }
            }
        }
        if(i-1>=0 ) {
            currentCell = getCell(kingCell.i - 1, kingCell.j);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell))
                cells.push(currentCell);
            else if (kingController(currentCell, currentColor) &&!checkEmpty(currentCell)){
                if(!checkifCauseChess(kingCell,currentCell,king)){
                    cells.push(currentCell);
                }
            }
        }
        if(i+1<size) {
            currentCell = getCell(kingCell.i + 1, kingCell.j);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell))
                cells.push(currentCell);
            else if (kingController(currentCell, currentColor) &&!checkEmpty(currentCell)){
                if(!checkifCauseChess(kingCell,currentCell,king)){
                    cells.push(currentCell);
                }
            }
        }
        if(i-1>=0 && j+1<size) {
            currentCell = getCell(kingCell.i - 1, kingCell.j + 1);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell))
                cells.push(currentCell);
            else if (kingController(currentCell, currentColor) &&!checkEmpty(currentCell)){
                if(!checkifCauseChess(kingCell,currentCell,king)){
                    cells.push(currentCell);
                }
            }
        }
        if( j+1<size) {
            currentCell = getCell(kingCell.i, kingCell.j + 1);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell))
                cells.push(currentCell);
            else if (kingController(currentCell, currentColor) &&!checkEmpty(currentCell)){
                if(!checkifCauseChess(kingCell,currentCell,king)){
                    cells.push(currentCell);
                }
            }
        }
        if(i+1<size && j+1<size) {
            currentCell = getCell(kingCell.i + 1, kingCell.j + 1);
            if (kingController(currentCell, currentColor) && checkEmpty(currentCell))
                cells.push(currentCell);
            else if (kingController(currentCell, currentColor) &&!checkEmpty(currentCell)){
                if(!checkifCauseChess(kingCell,currentCell,king)){
                    cells.push(currentCell);
                }
            }
        }
        var legalMoves = cells.map(c => new Move(kingCell, c, king));
        bp.log.info("King legal moves: "+legalMoves);
        bp.sync({request: [legalMoves[0]]});
        bp.sync({waitFor: bp.Event("Database Updated")});
    }
});
//#endregion KingBehaviors

function checkifCauseChess(source, target, piece){
    var ans=false;
   //  var kingCell;
   //  var tempPiece={};
   // if(isNonEmpty(target)){
   //     if(isColor(target,Color.White)){
   //         tempPiece.color=Color.White;
   //     }
   //     else{
   //         tempPiece.color=Color.Black;
   //     }
   //     if(isType(target,Type.Rook)){
   //         tempPiece.type=Type.Rook;
   //     }
   //     tempPiece.id=1;
   //     var realPiece=getPiece(tempPiece.color+"_"+tempPiece.type+"_"+tempPiece.id);
   //     bp.sync({request: CTX.UpdateEvent("UpdateCell",{"cell":source,"piece":null})});
   //     bp.sync({request: CTX.UpdateEvent("UpdateCell",{"cell":target,"piece":piece})});
   //     if(myColor.equals(Color.White)) {
   //         kingCell = getCellWithPiece(whiteKing);
   //     }
   //     else{
   //         kingCell = getCellWithPiece(blackKing);
   //     }
   //
   //     if(!kingController(kingCell,myColor)){
   //         ans=true;
   //     }
   //     bp.sync({request: CTX.UpdateEvent("UpdateCell",{"cell":source,"piece":piece})});
   //     bp.sync({request: CTX.UpdateEvent("UpdateCell",{"cell":target,"piece":realPiece})});
   // }
   //
   // else{
   //     bp.sync({request: CTX.UpdateEvent("UpdateCell",{"cell":source,"piece":null})});
   //     bp.sync({request: CTX.UpdateEvent("UpdateCell",{"cell":target,"piece":piece})});
   //     if(myColor.equals(Color.White)) {
   //         kingCell = getCellWithPiece(whiteKing);
   //     }
   //     else{
   //         kingCell = getCellWithPiece(blackKing);
   //     }
   //
   //     if(!kingController(kingCell,myColor)){
   //          ans=true;
   //     }
   //     bp.sync({request: CTX.UpdateEvent("UpdateCell",{"cell":source,"piece":piece})});
   //     bp.sync({request: CTX.UpdateEvent("UpdateCell",{"cell":target,"piece":null})});
   // }
   return ans;
}
