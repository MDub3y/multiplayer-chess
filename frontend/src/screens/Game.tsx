/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from 'chess.js';


// TODO: move together, there is code repetition here
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [started, setStarted] = useState(false);
    
    useEffect(() => {
        if(!socket)
            return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            
            let move;
            switch(message.type) {
                case INIT_GAME:
                    setBoard(chess.board());
                    setStarted(true);
                    console.log("game initialized");
                    break;
                case MOVE:
                    move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    console.log("move made");
                    break;
                case GAME_OVER:
                    console.log("game over");
                    break;
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket])
    
    if(!socket) return <div>Connecting...</div>

    return (
        <div className="justify-center flex">
            <div className="pt-8 max-w-screen-lg w-full">
                <div className="grid grid-cols-6 gap-4 w-full">
                    <div className="col-span-4 w-full flex justify-center">
                        <ChessBoard chess={chess} setBoard={setBoard} socket={socket} board={board} />
                    </div>
                    <div className="col-span-2 bg-slate-800 w-full flex justify-center">
                        <div className="pt-16">
                            {!started &&<Button onClick={() => {
                                socket.send(JSON.stringify({
                                    type: INIT_GAME
                                }))
                            }}>Play</Button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}