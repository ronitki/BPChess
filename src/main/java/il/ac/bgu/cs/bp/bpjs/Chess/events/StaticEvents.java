package il.ac.bgu.cs.bp.bpjs.Chess.events;

import il.ac.bgu.cs.bp.bpjs.model.BEvent;

/**
 * Created by Ronit on 02-Oct-18.
 */
import il.ac.bgu.cs.bp.bpjs.model.BEvent;

@SuppressWarnings({ "serial" })
public class StaticEvents {
    static public BEvent draw = new BEvent("Draw") {
    };

    static public BEvent WhiteWin = new BEvent("WhiteWin") {
    };

    static public BEvent BlackWin = new BEvent("BlackWin") {
    };

}
