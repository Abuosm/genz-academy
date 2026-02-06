import { createContext, useReducer, useEffect } from 'react';
import api from '../utils/api';
import axios from 'axios';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null
};

export const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
        error: null
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'REGISTER_FAIL':
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadUser = async () => {
    try {
      const res = await api.get('/auth');
      dispatch({
        type: 'USER_LOADED',
        payload: res.data
      });
    } catch (err) {
      console.log('loadUser: Auth error', err);
      localStorage.removeItem('token');
      dispatch({
        type: 'AUTH_ERROR'
      });
    }
  };

  const register = async formData => {
    try {
      const res = await api.post('/auth/register', formData);
      console.log('Register success, setting token');
      localStorage.setItem('token', res.data.accessToken);
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: { token: res.data.accessToken }
      });
      loadUser();
    } catch (err) {
      localStorage.removeItem('token');
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data?.msg || 'Registration failed'
      });
    }
  };

  const login = async formData => {
    try {
      const res = await api.post('/auth/login', formData);
      console.log('Login success, setting token:', res.data.accessToken);
      localStorage.setItem('token', res.data.accessToken);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token: res.data.accessToken }
      });
      loadUser();
    } catch (err) {
      localStorage.removeItem('token');
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.msg || 'Login failed'
      });
    }
  };

  const socialLogin = async (tokens) => {
    localStorage.setItem('token', tokens.accessToken);
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { token: tokens.accessToken }
    });
    loadUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        socialLogin,
        logout,
        clearErrors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
