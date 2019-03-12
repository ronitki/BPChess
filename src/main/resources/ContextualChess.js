importPackage(Packages.il.ac.bgu.cs.bp.bpjs.Chess.events);

importPackage(Packages.il.ac.bgu.cs.bp.bpjs.context);
importPackage(Packages.il.ac.bgu.cs.bp.bpjs.Chess.context.schema);

//#region HELP FUNCTIONS
function getCell(i, j) {
    return CTX.getContextsOfType("Cell[" + i + "," + j + "]").get(0);
}
function getCellWithPiece(p) {
    return CTX.getContextsOfType("CellWithPiece[" + p + "]").get(0);
}
//#endregion HELP FUNCTIONS


//#region GameRules
bp.registerBThread("EnforceTurns", function () {
    while (true) {
        bp.sync({waitFor: ColorMoveEventSet(Piece.Color.white), block: ColorMoveEventSet(Piece.Color.black)});
        bp.sync({waitFor: ColorMoveEventSet(Piece.Color.black), block: ColorMoveEventSet(Piece.Color.white)});

    }
});

bp.registerBThread("block moving to the same place", function () {
    bp.sync({block: SamePlaceMoveEventSet()});
});

bp.registerBThread("block out of board moves", function () {
    bp.sync({block: OutOfBoardMoveEventSet()});
});

//var move = bp.sync({waitFor: EatMoveEventSet()});
//bp.sync({request : updatePiece(move.target.piece,true)})
//bp.sync({request : updateCell(move.target,null)})
//#endregion GameRules

//#region RookBehaviors
CTX.subscribe("AskMove", "Rook", function (r) {
    while (true) {
        var r_c = getCellWithPiece(r);
        var cells = [];
        //right
        for (var i = r_c.i; i < size; i++) {
            var c = getCell(i, r_c.j);
            if (c.piece != null) {
                if (c.piece.color != r.color) {
                    cells.push(c);
                }
                break;
            }
            cells.push(c);
        }
        //left
        for (var i = r_c.i; i >= 0; i--) {
            var c = getCell(i, r_c.j);
            if (c.piece != null) {
                if (c.piece.color != r.color) {
                    cells.push(c);
                }
                break;
            }
            cells.push(c);
        }
        //up
        for (var j = r_c.j; j < size; j++) {
            var c = getCell(r_c.i, j);
            if (c.piece != null) {
                if (c.piece.color != r.color) {
                    cells.push(c);
                }
                break;
            }
            cells.push(c);
        }
        //down
        for (var j = r_c.j; j >= 0; j--) {
            var c = getCell(r_c.i, j);
            if (c.piece != null) {
                if (c.piece.color != r.color) {
                    cells.push(c);
                }
                break;
            }
            cells.push(c);
        }

        var legalMoves = cells.map(function (c) {
            Move(r_c, c, r)
        });
        bp.sync({request: [legalMoves], waitFor: AnyMoveEventSet()});
    }
});
//#endregion RookBehaviors

//#region KingBehaviors
// CTX.subscribe("AskMove", "King", function (k) {
//     while (true) {
//         var r_c = getCellWithPiece(k);
//         var cells = [];
//         //right
//         for (var i = r_c.i; i < size; i++) {
//             var c = getCell(i, r_c.j);
//             if (c.piece != null) {
//                 if (c.piece.color != r.color) {
//                     cells.push(c);
//                 }
//                 break;
//             }
//             cells.push(c);
//         }
//         //left
//         for (var i = r_c.i; i >= 0; i--) {
//             var c = getCell(i, r_c.j);
//             if (c.piece != null) {
//                 if (c.piece.color != r.color) {
//                     cells.push(c);
//                 }
//                 break;
//             }
//             cells.push(c);
//         }
//         //up
//         for (var j = r_c.j; j < size; j++) {
//             var c = getCell(r_c.i, j);
//             if (c.piece != null) {
//                 if (c.piece.color != r.color) {
//                     cells.push(c);
//                 }
//                 break;
//             }
//             cells.push(c);
//         }
//         //down
//         for (var j = r_c.j; j >= 0; j--) {
//             var c = getCell(r_c.i, j);
//             if (c.piece != null) {
//                 if (c.piece.color != r.color) {
//                     cells.push(c);
//                 }
//                 break;
//             }
//             cells.push(c);
//         }
//
//         var legalMoves = cells.map(function (c) {
//             Move(r_c, c, r)
//         });
//         bp.sync({request: [legalMoves], waitFor: AnyMoveEventSet()});
//     }
// });
//#endregion KingBehaviors

// function isCellInDanger(color, cell) {
//     //right
//     for (var i = cell.i; i < size; i++) {
//         var c = getCell(i+1, cell.j);
//         if (c.piece != null) {
//             if (c.piece.color != color) {
//                 if (c.piece.type === Piece.Type.queen || c.piece.type === Piece.Type.rook) {
//                     return true;
//                 }
//                 if (c.piece.type === Piece.Type.king && i + 1 === c.i) {
//                     return true;
//                 }
//             }
//         }
//     }
//     //left
//     for (var i = cell.i; i >= 0; i--) {
//         var c = getCell(i, cell.j);
//         if (c.piece != null) {
//             if (c.piece.color != color) {
//                 if (c.piece.type === Piece.Type.queen || c.piece.type === Piece.Type.rook) {
//                     return true;
//                 }
//                 if (c.piece.type === Piece.Type.king && i - 1 === c.i) {
//                     return true;
//                 }
//             }
//         }
//     }
//     //up
//     for (var j = cell.j; j < size; j++) {
//         var c = getCell(cell.i, j);
//         if (c.piece != null) {
//             if (c.piece.color != color) {
//                 if (c.piece.type === Piece.Type.queen || c.piece.type === Piece.Type.rook) {
//                     return true;
//                 }
//                 if (c.piece.type === Piece.Type.king && j + 1 === c.j) {
//                     return true;
//                 }
//             }
//         }
//     }
//     //down
//     for (var j = cell.j; j >= 0; j--) {
//         var c = getCell(cell.i, j);
//         if (c.piece != null) {
//             if (c.piece.color != color) {
//                 if (c.piece.type === Piece.Type.queen || c.piece.type === Piece.Type.rook) {
//                     return true;
//                 }
//                 if (c.piece.type === Piece.Type.king && j - 1 === c.j) {
//                     return true;
//                 }
//             }
//         }
//     }
//     //up-right
//     for (i =cell.i, j=cell.j; i<size && j< size; i++, j++){
//         var c = getCell(i, j);
//         if (c.piece != null) {
//             if (c.piece.color != color) {
//                 if (c.piece.type === Piece.Type.queen || c.piece.type === Piece.Type.bishop) {
//                     return true;
//                 }
//                 if (c.piece.type === Piece.Type.king && cell.i + 1 === c.i && cell.j +1 === c.j) {
//                     return true;
//                 }
//             }
//         }
//     }
// }