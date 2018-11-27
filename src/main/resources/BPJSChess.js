// /**
//  * Created by Ronit on 02-Oct-18.
//  */


//check check
importPackage(Packages.il.ac.bgu.cs.bp.bpjs.Chess.events);
importPackage(Packages.il.ac.bgu.cs.bp.bpjs.Chess.Pieces);


var isRookMove = bp.EventSet("Rook Move events", function (e) {

    if (e instanceof AMove)
       return  e.getPiece().getType() == Piece.Type.rook;
return false;

});
var isKingMove = bp.EventSet("King Move events", function (e) {

    if (e instanceof AMove)
        return  e.getPiece().getType() == Piece.Type.king;
    return false;

});
var isWhiteMove = bp.EventSet("White Move events", function (e) {

    if (e instanceof AMove)
        return  e.getPiece().getColor() == Piece.Color.white;
    return false;

});

var isIllegal= bp.EventSet("Illegal Moves", function(e){

    if(e instanceof AMove)
        return (e.getTargetX()<0 || e.getTargetX()>7 || e.getTargetY()<0 || e.getTargetY()>7);
    return false;

})

//
// var coldEvent = bp.Event("coldEvent");
// var hotEvent = bp.Event("hotEvent");
//
 bp.log.info('Chess - Let the game begin!');
bp.registerBThread("game_duration", function () {
    bp.sync({ request:bp.Event("init_start")});
    bp.sync({ waitFor:bp.Event("init_end")});
    bp.sync({ request:bp.Event("game_start")});
    bp.sync({ waitFor:bp.Event("game_end")});



});

bp.registerBThread("init_Start_thread",function(){
    bp.sync({ waitFor:bp.Event("init_start")});
    bp.sync({ request:Init(-1,-1,4,4,new Piece(Piece.Color.black ,Piece.Type.rook ,1))});
    bp.sync({ request:Init(-1,-1,1,4,new Piece(Piece.Color.black,Piece.Type.rook, 2))});
    bp.sync({ request:Init(-1,-1,2,3,new Piece(Piece.Color.black,Piece.Type.king,1))});
    bp.sync({ request:Init(-1,-1,6,5,new Piece(Piece.Color.white,Piece.Type.king ,1))});
    bp.sync({ request:bp.Event("init_end")});
});


bp.registerBThread("block illegal moves", function () {
    while (true) {

        bp.sync({block: isIllegal});
    }

})

bp.registerBThread("move rook",function () {
    var move = bp.sync({waitFor: isRookMove});
    bp.sync({waitFor:bp.Event("game_start")});
    while(true) {
        move = bp.sync({request: Move(move.getTargetX(), move.getTargetY(), move.getTargetX() + 2,
                move.getTargetY(), move.getPiece())});
    }
});


// bp.registerBThread("move black rook 1",function () {
//     while(true) {
//         var rook = bp.sync({waitFor: [isRook1]});
//         if(rook instanceof Init)
//             bp.sync({waitFor: bp.Event("game_start")});
//
//         bp.sync({request: Move(rook.getTargetX(), rook.getTargetY(), rook.getTargetX() + 2, rook.getTargetY(), rook.getPiece())});
//     }
// });

// bp.registerBThread("verification_1",function () {
//      bp.sync({request: Move(rook.getTargetX(), rook.getTargetY(), rook.getTargetX() + 2, rook.getTargetY(), rook.getPiece())});
//
// });





