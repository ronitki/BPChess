package il.ac.bgu.cs.bp.bpjs.Chess;

import il.ac.bgu.cs.bp.bpjs.Chess.context.schema.Cell;
import il.ac.bgu.cs.bp.bpjs.Chess.context.schema.Piece;
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

    public static Move StringToMove(String move) {
        return new Move(new Cell(ChartoNumber(move.charAt(0)), Character.getNumericValue(move.charAt(1)) - 1), new Cell(ChartoNumber(move.charAt(2)), Character.getNumericValue(move.charAt(3)) - 1), new Piece(Piece.Color.white, Piece.Type.king, 1));
    }
}
