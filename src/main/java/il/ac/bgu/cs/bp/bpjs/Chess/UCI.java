package il.ac.bgu.cs.bp.bpjs.Chess;

import il.ac.bgu.cs.bp.bpjs.Chess.context.schema.Cell;
import il.ac.bgu.cs.bp.bpjs.Chess.context.schema.piece.Color;
import il.ac.bgu.cs.bp.bpjs.Chess.context.schema.piece.Piece;
import il.ac.bgu.cs.bp.bpjs.Chess.context.schema.piece.Type;
import il.ac.bgu.cs.bp.bpjs.context.ContextService;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.BProgramRunnerListenerAdapter;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.PrintBProgramRunnerListener;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;



import static il.ac.bgu.cs.bp.bpjs.Chess.MoveTranslator.StringToMove;

public class UCI extends BProgramRunnerListenerAdapter implements Runnable {
    private InputStream in;
    private PrintStream out;
    private Scanner scanner;
    private PrintWriter logger;
    private boolean wasInitialized=false;
    private boolean wasInitEnded=false;
    private ContextService contextService;
    private BProgram bprog;

    private static final String ENGINENAME = "BPChess";
    private static final String AUTHOR = "Ronit and Banuel";


    public UCI(InputStream in, PrintStream out, PrintWriter chessLog) {
        this.in = in;
        this.out = out;
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
            else if (line.startsWith("go"))
                bprog.enqueueExternalEvent(new BEvent("My Turn"));
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

    public void newGame() {
        contextService = ContextService.getInstance();
        this.bprog = contextService.getBProgram();
        contextService.initFromResources("ContextDB", "ContextualChess-Population.js", "ContextualChess.js");
        bprog = contextService.getBProgram();
        bprog.setWaitForExternalEvents(true);


        try {
            contextService.addListener(new PrintBProgramRunnerListener(new PrintStream("bp.log")));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        contextService.addListener(this);
        contextService.addListener(new BlackEventsListener(this));
        contextService.run();

        //restart the main
        wasInitialized=false;
        wasInitEnded=false;

    }

    private void newPosition(String input) {
        input = input.substring(9).concat(" ");
        // Normal Start
        if (input.contains("startpos ")) {
            input = input.substring(9);
        }
        // Different start
        else if (input.contains("fen")&&!wasInitialized) {
            wasInitialized=true;
            input = input.substring(4);
            String fenBoard = input.substring(0, input.indexOf(" w"));
            splitFen(fenBoard);
           // bprog.enqueueExternalEvent(new BEvent("init_end"));
        }

        if (input.contains("moves")) {
            bprog.enqueueExternalEvent(new BEvent("color","black"));
            input = input.substring(input.length() - 5, input.length() - 1);
            if (input.length() > 0) {
                bprog.enqueueExternalEvent(StringToMove(input));
            }
        }
        else{
            bprog.enqueueExternalEvent(new BEvent("color","white"));
        }
        if(!wasInitEnded) {
            bprog.enqueueExternalEvent(new BEvent("init_end"));
            wasInitEnded=true;
        }
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
                Piece p;
                if (line.charAt(j) == 'r') {
                    x = getRow(line, j);
                    y = y - i;
                    p = new Piece(Color.Black, Type.Rook, bRooks);
                    bRooks++;
                    insert(p,x,y);
                } else if (line.charAt(j) == 'k') {
                    x = getRow(line, j);
                    y = y - i;
                    p = new Piece(Color.Black, Type.King, 1);
                    insert(p,x,y);
                } else if (line.charAt(j) == 'K') {
                    x = getRow(line, j);
                    y = y - i;
                    p = new Piece(Color.White, Type.King, 1);
                    insert(p,x,y);
                } else if (!Character.isDigit(line.charAt(j))){
                    throw  new UnsupportedOperationException("Need to support other types of pieces");
                }


            }
        }
    }
    private void insert (Piece p, int x, int y) {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("piece", p);
        parameters.put("cell", new Cell(x, y,p));
        bprog.enqueueExternalEvent(new ContextService.UpdateEvent("UpdateCell", parameters));
       // bprog.enqueueExternalEvent(new ContextService.AnyUpdateContextDBEvent("Cell"));
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

    private void quit() {
        contextService.close();
        out.println("Good game");
    }

}
