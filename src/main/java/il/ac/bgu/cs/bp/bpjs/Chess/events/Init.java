package il.ac.bgu.cs.bp.bpjs.Chess.events;

import il.ac.bgu.cs.bp.bpjs.Chess.Pieces.Piece;

/**
 * Created by Ronit on 04-Nov-18.
 */
public class Init extends AMove {
    public Init(int tx, int ty, Piece p) {
        super(-1,-1, tx, ty, p);
    }

    @Override
    public String toString() {
        return "Placed " + getPiece() + " at "+ getTargetX()+","+getTargetY();

    }
}
