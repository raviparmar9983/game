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
    socket.emit("joingameplay", { gameId });
    const handler = (updatedGame: any) => {
      setGame(updatedGame);
    };

    socket.on("GAME_UPDATED", handler);
    socket.on("GAME_COMPLETE", () => {
      router.replace(`../result/${gameId}`);
    });
    return () => {
      socket.off("GAME_COMPLETE");
      socket.off("GAME_UPDATED", handler);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const onSocketError = (data: { message: string }) => {
      const msg = data?.message || "Something went wrong";

      toast.error(msg);

      // ✅ REDIRECT ONLY WHEN GAME CANNOT CONTINUE
      if (msg.includes("game_not_found") || msg.includes("You are not Part of this game")) {
        // kicked / invalid room
        router.push("/");
        return;
      }

      if (msg.includes("Game not Start")) {
        // game is still in lobby
        router.push(`/game/lobby/${gameId}`);
        return;
      }

      if (msg.includes("completed")) {
        // game finished → move to result page later if you make one
        router.push(`/game/result/${gameId}`);
        return;
      }

      // ✅ NO REDIRECT FOR THESE (JUST TOAST)
      if (msg.includes("Wrong turn") || msg.includes("Cell already filled")) {
        return;
      }

      // ✅ FAILSAFE
      router.push("/");
    };

    socket.on("ERROR", onSocketError);

    return () => {
      socket.off("ERROR", onSocketError);
    };
  }, [socket, router, gameId]);

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
    if (!socket || !gameId) return;
    socket.emit("PLAY_MOVE", { ...data, gameId });
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
      />
    </>
  );
};

export default Page;
