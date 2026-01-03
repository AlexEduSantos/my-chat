"use client";
import { Button } from "@/app/_components/ui/button";
import { DialogClose, DialogFooter } from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { useUser } from "@/app/_viewmodels/use-user";
import { ImagePlusIcon, RefreshCcw } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const ProfilePortal = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  console.log(user);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="grid grid-cols-3 gap-4 items-center">
        <div className="relative w-full flex justify-center items-center aspect-square rounded-full overflow-hidden row-span-2">
          <Label
            htmlFor="avatar-upload"
            className={`relative w-full aspect-square rounded-full overflow-hidden shadow group ${
              isEditing
                ? "hover:ring-2 hover:ring-primary/50 cursor-pointer"
                : ""
            }`}
          >
            <Image
              src={user?.avatar as string}
              alt={user?.username as string}
              fill
              className="object-cover "
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {user?.avatar ? (
                  <>
                  <RefreshCcw className="text-white w-6 h-6" />
                  </>
                ) : (
                  <>
                    <ImagePlusIcon className="text-white w-6 h-6" />
                  </>
                )}
              </div>
            )}
          </Label>
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            disabled={!isEditing}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const previewUrl = URL.createObjectURL(file);
            }}
          />
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username-1">Username</Label>
            <Input
              id="username-1"
              name="username"
              disabled={!isEditing}
              defaultValue={user?.username as string}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name-1">Email</Label>
            <Input
              id="name-1"
              name="email"
              defaultValue={user?.email}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <div className="flex gap-2 col-span-2">
          {isEditing && (
            <DialogClose asChild>
              <Button type="submit" disabled={isLoading} variant={"secondary"}>
                Salvar
              </Button>
            </DialogClose>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? "Cancelar" : "Editar"}
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
};

export default ProfilePortal;
