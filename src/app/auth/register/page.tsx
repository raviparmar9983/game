'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Typography } from '@mui/material';
import { CustomFormTextField } from '@/components/shared/CustomFormTextField';
import { CustomCheckbox } from '@/components/shared/CustomCheckbox';
import { useRegisterUser } from '@/queries/auth-service';
import toast from 'react-hot-toast';
import { registerSchema } from '@/schemas/authSchema';
import { RegisterFormInputs } from '@/types/userTypes';
import Link from 'next/link';
import CustomButton from '@/components/shared/CustomButton';

export default function RegisterPage() {
  const { mutate, isPending } = useRegisterUser();
  const [isRegistered, setIsRegistered] = React.useState(false);
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      hash: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: any) => {
    const { ...userPayload } = data;

    if (userPayload.birthDate) {
      userPayload.birthDate = new Date(
        userPayload.birthDate,
      ).toISOString() as any;
    }

    mutate(userPayload as RegisterFormInputs, {
      onSuccess: (res) => {
        toast.success(res.message);
        setIsRegistered(true);
        reset();
      },
      onError: (err: Error) => {
        const msg = err.message;
        toast.error(msg);
      },
    });
  };

  return (
    <>
      {isRegistered ? (
        <Box
          sx={{
            textAlign: 'center',
            p: 4,
            color: '#fff',
          }}
        >
          <Typography variant="h4">Verify Your Email ✉️</Typography>
          <Typography sx={{ mb: 3, color: '#b0b0b0' }}>
            We&apos;ve sent a verification link to your email. Please check your
            inbox and confirm your email address to complete the registration.
          </Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2, borderColor: '#00ccff', color: '#00ccff' }}
            onClick={() => setIsRegistered(false)}
          >
            Back to Sign Up
          </Button>
        </Box>
      ) : (
        <Box
          component="form"
          sx={{
            maxWidth: 420,
            backdropFilter: 'blur(12px)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 1,
            p: 4,
          }}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Typography variant="h4" align="center">
            Create Account
          </Typography>

          <Typography
            align="center"
            sx={{ mb: 3, color: '#b0b0b0', fontSize: '0.95rem' }}
          >
            Join the future. Fast, secure, and stylish sign-up.
          </Typography>

          <CustomFormTextField
            name="firstName"
            control={control}
            label="First Name"
            margin="normal"
          />
          <CustomFormTextField
            name="lastName"
            control={control}
            label="Last Name"
            margin="normal"
          />
          <CustomFormTextField
            name="phoneNumber"
            control={control}
            label="Phone Number"
            type="tel"
            margin="normal"
          />
          <CustomFormTextField
            name="email"
            control={control}
            label="Email"
            type="email"
            margin="normal"
          />
          <CustomFormTextField
            name="hash"
            control={control}
            label="Password"
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
          {/* <CustomFormTextField
        name="birthDate"
        control={control}
        label="Birth Date (optional)"
        type="date"
        margin="normal"
        InputLabelProps={{ shrink: true }}
      /> */}

          <CustomCheckbox
            name="agreeTerms"
            control={control}
            label="I agree to the terms"
          />

          <CustomButton
            fullWidth
            type="submit"
            variant="contained"
            loading={isPending}
          >
            Register
          </CustomButton>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 1, color: '#b0b0b0' }}
          >
            Already have an account?{' '}
            <Link
              href="login"
              style={{
                color: '#00ff88',
                textDecoration: 'underline',
                fontWeight: 500,
              }}
            >
              Login here
            </Link>
          </Typography>
        </Box>
      )}
    </>
  );
}
