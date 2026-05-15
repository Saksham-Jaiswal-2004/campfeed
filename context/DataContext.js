import { createContext, useContext, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {

  const [eventsCache, setEventsCache] = useState([]);

  return (
    <DataContext.Provider value={{
      eventsCache,
      setEventsCache
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);