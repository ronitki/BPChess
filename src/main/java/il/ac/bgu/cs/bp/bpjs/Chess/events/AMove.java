package il.ac.bgu.cs.bp.bpjs.Chess.events;

import il.ac.bgu.cs.bp.bpjs.Chess.Pieces.Piece;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;

/**
 * Created by Ronit on 04-Nov-18.
 */
public abstract class AMove extends BEvent {

    protected int sourceX;
    protected int sourceY;
    protected int targetX;
    protected int targetY;
    protected Piece piece;

    public int getSourceX() {
        return sourceX;
    }

    public void setSourceX(int sourceX) {
        this.sourceX = sourceX;
    }

    public int getSourceY() {
        return sourceY;
    }

    public void setSourceY(int sourceY) {
        this.sourceY = sourceY;
    }

    public int getTargetX() {
        return targetX;
    }

    public void setTargetX(int targetX) {
        this.targetX = targetX;
    }

    public int getTargetY() {
        return targetY;
    }

    public void setTargetY(int targetY) {
        this.targetY = targetY;
    }

    public Piece getPiece() {
        return piece;
    }

    public void setPiece(Piece piece) {
        this.piece = piece;
    }
    public abstract String toString();
}
