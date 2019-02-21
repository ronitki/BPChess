importPackage(Packages.il.ac.bgu.cs.bp.bpjs.Chess.events);

importPackage(Packages.il.ac.bgu.cs.bp.bpjs.context);
importPackage(Packages.il.ac.bgu.cs.bp.bpjs.Chess.context.schema);

//#region HELP FUNCTIONS
function getCell(i,j){
    return CTX.getContextsOfType("Cell["+i+","+j+"]").get(0);
}
function getCellWithPiece(p){
    return CTX.getContextsOfType("CellWithPiece["+p+"]").get(0);
}
//#endregion HELP FUNCTIONS


//#region GameRules
bp.registerBThread("EnforceTurns", function () {
    while (true) {
        bp.sync({waitFor: ColorMoveEventSet(Piece.Color.white), block: ColorMoveEventSet(Piece.Color.black)});
        bp.sync({waitFor: ColorMoveEventSet(Piece.Color.black), block: ColorMoveEventSet(Piece.Color.white)});

    }
});
//#endregion GameRules

//#region RookBehaviors
CTX.subscribe("AskMove","Rook", function(r) {
    while (true) {
        var r_c = getCellWithPiece(r);
        var cells = [];
        for (var i = r_c.i; i<size; i++) {
            var c = getCell(i,r_c.j);
            if(c.piece != null) {
                //TODO check for color
                break;
            }
            cells.push(c);
        }
        //TODO: 3 more times

        var legalMoves = cells.map(function (c) { Move(r_c, c, r) });
        bp.sync({request:[legalMoves], waitFor: AnyMoveEventSet()});
    }
});
//#endregion RookBehaviors
