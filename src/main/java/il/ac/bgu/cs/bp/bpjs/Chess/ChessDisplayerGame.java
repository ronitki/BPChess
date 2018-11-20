package il.ac.bgu.cs.bp.bpjs.Chess;

/**
 * Created by Ronit on 24-Oct-18.
 */
import java.awt.BorderLayout;
import java.awt.GridLayout;
import java.awt.Point;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.SwingConstants;

import il.ac.bgu.cs.bp.bpjs.Chess.events.Click;
import il.ac.bgu.cs.bp.bpjs.Chess.events.Move;
import il.ac.bgu.cs.bp.bpjs.Chess.events.StaticEvents;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.execution.BProgramRunner;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.BProgramRunnerListenerAdapter;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;

public class ChessDisplayerGame implements  ActionListener{
    private final BProgram bp;
    private final BProgramRunner rnr;

    public ChessDisplayerGame(BProgram bp, BProgramRunner rnr){
        this.bp=bp;
        this.rnr=rnr;

        rnr.addListener(new BProgramRunnerListenerAdapter() {

            @Override
            public void eventSelected(BProgram bp, BEvent theEvent) {
                if (theEvent instanceof Move) {
                    Move mv = (Move) theEvent;

                    //   buttons[mv.row][mv.col].setText(mv.displayString());
                    System.out.println(mv.toString());
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

        });



    }
    @Override
    public void actionPerformed(ActionEvent e) {

    }
}
