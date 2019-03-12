package il.ac.bgu.cs.bp.bpjs.Chess;

/**
 * Created by Ronit on 24-Oct-18.
 */
import il.ac.bgu.cs.bp.bpjs.context.ContextService;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.PrintBProgramRunnerListener;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;

import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;

public class ChessGameMain {
    private UCI uci;
    private PrintWriter chessLog;

    private ChessGameMain() throws FileNotFoundException, UnsupportedEncodingException {
        chessLog = new PrintWriter("chess.log","UTF-8");
        this.uci = new UCI(System.in, System.out, ContextService.getInstance(), chessLog);
    }

    private void  run() {
        uci.initCommunication();
        Thread l = new Thread(uci);
        l.start();
        uci.newGame();
        System.out.println("end of run");
    }

    public static void main(String[] args) throws FileNotFoundException, UnsupportedEncodingException {
        new ChessGameMain().run();

    }
}