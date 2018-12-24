package il.ac.bgu.cs.bp.bpjs.Chess.events;

import il.ac.bgu.cs.bp.bpjs.Chess.Pieces.Piece;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;

/**
 * Created by Ronit on 04-Nov-18.
 */
public abstract class AMove extends BEvent {
    private int sourceX;
    private int sourceY;
    private int targetX;
    private int targetY;
    private Piece piece;

    public AMove (int sourceX, int sourceY, int targetX, int targetY, Piece piece){
        this.sourceX = sourceX;
        this.sourceY = sourceY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.piece = piece;
    }

    public int getSourceX() {
        return sourceX;
    }

    public int getSourceY() {
        return sourceY;
    }

    public int getTargetX() {
        return targetX;
    }

    public int getTargetY() {
        return targetY;
    }

    public Piece getPiece() {
        return piece;
    }

    /*
     * @see java.lang.Object#equals(java.lang.Object)
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (!getClass().isInstance(obj)) {
            return false;
        }
        AMove other = (AMove) obj;
        if (getSourceX() != other.getSourceX() || getSourceY() != other.getSourceY() || getTargetX() != other.getTargetX() || getTargetY() != other.getTargetY()) {
            return false;
        }

        return getPiece().equals(other.getPiece());
    }
}
