package il.ac.bgu.cs.bp.bpjs.Chess;

/**
 * Created by Ronit on 24-Oct-18.
 */
import il.ac.bgu.cs.bp.bpjs.execution.BProgramRunner;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.PrintBProgramRunnerListener;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.ResourceBProgram;
import il.ac.bgu.cs.bp.bpjs.model.eventselection.PrioritizedBSyncEventSelectionStrategy;

import java.io.FileNotFoundException;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;

public class ChessGameMain {
    private BProgram bprog;
    private UCI uci;
    private BlackEventsListener bel=new BlackEventsListener();
    private PrintBProgramRunnerListener logger;
    private PrintWriter chessLog;

    private ChessGameMain() throws FileNotFoundException, UnsupportedEncodingException {
        chessLog = new PrintWriter("chess_debugger.txt","UTF-8");

        bprog = new ResourceBProgram("BPJSChess.js");
        bprog.setEventSelectionStrategy(new PrioritizedBSyncEventSelectionStrategy());
        bprog.setWaitForExternalEvents(true);

        BProgramRunner rnr = new BProgramRunner(bprog);

        this.uci = new UCI(System.in, System.out, bprog, rnr, chessLog);
        rnr.addListener(new PrintBProgramRunnerListener(new PrintStream("bp.log")));
        rnr.addListener(uci);
        rnr.addListener(bel);
        rnr.run();

        uci.initCommunication();
        Thread l = new Thread(uci);
        l.start();

         System.out.println("end of run");
    }

    private void  run() {

    }

    public static void main(String[] args) throws FileNotFoundException, UnsupportedEncodingException {
        new ChessGameMain().run();

    }
}
