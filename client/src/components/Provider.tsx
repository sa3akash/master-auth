import React, { PropsWithChildren } from "react";
import { ThemeProvider } from "./theme-provider";

const Provider = ({ children }: PropsWithChildren) => {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </>
  );
};

export default Provider;
