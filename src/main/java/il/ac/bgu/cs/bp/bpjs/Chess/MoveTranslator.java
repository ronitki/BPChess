package il.ac.bgu.cs.bp.bpjs.Chess;

import il.ac.bgu.cs.bp.bpjs.Chess.Pieces.Piece;
import il.ac.bgu.cs.bp.bpjs.Chess.events.Init;
import il.ac.bgu.cs.bp.bpjs.Chess.events.Move;

public class MoveTranslator {
    private static int ChartoNumber (char c) {
        return c - 'a';
    }
    private static  char NumberToChar (int n) {
        return (char) ('a' + n);
    }

    public static String MoveToString(Move move) {
        return ""+NumberToChar(move.getSourceX())+move.getSourceY()+NumberToChar(move.getTargetX())+move.getSourceY();
    }

    public static Move StringToMove(String move) {
        return new Move(ChartoNumber(move.charAt(0)),Character.getNumericValue(move.charAt(1)),ChartoNumber(move.charAt(2)),Character.getNumericValue(move.charAt(3)),new Piece(Piece.Color.black, Piece.Type.king, 1));
    }

    public static Init PlacePiece(String move) {
        return null;//new Init();
    }
}
