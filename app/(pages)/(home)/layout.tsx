"use client";

import { ThemeProvider } from "next-themes";
import { SidebarProvider, SidebarTrigger } from "../../_components/ui/sidebar";
import AppSidebar from "../../_components/app-sidebar";
import { QueryProvider } from "../../_components/_utils/query-provider";
import { DataContextProvider } from "@/app/_components/_utils/data-context";
import { Toaster } from "../../_components/ui/sonner";

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DataContextProvider>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <SidebarProvider>
              <AppSidebar />
              <main className="w-dvw h-dvh">
                <SidebarTrigger className="absolute" />
                {children}
              </main>
              <Toaster position="bottom-right" />
            </SidebarProvider>
          </ThemeProvider>
        </QueryProvider>
      </DataContextProvider>
    </>
  );
}
