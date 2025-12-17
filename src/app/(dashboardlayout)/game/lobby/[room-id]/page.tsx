"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Grid, Card, CardActionArea, Typography, Box, Avatar, Button, Chip } from "@mui/material";
import * as Icons from "@/icons/GameIcon";
import { useAppSelector } from "@/lib/hooks";
import TicTacToeBackdropLoader from "@/components/shared/Loader";
import { useSocket } from "@/context";
import { useRouter } from "next/navigation";
import { CustomeCodeChip } from "@/components/shared/CustomChip";
import { useGame } from "@/queries";
import toast from "react-hot-toast";
// import toast from "react-hot-toast";

interface Player {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  isConnected?: boolean;
  isReady?: boolean;
  icon?: string;
  roomCode?: string;
}

const GameLobbyPage = () => {
  const searchParam = useParams();
  const currentUser = useAppSelector((state) => state.user);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hostId, setHostId] = useState<string | null>(null);
  const { socket } = useSocket();
  const router = useRouter();
  const [actionInProgress, setActionInProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const gameId = searchParam["room-id"] as string;
  const iconKeys = Object.keys(Icons);
  const { data: gameResp, isLoading: gameLoading } = useGame(gameId);
  const takenIcons = players.map((p) => p.icon).filter(Boolean) as string[];

  const myPlayer = players.find((p) => p._id === currentUser._id);
  const mySelectedIcon = myPlayer?.icon || selectedIcon;

  // const isHost = hostId === currentUser._id;
  // const allReady =
  //   players.length > 0 && players.every((player) => player.isReady);

  useEffect(() => {
    if (!socket || !gameId) return;

    socket.emit("joinRoom", { gameId });

    const onPlayerJoined = (data: { players: Player[]; host?: string }) => {
      setPlayers(data.players || []);
      if (data.host) setHostId(data.host);
      setIsLoading(false);
    };

    const onGameStart = () => {
      router.push(`/game/play/${gameId}`);
    };

    socket.on("playerJoined", onPlayerJoined);
    socket.on("gameStarted", onGameStart);

    return () => {
      socket.off("playerJoined", onPlayerJoined);
      socket.off("gameStarted", onGameStart);
    };
  }, [socket, gameId]);

  useEffect(() => {
    if (!socket) return;

    const onPlayerUpdated = (data: { players: Player[] }) => {
      setPlayers(data.players || []);
      const me = data.players.find((p) => p._id === currentUser._id);
      if (me?.icon) {
        setSelectedIcon(me.icon);
      }
    };

    socket.on("playerUpdated", onPlayerUpdated);

    return () => {
      socket.off("playerUpdated", onPlayerUpdated);
    };
  }, [socket, currentUser._id]);

  useEffect(() => {
    if (!socket) return;

    const onSocketError = (data: { message: string }) => {
      const msg = data?.message || "Something went wrong";

      toast.error(msg);
      setIsLoading(false);

      // ✅ ICON SELECTION & GAME STATE BASED REDIRECTION
      if (msg.includes("Game already started") || msg.includes("icon locked")) {
        // Game started while user was selecting icon
        router.push(`/game/play/${gameId}`);
        return;
      } else if (msg.includes("Game not found") || msg.includes("Not allowed")) {
        // Kicked out / wrong user
        router.push("/");
        return;
      } else if (msg.includes("Icon already taken")) {
        // ✅ NO REDIRECT → Just allow re-selection
        return;
      }

      // ✅ Fallback safety
      else {
        router.push("/");
      }
    };

    socket.on("ERROR", onSocketError);

    return () => {
      socket.off("ERROR", onSocketError);
    };
  }, [socket, gameId, router]);

  useEffect(() => {
    const me = players.find((p) => p._id === currentUser._id);
    if (me?.icon) {
      setSelectedIcon(me.icon);
    }
  }, [players, currentUser._id]);

  const handleSelectIcon = (iconName: string) => {
    if (!socket || !gameId) return;
    if (actionInProgress) return;
    if (mySelectedIcon) return;
    if (takenIcons.includes(iconName)) {
      setErrorMessage("Icon already taken");
      return;
    }

    setActionInProgress(true);
    setErrorMessage(null);

    socket.emit(
      "selectIcon",
      { gameId, icon: iconName },
      (ack: { status: boolean; players?: Player[]; message?: string }) => {
        setActionInProgress(false);
        if (ack?.status) {
          if (ack.players) setPlayers(ack.players);
          setSelectedIcon(iconName);
        } else {
          setErrorMessage(ack?.message || "Failed to select icon");
        }
      }
    );
  };

  const handleGameStart = () => {
    if (!socket || !gameId) return;
    socket.emit("startGame", { gameId });
  };

  if (isLoading || gameLoading) return <TicTacToeBackdropLoader />;

  const displayName = (p: Player) => {
    const first = p.firstName || "";
    const lastInitial = p.lastName ? ` ${p.lastName?.[0]}.` : "";
    return `${first}${lastInitial}`;
  };

  return (
    <Box>
      <CustomeCodeChip label={gameResp.roomCode ?? ""} />
      <Typography variant="h5" gutterBottom>
        Choose Your Icon
      </Typography>

      <Grid container spacing={2} mb={4}>
        {iconKeys.map((iconName) => {
          const IconComponent = (Icons as any)[iconName];
          const isTaken = takenIcons.includes(iconName);
          const isSelected = mySelectedIcon === iconName;

          const disableForMe = !!mySelectedIcon;
          const disabled =
            actionInProgress ||
            (isTaken && !isSelected) ||
            (currentUser && disableForMe && !isSelected);

          return (
            <Grid size={{ xs: 3 }} key={iconName}>
              <Card
                sx={{
                  border: isSelected ? "2px solid #1976d2" : "1px solid #ddd",
                  borderRadius: 2,
                  boxShadow: 2,
                  opacity: disabled ? 0.4 : 1,
                }}
              >
                <CardActionArea
                  onClick={() => {
                    if (disabled) return;
                    handleSelectIcon(iconName);
                  }}
                  disabled={disabled}
                >
                  <Box display="flex" justifyContent="center" alignItems="center" p={2} height={80}>
                    <IconComponent width={50} height={50} />
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {errorMessage && (
        <Typography color="error" mt={1} variant="body2">
          {errorMessage}
        </Typography>
      )}

      {/* Start button for host */}
      {/* {isHost && ( */}
      <Box mt={3} mb={4}>
        <Button variant="contained" color="primary" onClick={handleGameStart}>
          {"Start Game"}
        </Button>
      </Box>
      {/* )} */}

      <Typography variant="h6" gutterBottom>
        Players in Room
      </Typography>

      <Grid container spacing={2}>
        {players.map((player) => {
          const IconComponent = player.icon ? (Icons as any)[player.icon] : null;
          const isMe = player._id === currentUser._id;

          return (
            <Grid size={{ xs: 12, md: 6 }} key={player._id}>
              <Card
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 2,
                }}
              >
                {/* Left: Avatar & Info */}
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar>{player.firstName?.[0] || "?"}</Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {displayName(player)}
                    </Typography>

                    <Box display="flex" gap={1} mt={0.5}>
                      {hostId === player._id && (
                        <Chip
                          label="Host"
                          color="primary"
                          size="small"
                          sx={{ fontSize: "0.7rem", height: 22 }}
                        />
                      )}
                      <Chip
                        label={player.isReady ? "Ready" : "Not Ready"}
                        color={player.isReady ? "success" : "default"}
                        size="small"
                        sx={{ fontSize: "0.7rem", height: 22 }}
                      />
                    </Box>

                    {IconComponent ? (
                      <Box display="flex" alignItems="center" mt={1}>
                        <IconComponent width={26} height={26} />
                        <Typography variant="body2" ml={1} color="text.secondary">
                          {player.icon}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" mt={1} color="text.secondary">
                        No icon selected
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Right: Ready button for current user */}
                {isMe && (
                  <Button
                    variant={player.isReady ? "outlined" : "contained"}
                    color={player.isReady ? "success" : "secondary"}
                    sx={{
                      borderRadius: 3,
                      textTransform: "none",
                      px: 3,
                      py: 1,
                      fontWeight: 600,
                    }}
                  >
                    {player.isReady ? "Unready" : "Mark Ready"}
                  </Button>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default GameLobbyPage;
