// CTX.subscribe("move to my own color", "CellWitColor", function(c){
//     bp.sync({waitFor: Move.AllMovesThatTargretIs(c)});
//     if(c.piece.color == My color)
//     bp.ASSERT(false,"cell marked twice");
// });
//
// bp.registerBThread("Assert X Win", function() {
//     bp.sync({waitFor: bp.Event('XWin')});
//     bp.ASSERT(false, "X won");
// });