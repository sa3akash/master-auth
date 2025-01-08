"use client";

import React from "react";
import {
  EllipsisIcon,
  Home,
  Loader2,
  Lock,
  LogOut,
  MoonStarIcon,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroupContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Logo from "@/components/logo";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/auth-provider";
import { logOutUser } from "@/lib/api";
import { useRouter } from "next/navigation";

const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Sessions",
    url: "/sessions",
    icon: Lock,
  },
  {
    title: "Account",
    url: "#",
    icon: User,
  },

  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

const Asidebar = () => {
  const { open } = useSidebar();

  const { setTheme, theme } = useTheme();

  const { user, isLoading } = useAuth();

  const router = useRouter()

  const handleLogout = () => {
    logOutUser()
    // window.location.replace('/')
    router.push('/')
    router.refresh()
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="!pt-0 dark:bg-background">
        <div className="flex h-[60px] items-center">
          <Logo fontSize="20px" size="30px" url="/home" />
          {open && (
            <Link
              href="/home"
              className="hidden md:flex ml-2 text-xl tracking-[-0.16px] text-black dark:text-[#fcfdffef] font-bold mb-0"
            >
              Squeezy
            </Link>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="dark:bg-background">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="!text-[15px]">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="dark:bg-background">
        <SidebarMenu>
          <SidebarMenuItem>
            {!isLoading ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg uppercase">
                        {`${user?.name.slice(0,2)}`}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name}
                      </span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                    <EllipsisIcon className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side={"bottom"}
                  align="start"
                  sideOffset={4}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => {
                        if (theme) {
                          setTheme(theme === "light" ? "dark" : "light");
                        } else {
                          setTheme("dark");
                        }
                      }}
                    >
                      <MoonStarIcon />
                      Toggle theme
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="py-4 w-full flex justify-center">
                <Loader2 className="animate-spin" />
              </div>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default Asidebar;
