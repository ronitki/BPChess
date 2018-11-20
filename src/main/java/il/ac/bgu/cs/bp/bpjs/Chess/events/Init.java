package il.ac.bgu.cs.bp.bpjs.Chess.events;

import il.ac.bgu.cs.bp.bpjs.Chess.Pieces.Piece;

/**
 * Created by Ronit on 04-Nov-18.
 */
public class Init extends AMove {
    public Init(int sx, int sy,int tx, int ty, Piece p) {
        sourceX=-1;
        sourceY=-1;
        targetX=tx;
        targetY=ty;
        piece=p;
    }
    @Override
    public String toString() {
        return "Init" + this.piece.toString() + " From " +this.sourceX+","+this.sourceY+ " To "+ this.targetX+","+this.targetY;

    }
}
