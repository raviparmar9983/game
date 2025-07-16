'use client';

import CreateGameForm from '@/components/game/CreateGameForm';
import CustomButton from '@/components/shared/CustomButton';
import CustomModal from '@/components/shared/CustomModal';
import { useCallback, useState } from 'react';

const GamePage = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  return (
    <>
      <CustomButton variant="outlined" color="secondary" onClick={handleOpen}>
        open
      </CustomButton>
      <CustomModal
        open={open}
        onClose={handleClose}
        animation="slide"
        anchor="right"
      >
        <CreateGameForm />
      </CustomModal>
    </>
  );
};

export default GamePage;
