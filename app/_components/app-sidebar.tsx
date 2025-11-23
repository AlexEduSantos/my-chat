import Image from "next/image";
import { useUser } from "../_viewmodels/use-user";
import ThemeSwitcher from "./theme-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { LogOutIcon, SettingsIcon } from "lucide-react";
import { Button } from "./ui/button";

const AppSidebar = () => {
  const { user, isLoading } = useUser();

  if (isLoading) return <>Carregando...</>;
  if (!user) return <>Usuário nao autenticado</>;

  console.log(user);

  return (
    <>
      <Sidebar className="">
        <SidebarHeader className="border-b border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem className="flex gap-2 items-center p-2">
              <div className="flex gap-2 items-center">
                {user.avatar?.length ? (
                  <div className="relative w-10 h-10">
                    <Image
                      alt="Avatar"
                      src={user.avatar}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  "Avatar"
                )}
                <div className="flex flex-col">
                  <h3>{user.username}</h3>
                  <p className="text-sm font-light">{user.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon-sm" className="" variant="secondary">
                  <SettingsIcon className="w-4 h-4" />
                </Button>
                <Button size="icon-sm" variant="secondary">
                  <LogOutIcon className="w-4 h-4" />
                </Button>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent></SidebarContent>
        <SidebarFooter className="w-full flex items-end p-2">
          <ThemeSwitcher />
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default AppSidebar;
