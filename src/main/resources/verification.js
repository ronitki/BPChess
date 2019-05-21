importPackage(Packages.il.ac.bgu.cs.bp.bpjs.Chess.events);
importPackage(Packages.il.ac.bgu.cs.bp.bpjs.context);
importPackage(Packages.il.ac.bgu.cs.bp.bpjs.Chess.context.schema);
importPackage(Packages.il.ac.bgu.cs.bp.bpjs.Chess.context.schema.piece);


bp.registerBThread("init", function () {
    var p1 = new Piece(Color.Black, Type.King, 1);
    bp.sync({request: CTX.UpdateEvent("UpdateCell", {"cell": new Cell(4, 2, p1), "piece": p1})});
    var p2 = new Piece(Color.Black, Type.Rook, 1);
    bp.sync({request: CTX.UpdateEvent("UpdateCell", {"cell": new Cell(2,6, p2), "piece": p2})});
    var p3 = new Piece(Color.White, Type.King, 1);
    bp.sync({request: CTX.UpdateEvent("UpdateCell", {"cell": new Cell(2, 4, p3), "piece": p3})});
    bp.sync({request: bp.Event("color", "black")});
    bp.sync({request: bp.Event("init_end")});
});
//ask all 8 kings moves
CTX.subscribe("AskMoveForKing-Test", "King", function (king) {
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
        if (!isColor(kingCell, otherColor))
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
        bp.sync({request: _legalMoves});
        bp.sync({waitFor: bp.Event("My Color Played")});
    }
});
//block all illegal kings moves
CTX.subscribe("BlockIllegalMoveForKing-Test", "King", function (king) {
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
        if (!isColor(kingCell, otherColor))
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

        bp.sync({request: _legalMoves});
        bp.sync({waitFor: bp.Event("My Color Played")});
    }
});
