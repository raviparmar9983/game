"use client";

import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { CustomFormTextField } from "@/components/shared/CustomFormTextField";
import { CustomCheckbox } from "@/components/shared/CustomCheckbox";
import { useLoginUser } from "@/queries/auth-service";
import toast from "react-hot-toast";
import Link from "next/link";
import { loginSchema } from "@/schemas/authSchema";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

type LoginFormInputs = {
  email: string;
  hash: string;
  rememberMe?: boolean;
};

export default function LoginPage() {
  const router = useRouter();
  const { mutate, isPending } = useLoginUser();

  const { control, handleSubmit } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      hash: "",
      rememberMe: false,
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = (data: any) => {
    mutate(data, {
      onSuccess: (res) => {
        const { message, token } = res;

        if (!token?.accessToken) {
          toast.error("Unexpected response. Please try again.");
          return;
        }

        setCookie("accessToken", token.accessToken, {
          maxAge: data.rememberMe ? 60 * 60 * 24 * 7 : undefined, // 7 days
        });

        toast.success(message || "Login successful");
        router.replace("/");
      },
      onError: (error: any) => {
        const errorMessage = error?.message || "Login failed";

        toast.error(errorMessage);
      },
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        maxWidth: 420,
        width: "100%",
        backdropFilter: "blur(12px)",
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 4,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        p: 4,
        color: "#fff",
        zIndex: 2,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{
          mb: 1,
          fontWeight: 600,
          background: "linear-gradient(45deg, #00ff88, #00ccff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Welcome Back
      </Typography>

      <Typography
        align="center"
        sx={{ mb: 3, color: "#b0b0b0", fontSize: "0.95rem" }}
      >
        Enter your credentials to access the dashboard.
      </Typography>

      <CustomFormTextField
        name="email"
        control={control}
        label="Email"
        type="email"
        margin="normal"
        fullWidth
      />

      <CustomFormTextField
        name="hash"
        control={control}
        label="Password"
        type="password"
        margin="normal"
        fullWidth
      />

      <CustomCheckbox name="rememberMe" control={control} label="Remember Me" />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isPending}
        sx={{
          mt: 3,
          py: 1.4,
          fontWeight: 500,
          fontSize: "1rem",
          background: "linear-gradient(to right, #00ff88, #00ccff)",
          color: "#000",
          transition: "0.3s ease",
          "&:hover": {
            background: "linear-gradient(to right, #00ccff, #00ff88)",
          },
        }}
      >
        {isPending ? <CircularProgress size={24} color="inherit" /> : "Login"}
      </Button>

      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 2, color: "#b0b0b0" }}
      >
        <Link
          href="forgot-password"
          style={{
            color: "#00ccff",
            textDecoration: "underline",
            fontWeight: 500,
          }}
        >
          Forgot Password?
        </Link>
      </Typography>

      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 1, color: "#b0b0b0" }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="register"
          style={{
            color: "#00ff88",
            textDecoration: "underline",
            fontWeight: 500,
          }}
        >
          Register here
        </Link>
      </Typography>
    </Box>
  );
}
