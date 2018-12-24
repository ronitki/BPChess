package il.ac.bgu.cs.bp.bpjs.Chess.Pieces;

import java.util.Arrays;

/**
 * Created by Ronit on 04-Nov-18.
 */
public class Piece {
    public enum Color{
        white, black
    }
    public enum Type{
        king,queen,pawn,rook,bishop,knight
    }
    private Color color;
    private Type type;
    private int id;

    public Piece(Color color, Type type, int id) {
        this.color = color;
        this.type = type;
        this.id = id;
    }

    public Color getColor() {
        return color;
    }

    public Type getType() {
        return type;
    }

    public int getId() {
        return id;
    }

    @Override
    public String toString() {
        return "Piece{" +
                "color=" + color +
                ", type=" + type +
                ", id=" + id +
                '}';
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
        Piece other = (Piece) obj;
        if (getColor() != other.getColor() || getType() != other.getType() || getId() != other.getId()) {
            return false;
        }

        return true;
    }
}

