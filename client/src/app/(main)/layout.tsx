"use client";
import Asidebar from "@/components/home/Asidebar";
import Header from "@/components/home/Header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <Asidebar />
      <SidebarInset>
        <main className="w-full">
          <Header />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}