//
// var isRook1 = bp.EventSet("Move events", function(e) {
//     bp.log.info("hi");
//     if (e instanceof AMove)
//        return( e.getPiece.getType()==Piece.Type.rook && e.getPiece.getId()==1 );
//     return false;
// });
//
//
//
// // GameRules:
// //x-white
// //o-black
//
// // This BThreads are on each square of the grid
// // function addSquareBThreads(row, col) {
// //
// //     // Detects mouse click-
// //     //
// //     /*to check how to do draggable/ know what type of character was pressed*/
// //     //
// //     bp.registerBThread("ClickHandler(" + row + "," + col + ")", function() {
// //         while (true) {
// //             bp.sync({ waitFor:[ Click(row, col) ] });
// //             bp.sync({ request:[ Black(row, col) ] }); //to fix!!!!
// //         }
// //     });
// //
// //     // Blocks further marking of a square already marked by white or black.
// //     bp.registerBThread("SquareTaken(" + row + "," + col + ")", function() {
// //         while (true) {
// //             bp.sync({ waitFor:[ White(row, col), Black(row, col) ] });
// //             bp.sync({ block:[ White(row, col), Black(row, col) ] });
// //         }
// //     });
// // }
// //
// // for (var r = 0; r < 8; r++) {
// //     for (var c = 0; c < 8; c++) {
// //         addSquareBThreads(r, c);
// //     }
// // }
// //
// // // Represents Enforce Turns
// // bp.registerBThread("EnforceTurns", function() {
// //     while (true) {
// //         bp.sync({ waitFor:[ White(0, 0), White(0, 1), White(0, 2),White(0, 3),White(0, 4),White(0, 5),White(0, 6),White(0, 7),
// //             White(1, 0), White(1, 1), White(1, 2),White(1, 3),White(1, 4),White(1, 5),White(1, 6),White(1, 7),
// //             White(2, 0), White(2, 1), White(2, 2),White(2, 3),White(2, 4),White(2, 5),White(2, 6),White(2, 7),
// //             White(3, 0), White(3, 1), White(3, 2),White(3, 3),White(3, 4),White(3, 5),White(3, 6),White(3, 7),
// //             White(4, 0), White(4, 1), White(4, 2),White(4, 3),White(4, 4),White(4, 5),White(4, 6),White(4, 7),
// //             White(5, 0), White(5, 1), White(5, 2),White(5, 3),White(5, 4),White(5, 5),White(5, 6),White(5, 7),
// //             White(6, 0), White(6, 1), White(6, 2),White(6, 3),White(6, 4),White(6, 5),White(6, 6),White(6, 7),
// //             White(7, 0), White(7, 1), White(7, 2),White(7, 3),White(7, 4),White(7, 5),White(7, 6),White(7, 7)],
// //
// //             block:[Black(0, 0), Black(0, 1), Black(0, 2),Black(0, 3),Black(0, 4),Black(0, 5),Black(0, 6),Black(0, 7),
// //                 Black(1, 0), Black(1, 1), Black(1, 2),Black(1, 3),Black(1, 4),Black(1, 5),Black(1, 6),Black(1, 7),
// //                 Black(2, 0), Black(2, 1), Black(2, 2),Black(2, 3),Black(2, 4),Black(2, 5),Black(2, 6),Black(2, 7),
// //                 Black(3, 0), Black(3, 1), Black(3, 2),Black(3, 3),Black(3, 4),Black(3, 5),Black(3, 6),Black(3, 7),
// //                 Black(4, 0), Black(4, 1), Black(4, 2),Black(4, 3),Black(4, 4),Black(4, 5),Black(4, 6),Black(4, 7),
// //                 Black(5, 0), Black(5, 1), Black(5, 2),Black(5, 3),Black(5, 4),Black(5, 5),Black(5, 6),Black(5, 7),
// //                 Black(6, 0), Black(6, 1), Black(6, 2),Black(6, 3),Black(6, 4),Black(6, 5),Black(6, 6),Black(6, 7),
// //                 Black(7, 0), Black(7, 1), Black(7, 2),Black(7, 3),Black(7, 4),Black(7, 5),Black(7, 6),Black(7, 7) ] });
// //
// //         bp.sync({ waitFor:[ Black(0, 0), Black(0, 1), Black(0, 2),Black(0, 3),Black(0, 4),Black(0, 5),Black(0, 6),Black(0, 7),
// //             Black(1, 0), Black(1, 1), Black(1, 2),Black(1, 3),Black(1, 4),Black(1, 5),Black(1, 6),Black(1, 7),
// //             Black(2, 0), Black(2, 1), Black(2, 2),Black(2, 3),Black(2, 4),Black(2, 5),Black(2, 6),Black(2, 7),
// //             Black(3, 0), Black(3, 1), Black(3, 2),Black(3, 3),Black(3, 4),Black(3, 5),Black(3, 6),Black(3, 7),
// //             Black(4, 0), Black(4, 1), Black(4, 2),Black(4, 3),Black(4, 4),Black(4, 5),Black(4, 6),Black(4, 7),
// //             Black(5, 0), Black(5, 1), Black(5, 2),Black(5, 3),Black(5, 4),Black(5, 5),Black(5, 6),Black(5, 7),
// //             Black(6, 0), Black(6, 1), Black(6, 2),Black(6, 3),Black(6, 4),Black(6, 5),Black(6, 6),Black(6, 7),
// //             Black(7, 0), Black(7, 1), Black(7, 2),Black(7, 3),Black(7, 4),Black(7, 5),Black(7, 6),Black(7, 7) ],
// //
// //
// //
// //             block:[ White(0, 0), White(0, 1), White(0, 2),White(0, 3),White(0, 4),White(0, 5),White(0, 6),White(0, 7),
// //                 White(1, 0), White(1, 1), White(1, 2),White(1, 3),White(1, 4),White(1, 5),White(1, 6),White(1, 7),
// //                 White(2, 0), White(2, 1), White(2, 2),White(2, 3),White(2, 4),White(2, 5),White(2, 6),White(2, 7),
// //                 White(3, 0), White(3, 1), White(3, 2),White(3, 3),White(3, 4),White(3, 5),White(3, 6),White(3, 7),
// //                 White(4, 0), White(4, 1), White(4, 2),White(4, 3),White(4, 4),White(4, 5),White(4, 6),White(4, 7),
// //                 White(5, 0), White(5, 1), White(5, 2),White(5, 3),White(5, 4),White(5, 5),White(5, 6),White(5, 7),
// //                 White(6, 0), White(6, 1), White(6, 2),White(6, 3),White(6, 4),White(6, 5),White(6, 6),White(6, 7),
// //                 White(7, 0), White(7, 1), White(7, 2),White(7, 3),White(7, 4),White(7, 5),White(7, 6),White(7, 7) ] });
// //     }
// // });
//
// // // Represents when the game ends
// // bp.registerBThread("EndOfGame", function() {
// //     bp.sync({ waitFor:[ StaticEvents.BlackWin, StaticEvents.WhiteWin, StaticEvents.draw ] });
// //
// //     bp.sync({ block:[ White(0, 0), White(0, 1), White(0, 2),White(0, 3),White(0, 4),White(0, 5),White(0, 6),White(0, 7),
// //         White(1, 0), White(1, 1), White(1, 2),White(1, 3),White(1, 4),White(1, 5),White(1, 6),White(1, 7),
// //         White(2, 0), White(2, 1), White(2, 2),White(2, 3),White(2, 4),White(2, 5),White(2, 6),White(2, 7),
// //         White(3, 0), White(3, 1), White(3, 2),White(3, 3),White(3, 4),White(3, 5),White(3, 6),White(3, 7),
// //         White(4, 0), White(4, 1), White(4, 2),White(4, 3),White(4, 4),White(4, 5),White(4, 6),White(4, 7),
// //         White(5, 0), White(5, 1), White(5, 2),White(5, 3),White(5, 4),White(5, 5),White(5, 6),White(5, 7),
// //         White(6, 0), White(6, 1), White(6, 2),White(6, 3),White(6, 4),White(6, 5),White(6, 6),White(6, 7),
// //         White(7, 0), White(7, 1), White(7, 2),White(7, 3),White(7, 4),White(7, 5),White(7, 6),White(7, 7),
// //         Black(0, 0), Black(0, 1), Black(0, 2),Black(0, 3),Black(0, 4),Black(0, 5),Black(0, 6),Black(0, 7),
// //         Black(1, 0), Black(1, 1), Black(1, 2),Black(1, 3),Black(1, 4),Black(1, 5),Black(1, 6),Black(1, 7),
// //         Black(2, 0), Black(2, 1), Black(2, 2),Black(2, 3),Black(2, 4),Black(2, 5),Black(2, 6),Black(2, 7),
// //         Black(3, 0), Black(3, 1), Black(3, 2),Black(3, 3),Black(3, 4),Black(3, 5),Black(3, 6),Black(3, 7),
// //         Black(4, 0), Black(4, 1), Black(4, 2),Black(4, 3),Black(4, 4),Black(4, 5),Black(4, 6),Black(4, 7),
// //         Black(5, 0), Black(5, 1), Black(5, 2),Black(5, 3),Black(5, 4),Black(5, 5),Black(5, 6),Black(5, 7),
// //         Black(6, 0), Black(6, 1), Black(6, 2),Black(6, 3),Black(6, 4),Black(6, 5),Black(6, 6),Black(6, 7),
// //         Black(7, 0), Black(7, 1), Black(7, 2),Black(7, 3),Black(7, 4),Black(7, 5),Black(7, 6),Black(7, 7)
// //
// //     ] });
// // });
// //
// //
//
