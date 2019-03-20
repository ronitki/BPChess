package il.ac.bgu.cs.bp.bpjs.Chess.context.schema;

import il.ac.bgu.cs.bp.bpjs.Chess.context.schema.piece.Piece;

import javax.persistence.*;

@Entity
@NamedQueries(value = {
        @NamedQuery(name = "Cell", query = "SELECT c FROM Cell c"),
        @NamedQuery(name = "NonEmptyCell", query = "SELECT c FROM Cell c WHERE not(c.piece is null)"),
        @NamedQuery(name = "EmptyCell", query = "SELECT c FROM Cell c WHERE c.piece is null"),
        @NamedQuery(name = "SpecificCell", query = "SELECT c FROM Cell c WHERE c.i=:i AND c.j=:j"),
        @NamedQuery(name = "CellWithPiece", query = "SELECT c FROM Cell c WHERE c.piece=:p"),
        @NamedQuery(name = "UpdateCell", query = "Update Cell C set C.piece=:piece where C=:cell"),
})
public class Cell extends BasicEntity {
    @Column
    public final int i;
    @Column
    public final int j;
    @OneToOne
    public final Piece piece;

    protected Cell() {
        this(0, 0, null);
    }

    public Cell(int i, int j) {
        this(i, j, null);
    }

    public Cell(int i, int j, Piece p) {
        super("cell(" + i + "," + j + ")");
        this.i = i;
        this.j = j;
        this.piece = p;
    }

    @Override
    public String toString() {
        return "cell(" + i + "," + j + ")" + (piece == null ? "Empty" : piece.toString());
    }
}