package il.ac.bgu.cs.bp.bpjs.Chess.events;

/**
 * Created by Ronit on 02-Oct-18.
 */

import il.ac.bgu.cs.bp.bpjs.Chess.Pieces.Piece;
//import org.apache.commons.lang3.NotImplementedException;

import il.ac.bgu.cs.bp.bpjs.model.BEvent;


@SuppressWarnings("serial")
public class Move extends AMove {


    public Move(int sx, int sy, int tx, int ty, Piece p) {
        sourceX=sx;
        sourceY=sy;
        targetX=tx;
        targetY=ty;
        piece=p;
    }

    @Override
    public String toString() {
        return "Moved" + this.piece.toString() + " From " +this.sourceX+","+this.sourceY+ " To "+ this.targetX+","+this.targetY;
    }


    //    public int row;
//    public int col;
//
//    public Move(int row, int col, String type, String color) {
//        super(color +" - "+ type + "(" + row + "," + col + ")");
//        this.row = row;
//        this.col = col;
//    }
//
//    /**
//     * A string to display on the board to represent the occurrence of this
//     * event.
//     */
//    public String displayString() {
//        throw new NotImplementedException(name);
//    }
//
//    /*
//     * @see java.lang.Object#equals(java.lang.Object)
//     */
//    @Override
//    public boolean equals(Object obj) {
//        if (this == obj) {
//            return true;
//        }
//        if (obj == null) {
//            return false;
//        }
//        if (!getClass().isInstance(obj)) {
//            return false;
//        }
//        il.ac.bgu.cs.bp.bpjs.Chess.events.Move other = (il.ac.bgu.cs.bp.bpjs.Chess.events.Move) obj;
//        if (col != other.col) {
//            return false;
//        }
//        if (row != other.row) {
//            return false;
//        }
//        return true;
//    }

}
