package il.ac.bgu.cs.bp.bpjs.Chess.events;

/**
 * Created by Ronit on 02-Oct-18.
 */
import il.ac.bgu.cs.bp.bpjs.model.BEvent;

/**
 * An event that is requested (with high priority) whenever the user presses a
 * button on the game board.
 */
@SuppressWarnings("serial")
public class Click extends BEvent {

    /**
     * Row of the pressed button
     */
    public int row;

    /**
     * Column of the pressed button
     */
    public int col;

    /**
     * Constructor.
     *
     * @param row
     *            Row of the pressed button
     * @param col
     *            Column of the pressed button
     */
    public Click(int row, int col) {
        super("Click(" + row + "," + col + ")");
        this.row = row;
        this.col = col;
    }

    /**
     * @see java.lang.Object#toString()
     */

}
