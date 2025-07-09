"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { useForgotPassword } from "@/queries/auth-service";
import { CustomFormTextField } from "@/components/shared/CustomFormTextField";

type ForgotPasswordInputs = {
  email: string;
};

// ✅ Yup schema
const forgotPasswordSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

// ✅ Main Component
export default function ForgotPasswordPage() {
  const { mutate, isPending } = useForgotPassword();

  const { control, handleSubmit, reset } = useForm<ForgotPasswordInputs>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = (formData) => {
    mutate(formData, {
      onSuccess: (res: any) => {
        toast.success(res?.message || "Reset link sent! Check your email.");
        reset();
      },
      onError: (error: any) => {
        const message = error?.message || "Failed to send reset link.";
        toast.error(message);
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
        mx: "auto",
        mt: 8,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{
          mb: 1,
          fontWeight: 600,
          background: "linear-gradient(45deg, #00ccff, #ff6b35)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Forgot Password
      </Typography>

      <Typography
        align="center"
        sx={{ mb: 3, color: "#b0b0b0", fontSize: "0.95rem" }}
      >
        Enter your email to receive a password reset link.
      </Typography>

      <CustomFormTextField
        name="email"
        control={control}
        label="Email"
        type="email"
        margin="normal"
        fullWidth
        autoComplete="email"
      />

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
        {isPending ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Send Reset Link"
        )}
      </Button>

      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 3, color: "#b0b0b0" }}
      >
        Remembered your password?{" "}
        <a
          href="login"
          style={{
            color: "#00ccff",
            textDecoration: "underline",
            fontWeight: 500,
          }}
        >
          Go back to login
        </a>
      </Typography>
    </Box>
  );
}
