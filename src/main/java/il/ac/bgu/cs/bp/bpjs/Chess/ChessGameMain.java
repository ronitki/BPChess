package il.ac.bgu.cs.bp.bpjs.Chess;

/**
 * Created by Ronit on 24-Oct-18.
 */
import java.io.UnsupportedEncodingException;

public class ChessGameMain {

    public static void main(String[] args) throws InterruptedException, UnsupportedEncodingException {

        // Create a program
//        BProgram bprog = new SingleResourceBProgram("BPJSChess.js");
//
//        bprog.setEventSelectionStrategy(new PrioritizedBSyncEventSelectionStrategy());
//        bprog.setWaitForExternalEvents(true);
//        BProgramRunner rnr = new BProgramRunner(bprog);
////        rnr.addListener(new PrintBProgramRunnerListener());
//        rnr.addListener(new BlackEventsListener());
//        Thread l = new Thread(new GUIListener(bprog));
//        l.run();
//        rnr.run();
       // System.out.println("end of run");
        UCI.uciCommunication();
    }
}
