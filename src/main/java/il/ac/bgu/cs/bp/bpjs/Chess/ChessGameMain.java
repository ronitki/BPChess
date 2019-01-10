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
    private BProgramRunner rnr;
    private UCI uci;
    private BlackEventsListener bel;
    private PrintBProgramRunnerListener logger;
    private PrintWriter chessLog;

    private ChessGameMain() throws FileNotFoundException, UnsupportedEncodingException {
        chessLog = new PrintWriter("chess.log","UTF-8");

        bprog = new ResourceBProgram("BPJSChess.js");
        bprog.setEventSelectionStrategy(new PrioritizedBSyncEventSelectionStrategy());
        bprog.setWaitForExternalEvents(true);

        rnr = new BProgramRunner(bprog);

        this.uci = new UCI(System.in, System.out, bprog, rnr, chessLog);
        this.bel=new BlackEventsListener(uci);

        rnr.addListener(new PrintBProgramRunnerListener(new PrintStream("bp.log")));
        rnr.addListener(uci);
        rnr.addListener(bel);
    }

    private void  run() {
        uci.initCommunication();
        Thread l = new Thread(uci);
        l.start();
        rnr.run();
        System.out.println("end of run");
    }

    public static void main(String[] args) throws FileNotFoundException, UnsupportedEncodingException {
        new ChessGameMain().run();

    }
}
