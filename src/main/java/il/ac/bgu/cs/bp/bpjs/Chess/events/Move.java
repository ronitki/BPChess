package il.ac.bgu.cs.bp.bpjs.Chess.events;

import il.ac.bgu.cs.bp.bpjs.Chess.Pieces.Piece;

/**
 * Created by Ronit on 02-Oct-18.
 */
@SuppressWarnings("serial")
public class Move extends AMove {
    public Move(int sx, int sy, int tx, int ty, Piece p) {
        super(sx,sy,tx,ty,p);
    }

    @Override
    public String toString() {
        return "Moved" + getPiece() + " From " +getSourceX()+","+getSourceY()+ " To "+ getTargetX()+","+getTargetY();
    }
}

