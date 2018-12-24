package il.ac.bgu.cs.bp.bpjs.Chess.events;

import il.ac.bgu.cs.bp.bpjs.Chess.Pieces.Piece;

/**
 * Created by Ronit on 04-Nov-18.
 */
public class Eat extends AMove {

    public Eat(int sx, int sy, int tx, int ty, Piece p) {
        super(sx,sy,tx,ty,p);
    }

    @Override
     public String toString() {
        return "Ate " + getPiece() + " From " +getSourceX()+","+getSourceY()+ " To "+ getTargetX()+","+getTargetY();
    }
}
