'use client';

import { getSocket } from '@/lib';
// import { useAppSelector } from '@/lib/hooks';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

const GameLobbyPage = () => {
  const socket = useMemo(() => getSocket(), []);
  const searchParam = useParams();
  // const user = useAppSelector((state) => state.User);
  // console.log(user);

  useEffect(() => {
    if (!socket || !searchParam['room-id']) return;
    // console.log(socket);

    socket.emit('joinRoom', {
      gameId: searchParam['room-id'],
    });

    // socket.on('playerJoined', (data) => {
    //   console.log('Player joined:', data);
    // });

    return () => {
      socket.off('playerJoined');
    };
  }, [socket]);

  return <div>Welcome</div>;
};

export default GameLobbyPage;
