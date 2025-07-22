import { io, Socket } from 'socket.io-client';
import { environment } from './env';
import { deleteCookie, getCookie } from 'cookies-next';
import toast from 'react-hot-toast';
let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const token = getCookie('accessToken');
    socket = io(environment.SOCKET_URL, {
      auth: {
        token, // 🔐 JWT or other token
      },
      transports: ['websocket'], // optional: force websocket
      reconnection: true,
    });

    socket.on('connect', () => {
      // console.log('Socket connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      // console.log('Socket disconnected');
    });

    socket.on('connect_error', (err) => {
      if (err?.message == 'Invalid Token!!') {
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        if (typeof window !== 'undefined') window.location.href = '/auth/login';
      }
      toast.error(err.message);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
