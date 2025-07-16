'use client';

import React, { useState } from 'react';
import { Box, Step, StepLabel, Stepper } from '@mui/material';
import { useForm } from 'react-hook-form';
import CustomButton from '@/components/shared/CustomButton';
import { CustomFormTextField } from '../shared/CustomFormTextField';

const steps = ['Grid Size', 'Number of Players', 'Player Names'];

type FormValues = {
  gridSize: number;
  playerCount: number;
  playerNames: string[];
};
const CreateGameForm = () => {
  const [activeStep, setActiveStep] = useState(0);

  const { control, handleSubmit, watch, setValue, trigger } =
    useForm<FormValues>({
      defaultValues: {
        gridSize: 3,
        playerCount: 2,
        playerNames: [],
      },
    });

  watch('gridSize');
  const playerCount = watch('playerCount');

  const handleNext = async () => {
    const valid = await trigger();
    if (!valid) return;

    if (activeStep === 1) {
      const names = Array.from(
        { length: playerCount },
        (_, i) => `Player ${i + 1}`,
      );
      setValue('playerNames', names);
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onSubmit = () => {
    // Proceed to next screen or setup
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {activeStep === 0 && (
          <CustomFormTextField
            name="gridSize"
            control={control}
            label="gridSize"
            type="number"
            margin="normal"
            fullWidth
          />
        )}

        {activeStep === 1 && (
          <CustomFormTextField
            name="playerCount"
            control={control}
            label="No of player"
            type="text"
            margin="normal"
            fullWidth
          />
        )}

        {activeStep === 2 &&
          playerCount > 0 &&
          [...Array(playerCount)].map((_, index) => (
            <CustomFormTextField
              name="playerNames"
              key={index}
              control={control}
              label="playerNames"
              type="text"
              margin="normal"
              fullWidth
            />
          ))}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          {activeStep > 0 && (
            <CustomButton variant="outlined" onClick={handleBack}>
              Back
            </CustomButton>
          )}
          {activeStep < steps.length - 1 ? (
            <CustomButton variant="contained" onClick={handleNext}>
              Next
            </CustomButton>
          ) : (
            <CustomButton variant="contained" type="submit">
              Start Game
            </CustomButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CreateGameForm;
