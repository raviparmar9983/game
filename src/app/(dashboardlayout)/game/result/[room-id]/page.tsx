"use client";

import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Stack,
  Divider,
  Container,
  Button,
  useTheme,
} from "@mui/material";

import TicTacToeBackdropLoader from "@/components/shared/Loader";
import { useGameResult } from "@/queries";
import { IconsMap } from "@/icons/IconMap";

/* ================= TYPES ================= */

interface GameResultPlayer {
  userId: string;
  name: string;
  icon: string;
  point: number;
  block: number;
  isWinner: boolean;
}

interface GameResult {
  gameId: string;
  roomCode: string;
  gridSize: number;
  status: "WIN" | "DRAW";
  players: GameResultPlayer[];
  finalGrid: string[][];
}

interface GameResultResponse {
  source: string;
  result: GameResult;
}

interface RootState {
  user: {
    _id: string;
  };
}

/* ================= PAGE ================= */

const GameResultPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const params = useParams<{ "room-id": string }>();
  const gameId = params["room-id"];

  const currentUserId = useSelector((state: RootState) => state.user._id);

  const { data, isLoading, isError } = useGameResult(gameId) as {
    data?: GameResultResponse;
    isLoading: boolean;
    isError: boolean;
  };

  if (isLoading) return <TicTacToeBackdropLoader />;
  if (isError || !data?.result) return <Typography color="error">Failed to load result</Typography>;

  const result = data.result;
  const winners = result.players.filter((p) => p.isWinner);
  const isCurrentUserWinner = winners.some((p) => p.userId === currentUserId);

  /* ================= RESULT MESSAGE ================= */

  const resultMessage =
    result.status === "DRAW"
      ? "🤝 Match Draw"
      : isCurrentUserWinner
        ? "🏆 You Won the Match!"
        : "😔 Better Luck Next Time";

  const resultChipColor =
    result.status === "DRAW" ? "warning" : isCurrentUserWinner ? "success" : "default";

  return (
    <Container maxWidth="lg">
      <Box py={{ xs: 3, md: 6 }}>
        {/* ================= HEADER ================= */}
        <Stack spacing={1.5} alignItems="center" mb={4}>
          <Typography variant="h3" fontWeight={700}>
            Game Result
          </Typography>

          <Chip label={resultMessage} color={resultChipColor} sx={{ fontSize: 16, px: 3 }} />

          <Typography variant="caption" color="text.secondary">
            Room Code: {result.roomCode}
          </Typography>
        </Stack>

        {/* ================= MAIN CONTENT ================= */}
        <Grid container spacing={4}>
          {/* ===== WINNER SECTION ===== */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant="h5" mb={2}>
                {result.status === "DRAW" ? "Top Players" : "Winner"}
              </Typography>

              <Stack spacing={2}>
                {winners.map((player) => {
                  const Icon = IconsMap[player.icon];
                  return (
                    <Box
                      key={player.userId}
                      sx={{
                        border: `1px solid ${theme.palette.success.main}`,
                        borderRadius: 2,
                        p: 3,
                        textAlign: "center",
                        boxShadow: `0 0 25px rgba(0,255,136,0.2)`,
                      }}
                    >
                      {Icon && Icon}
                      <Typography variant="h6" mt={1}>
                        {player.name}
                      </Typography>
                      <Typography fontWeight={600}>{player.point} Points</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Blocks: {player.block}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Paper>
          </Grid>

          {/* ===== FINAL BOARD ===== */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" textAlign="center" mb={2}>
                Final Board
              </Typography>

              <Box
                display="grid"
                gridTemplateColumns={`repeat(${result.gridSize}, 1fr)`}
                gap={1}
                maxWidth={280}
                mx="auto"
              >
                {result.finalGrid.flat().map((cell, idx) => {
                  const Icon = IconsMap[cell];
                  return (
                    <Box
                      key={idx}
                      sx={{
                        height: 56,
                        borderRadius: 1,
                        bgcolor: "background.paper",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {Icon && Icon}
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* ================= PLAYER SUMMARY ================= */}
        <Paper sx={{ mt: 5, p: 3 }}>
          <Typography variant="h6" mb={2}>
            Score Summary
          </Typography>

          <Stack spacing={1}>
            {result.players.map((player) => {
              const Icon = IconsMap[player.icon];
              return (
                <Box
                  key={player.userId}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    py: 1.5,
                    borderRadius: 1,
                    bgcolor: player.isWinner ? "rgba(0,255,136,0.1)" : "transparent",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    {Icon && Icon}
                    <Typography fontWeight={500}>{player.name}</Typography>
                    <Typography color="text.secondary">{player.point} pts</Typography>
                  </Stack>

                  {player.isWinner && <Chip label="Winner" size="small" color="success" />}
                </Box>
              );
            })}
          </Stack>
        </Paper>

        {/* ================= ACTION ================= */}
        <Stack alignItems="center" mt={5}>
          <Button variant="contained" size="large" onClick={() => router.push("/")}>
            Go to Home
          </Button>
        </Stack>

        <Divider sx={{ mt: 6 }} />
      </Box>
    </Container>
  );
};

export default GameResultPage;
