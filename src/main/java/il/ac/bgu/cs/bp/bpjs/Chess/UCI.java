package il.ac.bgu.cs.bp.bpjs.Chess;


import il.ac.bgu.cs.bp.bpjs.Chess.Pieces.Piece;
import il.ac.bgu.cs.bp.bpjs.Chess.events.Move;
import il.ac.bgu.cs.bp.bpjs.execution.BProgramRunner;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.PrintBProgramRunnerListener;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.SingleResourceBProgram;
import il.ac.bgu.cs.bp.bpjs.model.eventselection.PrioritizedBSyncEventSelectionStrategy;

import java.io.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class UCI {
    public static final String ENGINENAME = "BPChess";
    public static final String AUTHOR = "Ronit and Banuel";
    public static BlackEventsListener bel=new BlackEventsListener();
    public static Map<String,Integer> dicionary = new HashMap<>();
    public static BProgram bprog;
    public static PrintWriter writer = null;
    public static int counter=0;
    public static void uciCommunication() {
        dicionaryInit();
        Scanner input = new Scanner(System.in);

        while(true) {

            String inputString = input.nextLine();
            try {
            PrintWriter writer= new PrintWriter("hi"+counter+".txt","UTF-8");
                writer.println(inputString);
                writer.close();
                counter++;
        } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            if ("uci".equals(inputString)) inputUCI();
            else if (inputString.startsWith("setoption")) setOptions(inputString);
            else if ("isready".equals(inputString)) isReady();
            else if ("ucinewgame".equals(inputString)) newGame();
            else if (inputString.startsWith("position"))newPosition(inputString);
            else if (inputString.startsWith("go")) go();
            else if ("print".equals(inputString)) print();
            else if ("quit".equals(inputString)) {
                quit();
                break;
            }

        }
        input.close();
    }

    private static void inputUCI() {
        System.out.println("id name "+ENGINENAME);
        System.out.println("id author "+AUTHOR);
        System.out.println("uciok");
     bprog = new SingleResourceBProgram("BPJSChess.js");
        bprog.setEventSelectionStrategy(new PrioritizedBSyncEventSelectionStrategy());
        bprog.setWaitForExternalEvents(true);

        BProgramRunner rnr = new BProgramRunner(bprog);
        try {
            rnr.addListener(new PrintBProgramRunnerListener(new PrintStream("bp.log")));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        rnr.addListener( bel);

        //rnr.run();
        try{
            PrintWriter writer= new PrintWriter("hi"+counter+".txt","UTF-8");
            writer.println("I am here after 1 ");
            writer.close();
            counter++;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        try{
            PrintWriter writer= new PrintWriter("hi"+counter+".txt","UTF-8");
            writer.println("I am here after 2 ");
            writer.close();
            counter++;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }


      //  ChessBoardFactory.initiateChessBoard();
       // MoveIterator.PLAYER = MoveIterator.PLAYER_BLACK;

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

    private static void newPosition(String input) {
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
    }

    private static void go() {
        System.out.println("bestmove "+bel.getMove());
    }

    private static void print() {

        System.out.println("Currently playing as black");

    }

    private static void quit() {
        System.out.println("Good game");
    }

    private static void makeMove(String line) {
        BEvent translatedEvented = new Move(dicionary.get(line.charAt(0)),Character.getNumericValue(line.charAt(1)),dicionary.get(line.charAt(2)),Character.getNumericValue(line.charAt(3)),new Piece(Piece.Color.black, Piece.Type.rook, 1));
        bprog.enqueueExternalEvent(translatedEvented);
    }
    private static void dicionaryInit(){
        dicionary.put("a",0);
        dicionary.put("b",1);
        dicionary.put("c",2);
        dicionary.put("d",3);
        dicionary.put("e",4);
        dicionary.put("f",5);
        dicionary.put("g",6);
        dicionary.put("h",7);
    }

}
