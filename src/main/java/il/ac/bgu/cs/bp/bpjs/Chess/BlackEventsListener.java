package il.ac.bgu.cs.bp.bpjs.Chess;

/**
 * Created by Ronit on 24-Oct-18.
 */
import il.ac.bgu.cs.bp.bpjs.Chess.events.Move;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.BProgramRunnerListenerAdapter;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;

import java.util.HashMap;
import java.util.Map;

public class BlackEventsListener extends BProgramRunnerListenerAdapter {
    private UCI uci;

    @Override
    public void eventSelected(BProgram bp, BEvent theEvent) {
        if (theEvent.name.equals("init_end")){
            uci.initEnded();
        }
        else if (theEvent instanceof Move) {
            Move mv = (Move) theEvent;
            uci.sendMove(MoveTranslator.MoveToString(mv));
        }
    }
}
