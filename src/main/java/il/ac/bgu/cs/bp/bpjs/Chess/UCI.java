package il.ac.bgu.cs.bp.bpjs.Chess;

import il.ac.bgu.cs.bp.bpjs.Chess.Pieces.Piece;
import il.ac.bgu.cs.bp.bpjs.Chess.events.Init;
import il.ac.bgu.cs.bp.bpjs.Chess.events.Move;
import il.ac.bgu.cs.bp.bpjs.execution.BProgramRunner;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.BProgramRunnerListenerAdapter;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;

import java.io.InputStream;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.util.Scanner;

import static il.ac.bgu.cs.bp.bpjs.Chess.MoveTranslator.StringToMove;

public class UCI extends BProgramRunnerListenerAdapter implements Runnable {
    private InputStream in;
    private PrintStream out;
    private Scanner scanner;
    private PrintWriter logger;
    private BProgram bprog;
    private BProgramRunner rnr;

    private String inititialBoard = "8/8/5kK1/4rr2/8/8/8/8 w KQkq - 0 1";

    private static final String ENGINENAME = "BPChess";
    private static final String AUTHOR = "Ronit and Banuel";


    public UCI(InputStream in, PrintStream out, BProgram bprog, BProgramRunner rnr, PrintWriter chessLog) {
        this.in = in;
        this.out = out;
        this.bprog = bprog;
        this.rnr = rnr;
        this.scanner = new Scanner(in);
        this.logger = chessLog;
    }

    @Override
    public void eventSelected(BProgram bp, BEvent theEvent) {

    }

    public void closeCommunication() {
        scanner.close();
    }

    public void initEnded() {
        out.println("id name " + ENGINENAME);
        out.println("id author " + AUTHOR);
        out.println("uciok");
        logger.println("Ended startInputUCI");
    }

    public void initCommunication() {
        String line = "";
        while (!(line = scanner.nextLine()).equals("uci")) {
            logger.println(line);
        }
        initEnded();
    }

    public void run() {
        String line = "";
        while (true) {
            line = scanner.nextLine();
            logger.println(line);
            if (line.startsWith("setoption")) setOptions(line);
            else if ("isready".equals(line)) isReady();
            else if ("ucinewgame".equals(line)) newGame();
            else if (line.startsWith("position")) newPosition(line);
            else if (line.startsWith("go")) {
                bprog.enqueueExternalEvent(new BEvent("My Turn"));
            } else if ("print".equals(line)) print();
            else if ("quit".equals(line)) {
                quit();
                return;
            }
        }
    }

    public void sendMove(String move) {
        out.println("bestmove " + move);
    }

    private static void setOptions(String input) {
        // set options
    }

    private static void isReady() {
        System.out.println("readyok");
    }

    private static void newGame() {


    }

    private String newPosition(String input) {
        input = input.substring(9).concat(" ");
        // Normal Start
        if (input.contains("startpos ")) {
            input = input.substring(9);
        }
        // Different start
        else if (input.contains("fen")) {
            input = input.substring(4);
            String fenBoard = input.substring(0, input.indexOf(" w"));
            splitFen(fenBoard);
            bprog.enqueueExternalEvent(new BEvent("init_end"));
        }

        if (input.contains("moves")) {
            input = input.substring(input.length() - 5, input.length() - 1);
            if (input.length() > 0) {
                bprog.enqueueExternalEvent(StringToMove(input));
            }
        }
        return input;
    }

    private void splitFen(String fen) {
        String[] lines = fen.split("/");
        int bRooks = 1;
        for (int i = 0; i < lines.length; i++) {
            String line = lines[i];
            for (int j = 0; j < line.length(); j++) {
                int x = 0;
                int y = 7;
                String piece = "";
                if (line.charAt(j) == 'r') {
                    x = getRow(line, j);
                    y = y - i;
                    Piece p = new Piece(Piece.Color.black, Piece.Type.rook, bRooks);
                    bRooks++;
                    System.out.println(x + "" + y + "" + p);
                    enqueueInit(x, y, p);
                } else if (line.charAt(j) == 'k') {
                    x = getRow(line, j);
                    y = y - i;
                    Piece p = new Piece(Piece.Color.black, Piece.Type.king, 1);
                    System.out.println(x + "" + y + "" + p);
                    enqueueInit(x, y, p);
                } else if (line.charAt(j) == 'K') {
                    x = getRow(line, j);
                    y = y - i;
                    Piece p = new Piece(Piece.Color.white, Piece.Type.king, 1);
                    System.out.println(x + "" + y + "" + p);
                    enqueueInit(x, y, p);
                }
            }

        }
    }

    private int getRow(String line, int index) {
        int sum = 0;
        for (int i = 0; i < index; i++) {
            if (Character.isDigit(line.charAt(i)))
                sum = sum + Character.getNumericValue(line.charAt(i));
            else
                sum++;
        }
        return sum;
    }

    private void enqueueInit(int x, int y, Piece piece) {
        bprog.enqueueExternalEvent(new Init(x, y, piece));
    }

    private void print() {
        out.println("Currently playing as black");
    }

    private void quit() {
        rnr.halt();
        out.println("Good game");
    }

}
