/* eslint-disable @typescript-eslint/no-explicit-any */
import { FrappeProvider } from "frappe-react-sdk";
import { RouterProvider } from "react-router-dom";

import '@/App.css'

import { GlobalStateProvider } from "@/utils/StateProvider";
import { ThemeProvider } from "@/utils/ThemeProvider";
import { router } from "./Routes";
import { getSiteName, localStorageProvider } from "./utils";



function App() {

  
  return (
    <div className="App font-montserrat">
      <FrappeProvider
      url={import.meta.env.VITE_FRAPPE_PATH ?? ''}
      socketPort={import.meta.env.VITE_SOCKET_PORT ? import.meta.env.VITE_SOCKET_PORT : undefined}
      swrConfig={{
        provider: localStorageProvider
      }}
      siteName={getSiteName()}
      >
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <GlobalStateProvider>
        <RouterProvider router={router} />
        </GlobalStateProvider>
        </ThemeProvider>
      </FrappeProvider>
    </div>
  );
}

export default App;
