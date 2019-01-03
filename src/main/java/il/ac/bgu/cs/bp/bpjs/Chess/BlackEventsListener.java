package il.ac.bgu.cs.bp.bpjs.Chess;

/**
 * Created by Ronit on 24-Oct-18.
 */
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.HashMap;
import java.util.Map;

import il.ac.bgu.cs.bp.bpjs.Chess.events.Move;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.execution.BProgramRunner;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.BProgramRunnerListenerAdapter;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;

public class BlackEventsListener extends BProgramRunnerListenerAdapter {
            @Override
    Map<String,String> dicionary = new HashMap<>();

    public BlackEventsListener() {
        dicionary.put("1","a");
        dicionary.put("2","b");
        dicionary.put("3","c");
        dicionary.put("4","d");
        dicionary.put("5","e");
        dicionary.put("6","f");
        dicionary.put("7","g");
    }

    public void eventSelected(BProgram bp, BEvent theEvent) {


                if (theEvent instanceof Move) {
                    Move mv = (Move) theEvent;

                    //   buttons[mv.row][mv.col].setText(mv.displayString());
                    System.out.println(dicionary.get(mv.getSourceX()+"")+mv.getSourceY()+dicionary.get(mv.getTargetX()+"")+mv.getSourceY());
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
