import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import ProfilePortal from "./components/profile-test";
import { User2Icon } from "lucide-react";
import { Button } from "@/app/_components/ui/button";

const PageTest = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button variant="outline">
              <User2Icon />
              <p>Profile</p>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Perfil</DialogTitle>
            </DialogHeader>
            <ProfilePortal />
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default PageTest;
