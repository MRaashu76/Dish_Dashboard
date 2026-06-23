import { useEffect, useState } from "react";
import socket from "../services/socket";

/**
 * Custom hook that encapsulates all Socket.io connection state and event
 * subscriptions. Automatically cleans up listeners on unmount.
 *
 * @param {string} eventName - The socket event to listen for
 * @param {Function} onEvent - Callback invoked with the event payload
 * @returns {{ isConnected: boolean, socketId: string | null }}
 */
const useSocket = (eventName, onEvent) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [socketId, setSocketId] = useState(socket.id || null);

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      setSocketId(socket.id);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setSocketId(null);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (eventName && typeof onEvent === "function") {
      socket.on(eventName, onEvent);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      if (eventName && typeof onEvent === "function") {
        socket.off(eventName, onEvent);
      }
    };
  }, [eventName, onEvent]);

  return { isConnected, socketId };
};

export default useSocket;
