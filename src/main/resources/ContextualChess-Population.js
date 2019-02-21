var size = 8; 

function registerAllCellsQueries(cells, pieces) {
    for (var c = 0; c < size; c++) {
        CTX_instance.registerParameterizedContextQuery("SpecificCell", "Cell[" + c.i + "," + c.j + "]", {
            "i": c.i,
            "j": c.j
        });
    }
    for (var p = 0; p < pieces.length; p++) {
        CTX_instance.registerParameterizedContextQuery("CellWithPiece", "CellWithPiece["+pieces[p].toString()+"]", {
            "p": pieces[p]
        });
    }
}

bp.registerBThread("PopulateDB", function() {
    var cells = [], i = 0;
    for (i = 0; i < size; i++) {
        row = [];
        for (j = 0; j < size; j++) {
            cell = new Cell(i, j);
            cells.push(cell);
        }
    }

    var pieces = [];
    var colors = [Piece.Color.white, Piece.Color.black]
    for (color = 0; color < 2; color++) {
        for (i = 0; i < size; i++) {
            pieces.push(new Piece(colors[color], Piece.Type.pawn, i));
        }
    }

    registerAllCellsQueries(cells, pieces);

    bp.sync({ request: CTX.InsertEvent(cells) });

    bp.sync({ request: bp.Event("Context Population Ended") });
});