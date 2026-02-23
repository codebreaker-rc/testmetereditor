'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      username
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        username
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $username: String!, $password: String!) {
    register(email: $email, username: $username, password: $password) {
      token
      user {
        id
        email
        username
      }
    }
  }
`;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const { data, loading: queryLoading } = useQuery(ME_QUERY, {
    skip: !Cookies.get('auth-token'),
    onCompleted: (data) => {
      if (data?.me) {
        setUser(data.me);
      }
    },
    onError: () => {
      Cookies.remove('auth-token');
      setUser(null);
    },
  });

  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [registerMutation, { loading: registerLoading }] = useMutation(REGISTER_MUTATION);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });

      if (data?.login) {
        Cookies.set('auth-token', data.login.token, { expires: 7 });
        setUser(data.login.user);
        router.push('/language-select');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      const { data } = await registerMutation({
        variables: { email, username, password },
      });

      if (data?.register) {
        Cookies.set('auth-token', data.register.token, { expires: 7 });
        setUser(data.register.user);
        router.push('/language-select');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('auth-token');
    setUser(null);
    router.push('/');
  };

  const loading = queryLoading || loginLoading || registerLoading;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
