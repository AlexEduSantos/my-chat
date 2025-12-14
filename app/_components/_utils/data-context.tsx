import { createContext, useContext, useState } from "react";

interface DataContextProps {
  roomName: any;
  setRoomName: (data: any) => void;
}

const DataContext = createContext<DataContextProps>({
  roomName: "Geral",
  setRoomName: () => {},
});

export const DataContextProvider = ({ children }: any) => {
  const [roomName, setRoomName] = useState("Geral");
  return (
    <DataContext.Provider value={{ roomName, setRoomName }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error(
      "useDataContext must be used within a DataContextProvider."
    );
  }
  return context;
};
