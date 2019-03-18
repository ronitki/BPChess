package il.ac.bgu.cs.bp.bpjs.Chess.context.schema;

/**
 * Created by Ronit on 04-Nov-18.
 */

import javax.persistence.*;

@Entity
@NamedQueries(value = {
        @NamedQuery(name = "Piece", query = "SELECT p FROM Piece p"),
        @NamedQuery(name = "Rook", query = "SELECT p FROM Piece p WHERE p.type=Piece.Type.rook"),
        @NamedQuery(name = "King", query = "SELECT p FROM Piece p WHERE p.type=Piece.Type.king"),
        @NamedQuery(name = "DeletePiece", query = "DELETE FROM Piece p Where p=:p"),
})
public class Piece extends BasicEntity {
    public Piece() {
        this(null, null, -1);
    }

    public enum Color {
        white, black
    }

    public enum Type {
        king, queen, pawn, rook, bishop, knight
    }

    @Column
    @Enumerated(EnumType.STRING)
    public final Color color;
    @Column
    @Enumerated(EnumType.STRING)
    public final Type type;
    @Column
    public final int id;

    public Piece(Color color, Type type, int id) {
        super(color + "_" + type + "_" + id);
        this.color = color;
        this.type = type;
        this.id = id;
    }
}

