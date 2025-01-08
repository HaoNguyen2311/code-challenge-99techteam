"use client";

import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

export interface NotificationRef {
  showNotification: (msg: string) => void;
  hideNotification: () => void;
}

interface NotificationProps {
  message: string;
  onClose?: () => void;
}

const Notification = forwardRef<NotificationRef, NotificationProps>(
  ({ message, onClose }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [messageState, setMessage] = useState(message);

    useImperativeHandle(ref, () => ({
      showNotification(msg: string) {
        setIsVisible(true);
        setMessage(msg);
        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      },
      hideNotification() {
        setIsVisible(false);
      },
    }));

    useEffect(() => {
      if (message) {
        setMessage(message);
      }
    }, [message]);

    if (!isVisible) return null;

    return (
      <div
        className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4"
        role="alert"
      >
        <div>{messageState}</div>
        <button
          className="bg-transparent text-white font-bold px-2 py-1 rounded hover:bg-red-700"
          onClick={() => {
            setIsVisible(false);
            onClose && onClose();
          }}
        >
          X
        </button>
      </div>
    );
  }
);

export default Notification;
