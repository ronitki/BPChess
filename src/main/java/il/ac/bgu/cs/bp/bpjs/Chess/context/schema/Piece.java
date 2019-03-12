package il.ac.bgu.cs.bp.bpjs.Chess.context.schema;

/**
 * Created by Ronit on 04-Nov-18.
 */
import javax.persistence.*;

@Entity
@NamedQueries(value = {
        @NamedQuery(name = "Piece", query = "SELECT p FROM Piece p"),
        @NamedQuery(name = "IsAlive", query = "SELECT p FROM Piece p WHERE p.wasEaten=:false"),
        @NamedQuery(name = "UpdatePiece", query = "Update Piece P set P.wasEaten=:wasEaten where P=:piece"),
})
public class Piece extends BasicEntity {
    public Piece() {
        this(null,null,-1);
    }

    public enum Color{
        white, black
    }
    public enum Type{
        king,queen,pawn,rook,bishop,knight
    }

    @Column
    @Enumerated(EnumType.STRING)
    public final Color color;
    @Column
    @Enumerated(EnumType.STRING)
    public final  Type type;
    @Column
    public final int id;
    @Column
    private  boolean wasEaten;

    public Piece(Color color, Type type, int id) {
        super(color +"_" + type + "_" +id );
        this.color = color;
        this.type = type;
        this.id = id;
        this.wasEaten=false;
    }
}

