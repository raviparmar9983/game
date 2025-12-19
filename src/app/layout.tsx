// app/layout.tsx
import { Providers } from "@/providers";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "TACTRA | Multiplayer Strategy Game",
    template: "%s | TACTRA",
  },

  description:
    "TACTRA is a real-time multiplayer strategy game where every move matters. Play with friends, sharpen your mind, and compete in a tactical grid-based battle.",

  keywords: [
    "TACTRA",
    "multiplayer game",
    "strategy game",
    "online board game",
    "real time multiplayer game",
    "web game",
    "indie game",
    "mind game",
    "grid strategy game",
    "play with friends",
  ],

  authors: [{ name: "TACTRA Team" }],
  creator: "TACTRA",
  publisher: "TACTRA",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tactra.com",
    siteName: "TACTRA",
    title: "TACTRA – Every Move Matters",
    description:
      "A real-time multiplayer strategy game. Challenge your mind, play with friends, and make every move count.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TACTRA Multiplayer Strategy Game",
      },
    ],
  },

  // twitter: {
  //   card: "summary_large_image",
  //   title: "TACTRA – Multiplayer Strategy Game",
  //   description: "Every move matters. Play a real-time multiplayer strategy game with friends.",
  //   images: ["/og-image.png"],
  //   creator: "@tactra_game", // optional
  // },

  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },

  category: "Gaming",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
