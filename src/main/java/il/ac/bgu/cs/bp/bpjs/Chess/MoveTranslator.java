package il.ac.bgu.cs.bp.bpjs.Chess;

import il.ac.bgu.cs.bp.bpjs.Chess.context.schema.Cell;
import il.ac.bgu.cs.bp.bpjs.Chess.context.schema.piece.Color;
import il.ac.bgu.cs.bp.bpjs.Chess.context.schema.piece.Piece;
import il.ac.bgu.cs.bp.bpjs.Chess.context.schema.piece.Type;
import il.ac.bgu.cs.bp.bpjs.Chess.events.Move;

public class MoveTranslator {
    private static int ChartoNumber(char c) {
        return c - 'a';
    }

    private static char NumberToChar(int n) {
        return (char) ('a' + n);
    }

    public static String MoveToString(Move move) {
        return "" + NumberToChar(move.source.i) + (move.source.j+ 1) + NumberToChar(move.target.i) + (move.target.j + 1);
    }

    public static String MoveTranslate(String move) {
        return "" + ChartoNumber(move.charAt(0))+ (Character.getNumericValue(move.charAt(1)) - 1) + ChartoNumber(move.charAt(2))+ (Character.getNumericValue(move.charAt(3)) - 1);
    }
}
