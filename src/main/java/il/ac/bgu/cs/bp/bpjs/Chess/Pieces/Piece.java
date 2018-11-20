package il.ac.bgu.cs.bp.bpjs.Chess.Pieces;

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


    public Piece(Color color,Type type, int id) {
        this.color = color;
        this.type = type;
        this.id = id;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "Piece{" +
                "color=" + color +
                ", type=" + type +
                ", id=" + id +
                '}';
    }
}

