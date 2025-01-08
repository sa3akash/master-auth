"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { mfaOff } from "@/lib/api";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-provider";

const RevokeMfa = () => {
  const [isPending, setIsPending] = useState(false);

  const { toast } = useToast();

  const { user, setUser } = useAuth();

  const handleClick = async () => {
    setIsPending(true);
    try {
      const { data } = await mfaOff();
      // refetch()
      toast({
        variant: "default",
        title: data.message,
      });

      if (user) {
        setUser({
          ...user,
          userPreferences: {
            enable2FA: false,
            emailNotification: user?.userPreferences
              .emailNotification as boolean,
            twoFactorSecret: user?.userPreferences.twoFactorSecret as string,
          },
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          variant: "destructive",
          title: error.response?.data.message,
        });
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      disabled={isPending}
      className="h-[35px] !text-[#c40006d3] !bg-red-100 shadow-none mr-1"
      onClick={handleClick}
    >
      {isPending && <Loader className="animate-spin" />}
      Revoke Access
    </Button>
  );
};

export default RevokeMfa;
