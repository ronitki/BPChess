package il.ac.bgu.cs.bp.bpjs.Chess.events;

import il.ac.bgu.cs.bp.bpjs.Chess.context.schema.Cell;
import il.ac.bgu.cs.bp.bpjs.Chess.context.schema.Piece;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.eventsets.EventSet;

/**
 * Created by Ronit on 04-Nov-18.
 */
public class Move extends BEvent {
    public final Cell source;
    public final Cell target;
    public final Piece piece;

    public Move(Cell source, Cell target, Piece piece){
        this.source = source;
        this.target = target;
        this.piece = piece;
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
        Move other = (Move) obj;
        return source.equals(other.source) && target.equals(other.target) && piece.equals(other.piece);
    }

    public static class AnyMoveEventSet implements EventSet {
        @Override
        public boolean contains(BEvent bEvent) {
            return bEvent instanceof Move;
        }
    }

    public static class PieceMoveEventSet implements EventSet {
        private final Piece p;

        public PieceMoveEventSet(Piece p) {
            this.p = p;
        }

        @Override
        public boolean contains(BEvent bEvent) {
            return bEvent instanceof Move && ((Move)bEvent).piece.equals(p);
        }
    }

    public static class ColorMoveEventSet implements EventSet {
        private final Piece.Color c;

        public ColorMoveEventSet(Piece.Color c) {
            this.c = c;
        }

        @Override
        public boolean contains(BEvent bEvent) {
            return bEvent instanceof Move && ((Move)bEvent).piece.color.equals(c);
        }
    }
}
