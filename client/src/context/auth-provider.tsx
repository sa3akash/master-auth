"use client";

import { getCurrent } from "@/lib/api";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type UserType = {
  _id?: string;
  profilePicture?: string;
  name: string;
  role: "ADMIN" | "MANAGER" | "USER";
  email: string;
  emailVerified: Date;
  userPreferences: IUserPreferences;

  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface IUserPreferences {
  enable2FA: boolean;
  emailNotification: boolean;
  twoFactorSecret: string;
}

type AuthContextType = {
  user?: UserType;
  isLoading: boolean;
  refetch: () => void;
  setUser: (data: UserType) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  const getSession = useCallback(async () => {
    try {
      const { data } = await getCurrent();
      setUser(data);
    } catch (error) {
      if(error instanceof AxiosError){
        if (error.response?.data.statusCode === 401) {
          router.push("/");
          router.refresh();
          
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!user) {
      getSession();
    }
  }, [getSession, user]);

  return (
    <AuthContext.Provider
      value={{ user, refetch: getSession, isLoading, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const conext = useContext(AuthContext);
  if (!conext) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return conext;
};
