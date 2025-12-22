import Image from "next/image";
import { useUser } from "../_viewmodels/use-user";
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
  PlusIcon,
  SettingsIcon,
  SunIcon,
  UserIcon,
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { rooms, getOrCreateDm } from "../_service/rooms-service";
import { useDataContext } from "./_utils/data-context";
import { useFriendship } from "../_viewmodels/use-friendship";
import { Friendships } from "../_service/friendship-service";

const AppSidebar = () => {
  const { user, isLoading } = useUser();
  const {
    rooms,
    isLoading: isLoadingRooms,
    refetchRooms,
    roomDelete,
    createNewRoom,
    dms,
    isLoadingDms,
  } = useRooms();

  const { friendships, isLoading: isLoadingFriendships } = useFriendship();

  const { roomId, setRoomId } = useDataContext();

  const { theme, setTheme } = useTheme();

  if (isLoading || isLoadingFriendships) return <>Carregando...</>;
  if (!user) return <>Usuário nao autenticado</>;

  if (isLoadingRooms) return <>Carregando salas...</>;

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
                  <div className="rounded-full overflow-hidden bg-white">
                    <UserIcon className="w-10 h-10  text-accent" />
                  </div>
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
                    <UserIcon className="w-4 h-4 mr-2" />
                    <p>Perfil</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {theme === "light" ? (
                      <div
                        onClick={() => setTheme("dark")}
                        className="p-0 flex gap-2"
                      >
                        <MoonIcon className="w-4 h-4 mr-2" />
                        <p>Tema Escuro</p>
                      </div>
                    ) : (
                      <div
                        onClick={() => setTheme("light")}
                        className="p-0 flex gap-2"
                      >
                        <SunIcon className="w-4 h-4 mr-2" />
                        <p>Tema Claro</p>
                      </div>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    <p>Configurações</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <LogOutIcon className="w-4 h-4 mr-2 text-destructive" />
                    <p>Logout</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <div className="flex justify-between items-center">
              <SidebarGroupLabel className="text-lg">Salas</SidebarGroupLabel>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="p-0">
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Novo Chat</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();

                      const form = e.currentTarget;
                      const formData = new FormData(form);

                      const roomName = formData.get("roomName") as string;
                      if (!roomName || roomName.trim() === "") {
                        alert("Nome obrigatório");
                        return;
                      }

                      createNewRoom.mutate(roomName);

                      form.reset();
                    }}
                    className="flex flex-col gap-2 items-end"
                  >
                    <Input
                      placeholder="Nome da sala"
                      id="name"
                      required
                      name="roomName"
                    />
                    <div className="flex justify-end gap-2 max-w-full">
                      <DialogClose asChild>
                        <Button
                          type="reset"
                          variant="outline"
                          className="w-full"
                        >
                          Cancelar
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button type="submit" className="w-full">
                          Criar
                        </Button>
                      </DialogClose>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <SidebarMenu className="">
              {rooms!.map((room: rooms) => (
                <SidebarMenuItem key={room.id} className="pl-2 py-2">
                  <SidebarMenuButton
                    className="pl-4 flex justify-between"
                    onClick={() => {
                      if (roomId === room.id) return; // evita atualizações redundantes
                      setRoomId(room.id);
                    }}
                  >
                    # {room.name}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <EllipsisVerticalIcon className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="">
                        <DropdownMenuItem className="text-destructive">
                          <p>Sair da Sala</p>
                        </DropdownMenuItem>
                        {user.id === room.creator_id && (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              roomDelete.mutate(room.id);
                              refetchRooms();
                            }}
                          >
                            <p>Deletar Sala</p>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <div className="flex justify-between items-center">
              <SidebarGroupLabel className="text-lg">Amigos</SidebarGroupLabel>
            </div>
            <SidebarMenu className="gap-2">
              {friendships!.map((friend: Friendships) => (
                <SidebarMenuItem key={friend.friend_id} className="pl-2">
                  <SidebarMenuButton
                    className="px-2 py-6 flex gap-2"
                    onClick={async () => {
                      try {
                        const room = await getOrCreateDm(friend.friend_id);
                        if (roomId === room.id) return; // evita loop se já estiver na mesma sala
                        setRoomId(room.id);
                        refetchRooms();
                      } catch (err) {
                        console.error("Erro ao abrir DM", err);
                        alert("Erro ao abrir conversa direta");
                      }
                    }}
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={friend.avatar_url}
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    {friend.username}
                  </SidebarMenuButton>
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
