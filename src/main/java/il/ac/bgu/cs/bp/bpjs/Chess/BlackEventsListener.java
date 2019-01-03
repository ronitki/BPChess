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
    Map<String,String> dicionary = new HashMap<>();

    public String getMove() {
        return move;
    }

    private String move;
    public BlackEventsListener() {
        dicionary.put("0","a");
        dicionary.put("1","b");
        dicionary.put("2","c");
        dicionary.put("3","d");
        dicionary.put("4","e");
        dicionary.put("5","f");
        dicionary.put("6","g");
        dicionary.put("7","h");
    }
    @Override
    public void eventSelected(BProgram bp, BEvent theEvent) {


                if (theEvent instanceof Move) {

                    Move mv = (Move) theEvent;
                    move=(dicionary.get(mv.getSourceX()+"")+mv.getSourceY()+dicionary.get(mv.getTargetX()+"")+mv.getSourceY());
                }
//                } else {
//                    if (theEvent == il.ac.bgu.cs.bp.bpjs.Chess.events.StaticEvents.XWin) {
//                        message.setText("X Wins!");
//                    } else if (theEvent == il.ac.bgu.cs.bp.bpjs.Chess.events.StaticEvents.OWin) {
//                        message.setText("O Wins!");
//                    } else if (theEvent == il.ac.bgu.cs.bp.bpjs.Chess.events.StaticEvents.draw) {
//                        message.setText("It's a Draw!");
//                    }
//                }
            }
}
