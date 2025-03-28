"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { MissingPersonsProvider } from "@/components/providers/MissingPersonsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MissingPersonsProvider>{children}</MissingPersonsProvider>
    </ThemeProvider>
  );
}
