// /**
//  * Created by Ronit on 02-Oct-18.
//  */

importPackage(Packages.il.ac.bgu.cs.bp.bpjs.Chess.events);
importPackage(Packages.il.ac.bgu.cs.bp.bpjs.Chess.Pieces);

var isGameEnded = bp.EventSet("GameEnded Events", function (e) {
    return (e instanceof GameEnded);
});

var isAMove = bp.EventSet("Move events", function (e) {
    return (e instanceof AMove);
});

var isAmoveInPlace = bp.EventSet("AMove In Place events", function (e) {
    if (e instanceof AMove) {
        return (e.getSourceX() === e.getTargetX() && e.getSourceY() === e.getTargetY());
    }
    return false;
});

var isWhiteMove = bp.EventSet("White Move events", function (e) {
    if (e instanceof AMove) {
        return e.getPiece().getColor() === Piece.Color.white;
    }
    return false;

});

var isBlackMove = bp.EventSet("Black Move events", function (e) {
    if (e instanceof AMove) {
        return e.getPiece().getColor() === Piece.Color.black;
    }
    return false;
});

var outOfBoardMove = bp.EventSet("Illegal out of board moves", function (e) {
    if (e instanceof AMove) {
        return (e.getTargetX() < 0 || e.getTargetX() > 7 || e.getTargetY() < 0 || e.getTargetY() > 7);
    }
    return false;
});

var arrOfAMoveTo = new Array(8);
var arrOfAMoveFrom = new Array(8);
var arrOfMoveTo = new Array(8);
var arrOfEatTo = new Array(8);


function cellInitialization(i,j) {
    //  EVENT SETS FOR CELLS
    arrOfAMoveTo[i][j] = bp.EventSet("AMove To_" + i + "_" + j, function (e) {
        if (e instanceof AMove) {
            return (e.getTargetX() === i && e.getTargetY() === j);
        }
        return false;
    });
    arrOfAMoveFrom[i][j] = bp.EventSet("AMove From_" + i + "_" + j, function (e) {
        if (e instanceof AMove) {
            return (e.getSourceX() === i && e.getSourceY() === j);
        }
        return false;
    });
    arrOfMoveTo[i][j] = bp.EventSet("Move To_" + i + "_" + j, function (e) {
        if (e instanceof Move) {
            return (e.getTargetX() === i && e.getTargetY() === j);
        }
        return false;
    });
    arrOfEatTo[i][j] = bp.EventSet("Eat To_" + i + "_" + j, function (e) {
        if (e instanceof Eat) {
            return (e.getTargetX() === i && e.getTargetY() === j);
        }
        return false;
    });

    // BTHREADS FOR CELLS
    bp.registerBThread("block move to occupied cell_" + i + "_" + j, function () {

        //bp.sync({waitFor: bp.Event("game_start")});
        while (true) {
            bp.sync({waitFor: arrOfAMoveTo[i][j]});
            bp.sync({block: arrOfMoveTo[i][j], waitFor: arrOfAMoveFrom[i][j]});
        }
    });
    bp.registerBThread("block move from empty cell_" + i + "_" + j, function () {
       //  bp.sync({waitFor: bp.Event("game_start")});
        while (true) {
            bp.sync({waitFor: arrOfAMoveTo[i][j], block: arrOfAMoveFrom[i][j]});
            bp.sync({waitFor: arrOfAMoveFrom[i][j]});
        }
    });
    bp.registerBThread("block eat to empty cell_" + i + "_" + j, function () {
        // bp.sync({waitFor: bp.Event("game_start")});
        while (true) {
            bp.sync({waitFor: arrOfAMoveTo[i][j], block: arrOfEatTo[i][j]});
            bp.sync({waitFor: arrOfAMoveFrom[i][j]});
        }
    });
}
for (var i = 0; i < 8; i++) {
    arrOfAMoveTo [i] = new Array(8);
    arrOfAMoveFrom[i] = new Array(8);
    arrOfMoveTo[i] = new Array(8);
    arrOfEatTo[i]=new Array(8);
    for (var j = 0; j < 8; j++) {
        cellInitialization(i, j);
    }
}
bp.registerBThread("game_duration", function () {
    bp.sync({ request: bp.Event("init_start") });
    bp.sync({ waitFor: bp.Event("init_end") });
    bp.sync({ request: bp.Event("game_start") });
    bp.sync({ waitFor: isGameEnded });
});


