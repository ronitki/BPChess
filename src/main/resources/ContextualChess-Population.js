var size = 8;

function registerAllPieceTypesQueries() {
    var types = Type.values();
    for (var c = 0; c < types.length; c++) {
        CTX_instance.registerParameterizedContextQuery("PieceOfType", types[c].toString(), {
            "type": types[c]
        });
    }
}

function registerAllCellsQueries(cells, pieces) {
    for (var c = 0; c < cells.length; c++) {
        CTX_instance.registerParameterizedContextQuery("SpecificCell", "Cell[" + cells[c].i + "," + cells[c].j + "]", {
            "i": cells[c].i,
            "j": cells[c].j
        });
    }
    for (var p = 0; p < pieces.length; p++) {
        CTX_instance.registerParameterizedContextQuery("CellWithPiece", "CellWithPiece["+pieces[p].toString()+"]", {
            "p": pieces[p]
        });
    }
}

bp.registerBThread("PopulateDB", function() {
    var cells = [], i = 0, row, cell;
    for (i = 0; i < size; i++) {
        row = [];
        for (j = 0; j < size; j++) {
            cell = new Cell(i, j);
            cells.push(cell);
        }
    }

    var pieces = [];
    var colors = [Color.white, Color.black];
    for (color = 0; color < 2; color++) {
        for (i = 0; i < size; i++) {
            pieces.push(new Piece(colors[color], Type.Pawn, i));
        }
    }

    registerAllPieceTypesQueries();
    registerAllCellsQueries(cells, pieces);

    bp.sync({ request: CTX.InsertEvent(cells) });

    bp.sync({ request: bp.Event("Context Population Ended") });
});