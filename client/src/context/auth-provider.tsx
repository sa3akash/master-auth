"use client";

import { getCurrent } from "@/lib/api";
import { publicRoutes } from "@/routes";
import { usePathname, useRouter } from "next/navigation";
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

  const pathname = usePathname();

  const getSession = useCallback(async () => {
    try {
      const { data } = await getCurrent();
      setUser(data);
      return data;
    } catch (error) {
      console.log(error);

      if (!publicRoutes.includes(pathname)) {
        router.push("/");
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  }, [pathname, router]);

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
