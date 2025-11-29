"use client";
import { SocketProvider } from "@/context";
import { useAppDistpatch } from "@/lib/hooks";
import { setUser } from "@/lib/reducers/userReducer";
import { useUserProfileQuery } from "@/queries";
import React, { useEffect } from "react";

function DashBoardLayout({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useUserProfileQuery();
  const dispatch = useAppDistpatch();

  useEffect(() => {
    if (user && !isLoading) {
      dispatch(setUser(user.data));
    }
  }, [user, isLoading, dispatch]);
  return <SocketProvider>{children}</SocketProvider>;
}

export default DashBoardLayout;
