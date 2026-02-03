import { Container, Typography, Box, Grid, Chip, Stack } from "@mui/material";
import Image from "next/image";
import BackToDashboardButton from "./GotoHomePage";
export const metadata = {
  title: "How Scoring Works | TACTRA",
  description:
    "Learn how scoring works in TACTRA using rows, columns, and diagonals. Understand points, blocks, and winning rules.",
};

const scoringRules = [
  {
    title: "Row Completion",
    description:
      "When a player completes a full horizontal row with their icon, they earn points. Each completed row is counted separately.",
    image: "/rules/score-row.png",
  },
  {
    title: "Column Completion",
    description:
      "Completing a vertical column also gives points. Columns are powerful for both scoring and blocking opponents.",
    image: "/rules/score-column.png",
  },
  {
    title: "Diagonal Completion",
    description:
      "Completing a diagonal earns points as well. Diagonals are harder to control and often decide the winner.",
    image: "/rules/score-diagonal.png",
  },
  {
    title: "Multiple Patterns in One Move",
    description:
      "A single move can complete multiple patterns (row, column, diagonal) and earn multiple points in one turn.",
    image: "/rules/score-multiple.png",
  },
];

export default function HowToPlayPage() {
  return (
    <Box
    >
      <BackToDashboardButton />
      <Container maxWidth="lg">
        {/* HEADER */}
        <Box textAlign="center" mt={1}>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            How Scoring Works
          </Typography>

          <Typography variant="body1" color="text.secondary" maxWidth={760} mx="auto">
            TACTRA is a skill-based multiplayer grid game. Winning depends on smart scoring, not who
            plays first.
          </Typography>
        </Box>

        {/* SCORING SECTIONS */}
        {scoringRules.map((rule, index) => (
          <Box key={index} mb={{ xs: 8, md: 12 }}>
            <Grid
              container
              spacing={6}
              alignItems="center"
              direction={index % 2 === 0 ? "row" : "row-reverse"}
            >
              {/* IMAGE */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: { xs: 240, sm: 320, md: 380 },
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 24px 50px rgba(0,0,0,0.35)",
                  }}
                >
                  <Image src={rule.image} alt={rule.title} fill className="object-cover" />
                </Box>
              </Grid>

              {/* TEXT */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Chip
                  label="+1 Point • +Number of cell"
                  color="success"
                  sx={{ mb: 2, fontWeight: 700 }}
                />

                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {rule.title}
                </Typography>

                <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
                  {rule.description}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ))}

        {/* WINNING RULES */}
        <Box
          sx={{
            mt: 12,
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            background: "linear-gradient(135deg, rgba(0,255,136,0.12), rgba(0,204,255,0.12))",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Scoring & Winning Rules
          </Typography>

          <Stack spacing={2} mt={3}>
            <Typography>
              <strong>Each completed row, column, or diagonal</strong> gives{" "}
              <strong>+1 point</strong>
            </Typography>

            <Typography>
              Every completed pattern also counts as <strong>1 block</strong>
            </Typography>

            <Typography>
              <strong>Player with more points wins</strong>
            </Typography>

            <Typography>
              If points are equal → <strong>player with more blocks wins</strong>
            </Typography>

            <Typography>
              If both points and blocks are equal → <strong>Game Draw</strong>
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
