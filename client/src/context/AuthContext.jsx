import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi, updateProfileApi, addAddressApi, updateAddressApi, deleteAddressApi } from '../services/api';
import { useUI } from './UIContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('extrad_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useUI();

  useEffect(() => {
    if (user?.token) {
      // Refresh current user metadata
      getMeApi()
        .then((res) => {
          const updated = { ...user, ...res.data };
          setUser(updated);
          localStorage.setItem('extrad_user', JSON.stringify(updated));
        })
        .catch((err) => {
          console.error('Session expired or invalid token:', err);
        });
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginApi({ email, password });
      setUser(res.data);
      localStorage.setItem('extrad_user', JSON.stringify(res.data));
      addToast(`Welcome back, ${res.data.name}!`, 'success');
      return { success: true, user: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      addToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await registerApi(userData);
      setUser(res.data);
      localStorage.setItem('extrad_user', JSON.stringify(res.data));
      addToast(`Account created! Welcome to Extrad, ${res.data.name}!`, 'success');
      return { success: true, user: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      addToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('extrad_user');
    addToast('Logged out successfully', 'info');
  };

  const updateProfile = async (data) => {
    try {
      const res = await updateProfileApi(data);
      const updated = { ...user, ...res.data };
      setUser(updated);
      localStorage.setItem('extrad_user', JSON.stringify(updated));
      addToast('Profile updated successfully!', 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Profile update failed';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const addAddress = async (data) => {
    try {
      const res = await addAddressApi(data);
      const updated = { ...user, addresses: res.data };
      setUser(updated);
      localStorage.setItem('extrad_user', JSON.stringify(updated));
      addToast('Address saved successfully!', 'success');
      return { success: true };
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to add address', 'error');
      return { success: false };
    }
  };

  const updateAddress = async (id, data) => {
    try {
      const res = await updateAddressApi(id, data);
      const updated = { ...user, addresses: res.data };
      setUser(updated);
      localStorage.setItem('extrad_user', JSON.stringify(updated));
      addToast('Address updated!', 'success');
      return { success: true };
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update address', 'error');
      return { success: false };
    }
  };

  const deleteAddress = async (id) => {
    try {
      const res = await deleteAddressApi(id);
      const updated = { ...user, addresses: res.data };
      setUser(updated);
      localStorage.setItem('extrad_user', JSON.stringify(updated));
      addToast('Address removed', 'info');
      return { success: true };
    } catch (err) {
      addToast('Failed to delete address', 'error');
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
