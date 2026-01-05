import { createContext, useContext, useState } from "react";

interface DataContextProps {
  roomId: string | null;
  setRoomId: (data: string | null) => void;
}

const DataContext = createContext<DataContextProps>({
  roomId: null,
  setRoomId: () => {},
});

export const DataContextProvider = ({ children }: any) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  return (
    <DataContext.Provider value={{ roomId, setRoomId }}>
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
