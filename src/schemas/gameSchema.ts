import * as yup from 'yup';

export const gridSchema = yup.object().shape({
  gridSize: yup.number().required('Grid size is required').min(3).max(12),
});

export const playerCountSchema = yup.object().shape({
  playerCount: yup
    .number()
    .required('Player count is required')
    .min(2, 'Minimum 2 players required')
    .max(12, 'Maximum 12 players allowed'),
});

export const playerDetailsSchema = yup.object().shape({
  playerNames: yup
    .array()
    .of(
      yup.object().shape({
        name: yup
          .string()
          .required('Player name is required')
          .min(1, 'Name cannot be empty'),
        iconId: yup.string().required('Player icon is required'),
      }),
    )
    .min(2, 'At least 2 players must be configured'),
});

export const createRoomSchema = yup.object({
  gridSize: yup.number().required('Grid size is required').min(3).max(12),
  playerCount: yup
    .number()
    .required('Player count is required')
    .min(2)
    .max(12)
    .test('max-by-grid', 'Players cannot exceed grid size', function (value) {
      const { gridSize } = this.parent;
      return value <= gridSize;
    }),
});
