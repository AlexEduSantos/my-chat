import Image from "next/image";
import { useUser } from "../_viewmodels/use-user";
import ThemeSwitcher from "./theme-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import {
  EllipsisVerticalIcon,
  LogOutIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRooms } from "../_viewmodels/use-rooms";
import { useTheme } from "next-themes";

const AppSidebar = () => {
  const { user, isLoading } = useUser();
  const { rooms, isLoading: isLoadingRooms } = useRooms();
  const { theme, setTheme } = useTheme();

  if (isLoading) return <>Carregando...</>;
  if (!user) return <>Usuário nao autenticado</>;

  if (isLoadingRooms) return <>Carregando salas...</>;
  console.log(rooms);

  return (
    <>
      <Sidebar className="">
        <SidebarHeader className="border-b border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem className="flex justify-between items-center p-2">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon">
                    <EllipsisVerticalIcon className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    <p>Settings</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {theme === "light" ? (
                      <div onClick={() => setTheme("dark")} className="p-0 flex gap-2">
                        <MoonIcon className="w-4 h-4 mr-2" />
                        <p>Tema Escuro</p>
                      </div>
                    ) : (
                      <div onClick={() => setTheme("light")} className="p-0 flex gap-2">
                        <SunIcon className="w-4 h-4 mr-2" />
                        <p>Tema Claro</p>
                      </div>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOutIcon className="w-4 h-4 mr-2" />
                    <p>Logout</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-lg">Salas</SidebarGroupLabel>
            <SidebarMenu className="">
              {rooms!.map((room) => (
                <SidebarMenuItem key={room.id} className="p-2">
                  <SidebarMenuButton className="px-4">
                    #{room.room_name}
                  </SidebarMenuButton>{" "}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="w-full flex items-end p-2"></SidebarFooter>
      </Sidebar>
    </>
  );
};

export default AppSidebar;
