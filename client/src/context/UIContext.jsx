import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [isCouponDrawerOpen, setIsCouponDrawerOpen] = useState(false);
  const [activeCouponModal, setActiveCouponModal] = useState(null);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <UIContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        isCouponDrawerOpen,
        setIsCouponDrawerOpen,
        activeCouponModal,
        setActiveCouponModal
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
