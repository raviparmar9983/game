"use client";

import CurrentTurnDisplay from "@/components/game/CurrentPlayer";
import DynamicGridIntegrated from "@/components/game/GridComponent";
import TicTacToeBackdropLoader from "@/components/shared/Loader";
import { useSocket } from "@/context";
import { useGame } from "@/queries";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const params = useParams();
  const router = useRouter();

  const gameId = params["room-id"] as string;
  const { socket } = useSocket();

  const { data: gameResp, isLoading, isError } = useGame(gameId);

  const [game, setGame] = useState<any>(null);

  useEffect(() => {
    if (gameResp) setGame(gameResp);
  }, [gameResp]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("joinRoom");
    const handler = (updatedGame: any) => {
      setGame(updatedGame);
    };

    socket.on("GAME_UPDATED", handler);

    return () => {
      socket.off("GAME_UPDATED", handler);
    };
  }, [socket]);

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong");
      router.push("/");
    }
  }, [isError, router]);

  if (isLoading || !game) {
    return <TicTacToeBackdropLoader />;
  }

  const handleCellClick = (data: any) => {
    socket?.emit("PLAY_MOVE", { ...data, gameId });
  };

  return (
    <>
      <CurrentTurnDisplay players={game.players} currTurn={game.currTurn} />

      <DynamicGridIntegrated
        gridSize={game.size}
        players={game.players}
        currTurn={game.currTurn}
        gridData={game.grid}
        onMove={(data) => handleCellClick(data)}
        disabled={false}
      />
    </>
  );
};

export default Page;
