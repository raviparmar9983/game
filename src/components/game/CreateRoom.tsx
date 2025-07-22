'use client';

import { Box, Typography, Grid, Button, LinearProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CustomFormSelect } from '../shared/CustomSelect';
import { createRoomSchema } from '@/schemas';
import { useCreateRoom } from '@/queries';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ApiResponse, CreateRoomFormInputs } from '@/types';
import { CustomButton } from '../shared/CustomButton';

export const CreateRoomForm = () => {
  const router = useRouter();

  const { control, handleSubmit, watch, setValue } =
    useForm<CreateRoomFormInputs>({
      defaultValues: {
        gridSize: 3,
        playerCount: 2,
      },
      resolver: yupResolver(createRoomSchema),
    });

  const { mutate, isPending } = useCreateRoom();

  const gridSize = watch('gridSize');

  const onSubmit = (data: CreateRoomFormInputs) => {
    createRoom(data);
  };

  const createRoom = (data: CreateRoomFormInputs) => {
    mutate(data, {
      onSuccess: (res: ApiResponse) => {
        const { message, data } = res;
        router.push(`/game/lobby/${data?._id}`);
        toast.success(message);
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Create Game Room
      </Typography>

      <LinearProgress variant="determinate" value={100} sx={{ mb: 3 }} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h6" gutterBottom>
          Choose Grid Size
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((size) => (
            <Grid size={{ xs: 4, sm: 3 }} key={size}>
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

        <Typography variant="h6" gutterBottom>
          Number of Players
        </Typography>

        <CustomFormSelect
          name="playerCount"
          control={control}
          label="Players"
          defaultValue={2}
          options={Array.from({ length: 11 }, (_, i) => ({
            label: `${i + 2} Players`,
            value: i + 2,
          }))}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <CustomButton type="submit" loading={isPending}>
            Create Room
          </CustomButton>
        </Box>
      </form>
    </Box>
  );
};
