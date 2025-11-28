"use client";

import { ThemeProvider } from "next-themes";
import { SidebarProvider, SidebarTrigger } from "../../_components/ui/sidebar";
import AppSidebar from "../../_components/app-sidebar";
import { QueryProvider } from "../../_components/_utils/query-provider";

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <QueryProvider>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <SidebarProvider>
            <AppSidebar />
            <main>
              <SidebarTrigger />
              {children}
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </QueryProvider>
    </>
  );
}
