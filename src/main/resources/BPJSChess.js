// /**
//  * Created by Ronit on 02-Oct-18.
//  */



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

var isBlackMove = bp.EventSet("Black Move events", function (e) {

    if (e instanceof AMove)
        return  e.getPiece().getColor() == Piece.Color.black;
    return false;

});

var isId_1_Move = bp.EventSet("Id_1 events", function (e) {

    if (e instanceof AMove)
        return  e.getPiece().getId() == 1;
    return false;

});

var isId_2_Move = bp.EventSet("Id_2 events", function (e) {

    if (e instanceof AMove)
        return  e.getPiece().getId() == 2;
    return false;

});

var isIllegal= bp.EventSet("Illegal Moves", function(e){

    if(e instanceof AMove)
        return (e.getTargetX()<0 || e.getTargetX()>7 || e.getTargetY()<0 || e.getTargetY()>7);
    return false;

})


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
    while(true)
        move = bp.sync({request: [
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX() + 1, move.getTargetY(), move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX() + 2, move.getTargetY(), move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX() + 3, move.getTargetY(), move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX() + 4, move.getTargetY(), move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX() + 5, move.getTargetY(), move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX() + 6, move.getTargetY(), move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX() + 7, move.getTargetY(), move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX() - 1, move.getTargetY(), move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX() - 2, move.getTargetY(), move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX() - 3, move.getTargetY(), move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX() - 4, move.getTargetY(), move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX() - 5, move.getTargetY(), move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX() - 6, move.getTargetY(), move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX() - 7, move.getTargetY(), move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY()+1, move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY()+2, move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY()+3, move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY()+4, move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY()+5, move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY()+6, move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY()+7, move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY()-1, move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY()-2, move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY()-3, move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY()-4, move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY()-5, move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY()-6, move.getPiece()),
            Move(move.getTargetX(), move.getTargetY(), move.getTargetX(), move.getTargetY()-7, move.getPiece()),
        ]});

});
bp.registerBThread("move king",function () {
    var move = bp.sync({waitFor: isKingMove});
    bp.sync({waitFor:bp.Event("game_start")});
    while(true) {
        move = bp.sync({request: Move(move.getTargetX(), move.getTargetY(), move.getTargetX() -1 , move.getTargetY()-1, move.getPiece())});
        move = bp.sync({request: Move(move.getTargetX(), move.getTargetY(), move.getTargetX()    , move.getTargetY()-1, move.getPiece())});
        move = bp.sync({request: Move(move.getTargetX(), move.getTargetY(), move.getTargetX() +1 , move.getTargetY()-1, move.getPiece())});
        move = bp.sync({request: Move(move.getTargetX(), move.getTargetY(), move.getTargetX() -1 , move.getTargetY()  , move.getPiece())});
        move = bp.sync({request: Move(move.getTargetX(), move.getTargetY(), move.getTargetX() +1 , move.getTargetY()  , move.getPiece())});
        move = bp.sync({request: Move(move.getTargetX(), move.getTargetY(), move.getTargetX() -1 , move.getTargetY()+1, move.getPiece())});
        move = bp.sync({request: Move(move.getTargetX(), move.getTargetY(), move.getTargetX()    , move.getTargetY()+1, move.getPiece())});
        move = bp.sync({request: Move(move.getTargetX(), move.getTargetY(), move.getTargetX() +1 , move.getTargetY()+1, move.getPiece())});
    }
});


 bp.registerBThread("EnforceTurns", function() {
     bp.sync({waitFor:bp.Event("game_start")});
     while (true) {
         bp.sync({waitFor:isBlackMove,block:isWhiteMove});
         bp.sync({waitFor:isWhiteMove,block:isBlackMove});
     }
     });

//