package il.ac.bgu.cs.bp.bpjs.Chess.context.schema.piece;

/**
 * Created by Ronit on 04-Nov-18.
 */

import il.ac.bgu.cs.bp.bpjs.Chess.context.schema.BasicEntity;

import javax.persistence.*;

@Entity
@NamedQueries(value = {
        @NamedQuery(name = "Piece", query = "SELECT p FROM Piece p"),
        @NamedQuery(name = "PieceOfType", query = "SELECT p FROM Piece p WHERE p.type =:type"),
        @NamedQuery(name = "DeletePiece", query = "DELETE FROM Piece p Where p=:p"),
})
public class Piece extends BasicEntity {
    public Piece() {
        this(null, null, -1);
    }

    @Enumerated(EnumType.STRING)
    public final Color color;

    @Enumerated(EnumType.STRING)
    public final Type type;

    public Piece(Color color, Type type, int id) {
        super(color + "_" + type + "_" + id);
        this.color = color;
        this.type = type;
    }

}

