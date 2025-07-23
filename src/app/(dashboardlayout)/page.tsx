'use client';

import { CreateRoomForm, CustomButton, CustomModal } from '@/components';
import { useCallback, useState } from 'react';
import { useUserProfileQuery } from '@/queries';
import TicTacToeBackdropLoader from '@/components/shared/Loader';

const DashBoardPage = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  // ✅ Call the profile query hook
  const { data: user, isLoading } = useUserProfileQuery();

  if (isLoading) return <TicTacToeBackdropLoader />;

  return (
    <>
      <h2>Welcome, {user?.firstName}</h2>

      <CustomButton variant="outlined" color="secondary" onClick={handleOpen}>
        Open Room Form
      </CustomButton>

      <CustomModal
        open={open}
        onClose={handleClose}
        animation="slide"
        anchor="right"
      >
        <CreateRoomForm />
      </CustomModal>
    </>
  );
};

export default DashBoardPage;
