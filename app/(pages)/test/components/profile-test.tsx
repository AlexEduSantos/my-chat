"use client";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { useUser } from "@/app/_viewmodels/use-user";
import Image from "next/image";

const ProfilePortal = () => {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  console.log(user);

  return (
    <>
      <div className="grid grid-cols-3 gap-4 items-center">
        <div className="relative w-full flex justify-center items-center aspect-square rounded-full overflow-hidden row-span-2">
          <Image
            src={user?.avatar as string}
            alt={user?.username as string}
            fill
            className="object-cover "
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="col-span-2 flex flex-col gap-2">
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input
                id="username-1"
                name="username"
                defaultValue={user?.username as string}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name-1">Email</Label>
              <Input id="name-1" name="email" defaultValue={user?.email} />
            </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </>
  );
};

export default ProfilePortal;
