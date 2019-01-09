package il.ac.bgu.cs.bp.bpjs.Chess;

import il.ac.bgu.cs.bp.bpjs.Chess.events.Move;
import il.ac.bgu.cs.bp.bpjs.execution.BProgramRunner;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.BProgramRunnerListenerAdapter;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;

import java.io.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class UCI extends BProgramRunnerListenerAdapter implements Runnable{
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
        this.scanner= new Scanner(in);
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

    public void initCommunication(){
        String line="";
        while(!(line = scanner.nextLine()).equals("uci")) {
            logger.println(line);
        }
    }

    public void run(){
        String line="";
        while(true) {
            line = scanner.nextLine();
            logger.println(line);
            if (line.startsWith("setoption")) setOptions(line);
            else if ("isready".equals(line)) isReady();
            else if ("ucinewgame".equals(line)) newGame();
            else if (line.startsWith("position")) {
                bprog.enqueueExternalEvent(MoveTranslator.StringToMove(newPosition(line)));
                newPosition(line);
            }
            else if (line.startsWith("go")) {
                bprog.enqueueExternalEvent(new BEvent("My Turn"));
            }
            else if ("print".equals(line)) print();
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
        //ChessBoardFactory.initiateChessBoard();
        System.out.println("readyok");
    }

    private static void newGame() {
        //ChessBoardFactory.initiateChessBoard();

    }

    private String newPosition(String input) {
        input=input.substring(9).concat(" ");
        if (input.contains("startpos ")) {
            input=input.substring(9);
        }
        else if (input.contains("fen")) {
            input=input.substring(4);
        }
//        if (input.contains("b ")) {
//            MoveIterator.PLAYER = MoveIterator.PLAYER_BLACK;
//        }
//        else if (input.contains("w ")) {
//            MoveIterator.PLAYER = MoveIterator.PLAYER_WHITE;
//        }
        if (input.contains("moves")) {
            input = input.substring(input.indexOf("moves") + 6);
            if (input.length() > 0) {
                makeMove(input);
               // input=input.substring(input.indexOf(' ')+1);
            }
        }
        return input;
    }

    private void initFromFen(String fen) {
        String lines[] = fen.split("\\");
        for (int i = 0; i < lines.length; i++) {
            bprog.enqueueExternalEvent(MoveTranslator.StringToMove(newPosition(lines[i])));
        }
    }

    private void print() {
        out.println("Currently playing as black");
    }

    private void quit() {
        rnr.halt();
        out.println("Good game");
    }

    private static void makeMove(String line) {
//        BEvent translatedEvented = new Move(dicionary.get(line.charAt(0)),Character.getNumericValue(line.charAt(1)),dicionary.get(line.charAt(2)),Character.getNumericValue(line.charAt(3)),new Piece(Piece.Color.black, Piece.Type.rook, 1));
//        bprog.enqueueExternalEvent(translatedEvented);
    }
}
