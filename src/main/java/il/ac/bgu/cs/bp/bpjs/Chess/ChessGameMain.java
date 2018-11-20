package il.ac.bgu.cs.bp.bpjs.Chess;

/**
 * Created by Ronit on 24-Oct-18.
 */
import javax.swing.JButton;
import javax.swing.JFrame;


import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.execution.BProgramRunner;
import il.ac.bgu.cs.bp.bpjs.model.SingleResourceBProgram;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.PrintBProgramRunnerListener;
import il.ac.bgu.cs.bp.bpjs.model.eventselection.PrioritizedBSyncEventSelectionStrategy;

public class ChessGameMain {

    public static ChessDisplayerGame ChessDisplayer;
    public static void main(String[] args) throws InterruptedException {

        // Create a program
        BProgram bprog = new SingleResourceBProgram("BPJSChess.js");

        bprog.setEventSelectionStrategy(new PrioritizedBSyncEventSelectionStrategy());
        bprog.setWaitForExternalEvents(true);
       // J                                                                                                                                                                                                                                                                                                                            Frame f = new TicTacToeGameMain();
        BProgramRunner rnr = new BProgramRunner(bprog);
        rnr.addListener(new PrintBProgramRunnerListener());
        ChessDisplayer = new ChessDisplayerGame(bprog, rnr);
        rnr.run();
        System.out.println("end of run");
    }
}
