import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";

const SettingsPortal = () => {
  return (
    <>
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>
        <TabsContent value="geral">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="notifications">
          Manage notifications here.
        </TabsContent>
        <TabsContent value="security">Change your password here.</TabsContent>
      </Tabs>
    </>
  );
};

export default SettingsPortal;