function rookBTs(color, id) {
    var rookMoveES = bp.EventSet(color + " rook " + id +" move", function (e) {
        if (!(e instanceof AMove)) { return false };
        p = e.getPiece();
        return p.getType() === Piece.Type.rook && p.getColor() === color && p.getId() === id;
    });
    bp.registerBThread("move rook "+color+" "+id, function () {
        var move = bp.sync({ waitFor: rookMoveES });
        bp.sync({waitFor: bp.Event("game_start")});
        bp.log.info("arrived here");
        while (true)
            move = bp.sync({
                request: [
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX() + 1, move.getTargetY(), move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX() + 2, move.getTargetY(), move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX() + 3, move.getTargetY(), move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX() + 4, move.getTargetY(), move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX() + 5, move.getTargetY(), move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX() + 6, move.getTargetY(), move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX() + 7, move.getTargetY(), move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX() - 1, move.getTargetY(), move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX() - 2, move.getTargetY(), move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX() - 3, move.getTargetY(), move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX() - 4, move.getTargetY(), move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX() - 5, move.getTargetY(), move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX() - 6, move.getTargetY(), move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX() - 7, move.getTargetY(), move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() + 1, move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() + 2, move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() + 3, move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() + 4, move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() + 5, move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() + 6, move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() + 7, move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() - 1, move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() - 2, move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() - 3, move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() - 4, move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() - 5, move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() - 6, move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() - 7, move.getPiece())
                ]
            });
    });
    bp.registerBThread("eat rook "+color+" "+id, function () {
        var move = bp.sync({ waitFor: rookMoveES });
        bp.sync({waitFor: bp.Event("game_start")});
        bp.log.info("arrived here");
        while (true)
            move = bp.sync({
                request: [
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX() + 1, move.getTargetY(), move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX() + 2, move.getTargetY(), move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX() + 3, move.getTargetY(), move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX() + 4, move.getTargetY(), move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX() + 5, move.getTargetY(), move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX() + 6, move.getTargetY(), move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX() + 7, move.getTargetY(), move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX() - 1, move.getTargetY(), move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX() - 2, move.getTargetY(), move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX() - 3, move.getTargetY(), move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX() - 4, move.getTargetY(), move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX() - 5, move.getTargetY(), move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX() - 6, move.getTargetY(), move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX() - 7, move.getTargetY(), move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() + 1, move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() + 2, move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() + 3, move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() + 4, move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() + 5, move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() + 6, move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() + 7, move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() - 1, move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() - 2, move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() - 3, move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() - 4, move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() - 5, move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() - 6, move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() - 7, move.getPiece())
                ]
            });
    });
}

function kingBTs(color) {
    var isKingMove = bp.EventSet(color + " King Move events", function (e) {
        if (!(e instanceof AMove)) { return false };
        p = e.getPiece();
        return p.getType() === Piece.Type.king && p.getColor() === color;
    });

    bp.registerBThread("move king " + color, function () {
        var move = bp.sync({waitFor: isKingMove});
        bp.sync({waitFor: bp.Event("game_start")});
        while (true) {
            move = bp.sync({
                request: [
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX() - 1, move.getTargetY() - 1, move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() - 1, move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX() + 1, move.getTargetY() - 1, move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX() - 1, move.getTargetY(), move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX() + 1, move.getTargetY(), move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX() - 1, move.getTargetY() + 1, move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() + 1, move.getPiece()),
                    new Move(move.getTargetX(), move.getTargetY(), move.getTargetX() + 1, move.getTargetY() + 1, move.getPiece())
                ]
            });
        }
    });
    bp.registerBThread("eat king " + color, function () {
        var move = bp.sync({waitFor: isKingMove});
        bp.sync({waitFor: bp.Event("game_start")});
        while (true) {
            move = bp.sync({
                request: [
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX() - 1, move.getTargetY() - 1, move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() - 1, move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX() + 1, move.getTargetY() - 1, move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX() - 1, move.getTargetY(), move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX() + 1, move.getTargetY(), move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX() - 1, move.getTargetY() + 1, move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY() + 1, move.getPiece()),
                    new Eat(move.getTargetX(), move.getTargetY(), move.getTargetX() + 1, move.getTargetY() + 1, move.getPiece())
                ]
            });
        }
    });
}

function initPiecesBTs() {
    var colors = [Piece.Color.black, Piece.Color.white];
    for (var i=0; i<colors.length; i++) {
        kingBTs(colors[i]);
        for (var j=1; j<=2; j++) {
            rookBTs(colors[i], j);
        }
    }
}
initPiecesBTs();

bp.registerBThread("block out of board moves", function () {
    bp.sync({ block: outOfBoardMove });
});

bp.registerBThread("EnforceTurns", function () {
    bp.sync({waitFor: bp.Event("game_start")});
    while (true) {
        bp.sync({waitFor: isBlackMove, block: isWhiteMove});
        bp.sync({waitFor: isWhiteMove, block: isBlackMove});
    }
});

bp.registerBThread("block moving to the same place", function () {
    bp.sync({waitFor: bp.Event("game_start")});
    bp.sync({block: isAmoveInPlace});
});

bp.registerBThread("init_Start_thread", function () {
    bp.sync({waitFor: bp.Event("init_start")});
    bp.sync({request: Init(4, 4, new Piece(Piece.Color.black, Piece.Type.rook, 1))});
    bp.sync({request: Init(6, 5, new Piece(Piece.Color.white, Piece.Type.king, 1))});
    bp.sync({request: Init(1, 4, new Piece(Piece.Color.black, Piece.Type.rook, 2))});
    bp.sync({request: Init(2, 3, new Piece(Piece.Color.black, Piece.Type.king, 1))});
    bp.sync({request: bp.Event("init_end")});
});

bp.registerBThread("StopAfter10Moves", function () {
    bp.sync({waitFor: bp.Event("game_start")});
    for (var i = 0; i < 10; i++) {
        bp.sync({waitFor: isAMove});
    }
    bp.log.info("Arrived 10 moves");
    bp.sync({block: isAMove});
});
//
// bp.registerBThread("test", function () {
//     bp.log.info("LaaaaaaaaaaaaaaaaaaaaaLLLLALALAAA");
//     bp.sync({waitFor: bp.Event("game_start")});
//     bp.sync({request: Eat(4, 4,6,5, new Piece(Piece.Color.black, Piece.Type.rook, 1))});
//     bp.log.info("hello");
//     bp.sync({request: Move(6, 5,4,4, new Piece(Piece.Color.black, Piece.Type.rook, 1))});
//     bp.log.info("heloooo");
//     bp.sync({request: Move(4, 4,6,5, new Piece(Piece.Color.black, Piece.Type.rook, 1))});
//     bp.log.info("hiiiiiiiiii");
// });
