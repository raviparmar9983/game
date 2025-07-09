"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { CustomFormTextField } from "@/components/shared/CustomFormTextField";
import { useResetPassword } from "@/queries/auth-service";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

// ✅ Yup schema
const resetPasswordSchema = yup.object({
  hash: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("hash")], "Passwords must match")
    .required("Please confirm your password"),
});

type ResetPasswordInputs = {
  hash: string;
  confirmPassword: string;
};

export default function ResetPasswordPage() {
  const { mutate, isPending } = useResetPassword();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { control, handleSubmit, reset } = useForm<ResetPasswordInputs>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      hash: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      toast.error("Reset token is missing or invalid.");
      router.replace("login");
    }
  }, [token, router]);

  const onSubmit: SubmitHandler<ResetPasswordInputs> = (formData) => {
    if (!token) {
      toast.error("Missing token. Cannot reset password.");
      return;
    }

    mutate(
      {
        token,
        password: formData.hash,
      },
      {
        onSuccess: (res: any) => {
          toast.success(res?.message || "Password reset successful!");
          reset();

          setTimeout(() => {
            router.push("login");
          }, 2000);
        },
        onError: (error: any) => {
          const errorMessage =
            error?.message || "Failed to reset password. Please try again.";
          toast.error(errorMessage);
        },
      }
    );
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
          background: "linear-gradient(45deg, #ff6b35, #00ff88)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Reset Password
      </Typography>

      <Typography
        align="center"
        sx={{ mb: 3, color: "#b0b0b0", fontSize: "0.95rem" }}
      >
        Enter your new password and confirm it to reset access.
      </Typography>

      <CustomFormTextField
        name="hash"
        control={control}
        label="New Password"
        type="password"
        margin="normal"
      />

      <CustomFormTextField
        name="confirmPassword"
        control={control}
        label="Confirm Password"
        type="password"
        margin="normal"
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
          background: "linear-gradient(to right, #00ccff, #00ff88)",
          color: "#000",
          "&:hover": {
            background: "linear-gradient(to right, #00ff88, #00ccff)",
          },
        }}
      >
        {isPending ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Reset Password"
        )}
      </Button>
    </Box>
  );
}
