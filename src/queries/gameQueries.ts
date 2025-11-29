import { createRoom, getGameById, joinGameRoom } from "@/services";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateRoom = () => {
  return useMutation({ mutationFn: createRoom });
};

export const useGame = (gameId: string) => {
  return useQuery({
    queryKey: ["game", gameId],
    queryFn: () => getGameById(gameId),
    enabled: !!gameId, // only fetch when gameId exists
  });
};

export const useJoinGameRoom = () => {
  return useMutation({ mutationFn: joinGameRoom });
};
