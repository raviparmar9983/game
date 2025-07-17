'use client';

import React, { ReactElement, useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Grid,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Button,
  LinearProgress,
  SvgIconProps,
} from '@mui/material';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  BeeIcon,
  BoltIcon,
  CircleIcon,
  CrossIcon,
  CrownIcon,
  DangerIcon,
  MagnetIcon,
  PlanetIcon,
  RocketIcon,
  SkullIcon,
  SpiralIcon,
  StarIcon,
} from '@/icons';
import { gridSchema, playerCountSchema, playerDetailsSchema } from '@/schemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { CustomFormTextField } from '../shared/CustomFormTextField';

export type GameIconItem = {
  id: string;
  label: string;
  icon: (props: SvgIconProps) => ReactElement;
};

export const GAME_ICONS: GameIconItem[] = [
  { id: 'cross', label: 'Cross', icon: (props) => <CrossIcon {...props} /> },
  { id: 'circle', label: 'Circle', icon: (props) => <CircleIcon {...props} /> },
  { id: 'star', label: 'Star', icon: (props) => <StarIcon {...props} /> },
  { id: 'bolt', label: 'Bolt', icon: (props) => <BoltIcon {...props} /> },
  { id: 'spiral', label: 'Spiral', icon: (props) => <SpiralIcon {...props} /> },
  { id: 'skull', label: 'Skull', icon: (props) => <SkullIcon {...props} /> },
  { id: 'danger', label: 'Danger', icon: (props) => <DangerIcon {...props} /> },
  { id: 'rocket', label: 'Rocket', icon: (props) => <RocketIcon {...props} /> },
  { id: 'bee', label: 'Bee', icon: (props) => <BeeIcon {...props} /> },
  { id: 'magnet', label: 'Magnet', icon: (props) => <MagnetIcon {...props} /> },
  { id: 'crown', label: 'Crown', icon: (props) => <CrownIcon {...props} /> },
  { id: 'planet', label: 'Planet', icon: (props) => <PlanetIcon {...props} /> },
];

type FormValues = {
  gridSize: number;
  playerCount: number;
  playerNames: { name: string; iconId: string }[];
};

const steps = ['Grid Configuration', 'Player Setup', 'Player Details'];

const CreateGameForm = () => {
  const getStepSchema = (step: any): any => {
    switch (step) {
      case 0:
        return gridSchema;
      case 1:
        return playerCountSchema;
      case 2:
        return playerDetailsSchema;
      default:
        return gridSchema;
    }
  };

  const [activeStep, setActiveStep] = useState(0);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
  } = useForm<FormValues>({
    defaultValues: { gridSize: 3, playerCount: 2, playerNames: [] },
    resolver: yupResolver(getStepSchema(activeStep)),
  });

  const { fields, update } = useFieldArray({
    control,
    name: 'playerNames',
  });

  const gridSize = watch('gridSize');
  const playerCount = watch('playerCount');
  const playerNames = watch('playerNames');

  const handleNext = async () => {
    // Reapply the schema before validation
    const currentSchema = getStepSchema(activeStep);
    reset(watch(), {
      keepValues: true,
      keepErrors: true,
      keepDirty: true,
      keepTouched: true,
      keepIsSubmitted: false,
      keepSubmitCount: false,
      keepDefaultValues: true,
      resolver: yupResolver(currentSchema),
    } as any);

    const isValid = await trigger();
    if (!isValid) return;

    if (activeStep === 1) {
      const players = Array.from({ length: watch('playerCount') }, (_, i) => ({
        name: `Player ${i + 1}`,
        iconId: '',
      }));
      setValue('playerNames', players);
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const onSubmit = () => {
    // console.log('Game Configuration:', data);/
  };

  const updatePlayerName = (index: number, name: string) => {
    update(index, { ...fields[index], name });
  };

  const updatePlayerIcon = (index: number, iconId: string) => {
    update(index, { ...fields[index], iconId });
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Choose Grid Size
            </Typography>
            <Grid container spacing={2}>
              {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((size) => (
                <Grid size={3} key={size}>
                  <Button
                    fullWidth
                    variant={gridSize === size ? 'contained' : 'outlined'}
                    onClick={() => setValue('gridSize', size)}
                  >
                    {size}×{size}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </>
        );

      case 1:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Select Number of Players
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Players</InputLabel>
              <Select
                value={playerCount}
                label="Players"
                onChange={(e) =>
                  setValue('playerCount', Number(e.target.value))
                }
              >
                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((count) => (
                  <MenuItem key={count} value={count}>
                    {count} Players
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );

      case 2:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Customize Players
            </Typography>
            {fields.map((field, index) => {
              const SelectedIcon = GAME_ICONS.find(
                (icon) => icon.id === field.iconId,
              )?.icon;
              const usedIcons = playerNames
                .filter((_, i) => i !== index)
                .map((p) => p.iconId);

              return (
                <Card key={field.id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar>{field.name.charAt(0)}</Avatar>
                      <CustomFormTextField
                        name="playerNames"
                        control={control}
                        label="Player Name"
                        type="playerNames"
                        margin="normal"
                        onChange={(e) =>
                          updatePlayerName(index, e.target.value)
                        }
                      />
                    </Box>

                    <FormControl fullWidth>
                      <InputLabel>Icon</InputLabel>
                      <Select
                        value={field.iconId}
                        label="Icon"
                        onChange={(e) =>
                          updatePlayerIcon(index, e.target.value)
                        }
                      >
                        {GAME_ICONS.map((icon) => {
                          const IconComp = icon.icon;
                          const isUsed = usedIcons.includes(icon.id);

                          return (
                            <MenuItem
                              key={icon.id}
                              value={icon.id}
                              disabled={isUsed}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  color: 'primary',
                                }}
                              >
                                <IconComp fontSize="small" color="primary" />
                                {icon.label}
                              </Box>
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>

                    {SelectedIcon && (
                      <Box
                        sx={{ mt: 1, display: 'flex', alignItems: 'center' }}
                      >
                        <Typography variant="caption">Preview:</Typography>
                        <SelectedIcon fontSize="large" color="primary" />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Create New Game
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <LinearProgress
        variant="determinate"
        value={(activeStep / (steps.length - 1)) * 100}
        sx={{ mb: 3 }}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          {activeStep > 0 && (
            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="submit" variant="contained">
              Start Game
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
};

export { CreateGameForm };
