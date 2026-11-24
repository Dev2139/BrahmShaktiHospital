import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

// Central role-to-dashboard routing logic
export const getDashboardForRole = (role) => {
  switch (role) {
    case 'superadmin':
    case 'admin':
      return '/admin/dashboard';
    case 'doctor':
      return '/doctor/dashboard';
    case 'pharmacist':
      return '/pharmacist/dashboard';
    case 'supplier':
      return '/supplier/dashboard';
    case 'receptionist':
      return '/receptionist/dashboard';
    case 'blood_bank_technician':
      return '/admin/blood-bank';
    case 'patient':
      return '/patient/dashboard';
    default:
      return '/admin/dashboard';
  }
};

export const isStaffRole = (role) => {
  return Boolean(role && role !== 'patient');
};

// 10 days session persistence in milliseconds
const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved session with 10 days persistence
    const savedToken = localStorage.getItem('bsh_token');
    const savedUser = localStorage.getItem('bsh_user');
    const savedExpiry = localStorage.getItem('bsh_auth_expiry');

    if (savedToken && savedUser) {
      try {
        const now = Date.now();
        if (savedExpiry && now > parseInt(savedExpiry, 10)) {
          // Session expired after 10 days
          localStorage.removeItem('bsh_token');
          localStorage.removeItem('bsh_user');
          localStorage.removeItem('bsh_auth_expiry');
          setToken(null);
          setUser(null);
        } else {
          // Still valid within 10 days
          if (!savedExpiry) {
            localStorage.setItem('bsh_auth_expiry', (now + TEN_DAYS_MS).toString());
          }
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        localStorage.removeItem('bsh_token');
        localStorage.removeItem('bsh_user');
        localStorage.removeItem('bsh_auth_expiry');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token: jwtToken, user: userData } = response.data;
        const expiry = Date.now() + TEN_DAYS_MS;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('bsh_token', jwtToken);
        localStorage.setItem('bsh_user', JSON.stringify(userData));
        localStorage.setItem('bsh_auth_expiry', expiry.toString());
        toast.success(`Welcome back, ${userData.name}!`);
        return { success: true, user: userData };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        const { token: jwtToken, user: newUser } = response.data;
        const expiry = Date.now() + TEN_DAYS_MS;
        setToken(jwtToken);
        setUser(newUser);
        localStorage.setItem('bsh_token', jwtToken);
        localStorage.setItem('bsh_user', JSON.stringify(newUser));
        localStorage.setItem('bsh_auth_expiry', expiry.toString());
        toast.success('Registration successful!');
        return { success: true, user: newUser };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('bsh_token');
    localStorage.removeItem('bsh_user');
    localStorage.removeItem('bsh_auth_expiry');
    toast.success('Logged out successfully');
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/auth/change-password', { currentPassword, newPassword });
      if (response.data.success) {
        const updatedUser = { ...(user || {}), mustChangePassword: false };
        setUser(updatedUser);
        localStorage.setItem('bsh_user', JSON.stringify(updatedUser));
        toast.success('Password updated successfully.');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Password change failed.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const setAuthSession = (userData, jwtToken = 'bsh_jwt_token_' + Date.now()) => {
    const expiry = Date.now() + TEN_DAYS_MS;
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem('bsh_token', jwtToken);
    localStorage.setItem('bsh_user', JSON.stringify(userData));
    localStorage.setItem('bsh_auth_expiry', expiry.toString());
  };

  const updateUserData = (updatedFields) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('bsh_user', JSON.stringify(merged));
      return merged;
    });
  };

  const switchDemoRole = async (targetRole) => {
    const roleCredentials = {
      superadmin: { email: 'superadmin@brahmshaktihospital.com', password: 'SuperAdmin@123' },
      admin: { email: 'admin@brahmshaktihospital.com', password: 'Admin@123' },
      doctor: { email: 'doctor@brahmshaktihospital.com', password: 'Doctor@123' },
      pharmacist: { email: 'pharmacist@brahmshaktihospital.com', password: 'Pharmacist@123' },
      supplier: { email: 'supplier@brahmshaktihospital.com', password: 'Supplier@123' },
      receptionist: { email: 'receptionist@brahmshaktihospital.com', password: 'Receptionist@123' },
      blood_bank_technician: { email: 'bloodbank@brahmshaktihospital.com', password: 'BloodBank@123' },
      patient: { email: 'patient@brahmshaktihospital.com', password: 'Patient@123' }
    };

    const creds = roleCredentials[targetRole];
    if (creds) {
      return await login(creds.email, creds.password);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isStaff: isStaffRole(user?.role),
        dashboardPath: getDashboardForRole(user?.role),
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        changePassword,
        switchDemoRole,
        updateUserData,
        setAuthSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
