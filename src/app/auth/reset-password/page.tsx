'use client';

import React, { Suspense, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, CircularProgress, Typography } from '@mui/material';
import { CustomFormTextField } from '@/components/shared/CustomFormTextField';
import { useResetPassword } from '@/queries/auth-service';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { ApiResponse } from '@/types/common.type';
import CustomButton from '@/components/shared/CustomButton';
import { resetPasswordSchema } from '@/schemas/authSchema';

type ResetPasswordInputs = {
  hash: string;
  confirmPassword: string;
};

function ResetPasswordPage() {
  const { mutate, isPending } = useResetPassword();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { control, handleSubmit, reset } = useForm<ResetPasswordInputs>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      hash: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!token) {
      toast.error('Reset token is missing or invalid.');
      router.replace('login');
    }
  }, [token, router]);

  const onSubmit: SubmitHandler<ResetPasswordInputs> = (formData) => {
    if (!token) {
      toast.error('Missing token. Cannot reset password.');
      return;
    }

    mutate(
      {
        token,
        password: formData.hash,
      },
      {
        onSuccess: (res: ApiResponse) => {
          toast.success(res?.message || 'Password reset successful!');
          reset();

          setTimeout(() => {
            router.push('login');
          }, 2000);
        },
        onError: (error: Error) => {
          const errorMessage =
            error?.message || 'Failed to reset password. Please try again.';
          toast.error(errorMessage);
        },
      },
    );
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        maxWidth: 420,
        backdropFilter: 'blur(12px)',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 1,
        p: 4,
      }}
    >
      <Typography variant="h4" align="center">
        Reset Password
      </Typography>

      <Typography
        align="center"
        sx={{ mb: 3, color: '#b0b0b0', fontSize: '0.95rem' }}
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

      <CustomButton
        fullWidth
        type="submit"
        variant="contained"
        loading={isPending}
      >
        Reset Password
      </CustomButton>
    </Box>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <ResetPasswordPage />
    </Suspense>
  );
}
