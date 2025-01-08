import React, { PropsWithChildren } from "react";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "@/context/auth-provider";

const Provider = ({ children }: PropsWithChildren) => {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </>
  );
};

export default Provider;
