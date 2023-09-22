import { Viewport } from "gdxts";
import { createContext, useContext } from "react";

const ViewportContext = createContext<Viewport | undefined>(undefined);

export const ViewportProvider = ViewportContext.Provider;
export const useViewport = () => {
  const context = useContext(ViewportContext);
  return context;
};
