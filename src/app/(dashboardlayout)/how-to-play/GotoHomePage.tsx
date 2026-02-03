"use client";

import { CustomButton } from "@/components";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { memo, useCallback } from "react";

function BackToDashboardButton() {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <Box textAlign="center" mt={1}>
      <CustomButton size="large" variant="contained" color="primary" onClick={handleBack}>
        Back to Dashboard
      </CustomButton>
    </Box>
  );
}

export default memo(BackToDashboardButton);
