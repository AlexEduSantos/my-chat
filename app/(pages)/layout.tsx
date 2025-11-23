"use client";

import { ThemeProvider } from "next-themes";
import { SidebarProvider, SidebarTrigger } from "../_components/ui/sidebar";
import AppSidebar from "../_components/app-sidebar";

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <SidebarProvider>
          <AppSidebar />
          <main>
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </>
  );
}
