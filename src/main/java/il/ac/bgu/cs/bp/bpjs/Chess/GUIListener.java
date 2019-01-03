package il.ac.bgu.cs.bp.bpjs.Chess;

import il.ac.bgu.cs.bp.bpjs.Chess.Pieces.Piece;
import il.ac.bgu.cs.bp.bpjs.Chess.events.Move;
import il.ac.bgu.cs.bp.bpjs.execution.BProgramRunner;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;

/**
 * Created by בנואל on 03/01/2019.
 */
public class GUIListener implements Runnable {
    private BProgram bprog;
    private BufferedReader reader;
    public GUIListener(BProgram bprog) throws UnsupportedEncodingException {
        this.bprog = bprog;
        reader = new BufferedReader(new InputStreamReader(System.in,"UTF-8"));
    }


    @Override
    public void run() {
        try {
            while (true) {
                String line = reader.readLine();
                BEvent translatedEvented = null;
                bprog.enqueueExternalEvent(translatedEvented);
            }
        }catch (IOException e){
            System.err.println("GUIListener failed to readline");
        }
    }
}
