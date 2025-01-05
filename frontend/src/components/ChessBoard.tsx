/* eslint-disable @typescript-eslint/no-explicit-any */
import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";


export const ChessBoard = ({ chess, board, socket, setBoard }: {
    chess: any;
    setBoard: any;
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket
}) => {

    const [from, setFrom] = useState<null | Square>(null);

    return ( 
        <div className="text-white-300">
            {board.map((row, i) => {
                return <div key={i} className="flex">
                    {row.map((square, j) => {
                        const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;

                        return <div onClick={() => {
                            if(!from){
                                setFrom(squareRepresentation);
                            } else {
                                
                                socket.send(JSON.stringify({
                                    type: MOVE,
                                    payload: {
                                        move: {
                                            from,
                                            to : squareRepresentation
                                        }
                                    }
                                }))
                                setFrom(null);
                                chess.move({
                                    from,
                                    to : squareRepresentation
                                });
                                setBoard(chess.board());
                                console.log({
                                    from,
                                    to : squareRepresentation
                                })
                            }
                        }} key={j} className={`w-16 h-16 ${(i+j) % 2 === 0 ? "bg-green-500" : "bg-[#fcfbccdb]"}`}>
                            <div className="w-full h-full flex justify-center">
                                <div className="h-full flex flex-col justify-center">
                                    {square ? <img className="w-10" src={`/${square.color}${square.type}.png`} /> : null}
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            })}
        </div>
    )
}