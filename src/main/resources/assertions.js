
bp.registerBThread("Wait 2 White", function() {
    bp.sync({waitFor: Move.ColorMoveEventSet(Color.White)});
    bp.sync({waitFor: Move.ColorMoveEventSet(Color.White)});
    bp.ASSERT(false, "White Played Twice");
});

bp.registerBThread("Wait 2 Black", function() {
    bp.sync({waitFor: Move.ColorMoveEventSet(Color.Black)});
    bp.sync({waitFor: Move.ColorMoveEventSet(Color.Black)});
    bp.ASSERT(false, "Black Played Twice");
});

bp.registerBThread("Wait Move in same place", function() {
    bp.sync({waitFor: Move.SamePlaceMoveEventSet()});
    bp.ASSERT(false, "Piece Moved in same black");
});

bp.registerBThread("Wait Move out of board", function() {
    bp.sync({waitFor: Move.OutOfBoardMoveEventSet()});
    bp.ASSERT(false, "Piece Moved out of board");
});

bp.registerBThread("Wait for eat my color", function() {
    var move = bp.sync({waitFor: Move.AnyMoveEventSet()});
    var target = (Cell)((Move)(move).target);
    if (isNonEmpty(target)) {
        var source = (Cell)((Move)(move).source);
        if(getColor(source).equals(getColor(target))){
            bp.ASSERT(false, "Ate Same Color");
        }
    }
});




