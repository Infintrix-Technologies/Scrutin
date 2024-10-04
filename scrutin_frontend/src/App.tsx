import { FrappeProvider } from "frappe-react-sdk";
import Login from "./pages/auth/Login";
import Assessments from "./pages/Assessments";
import Candidates from "./pages/Candidates";
import Jobs from "./pages/Jobs";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Cookies from 'js-cookie'
import { GlobalStateProvider } from "./utils/StateProvider";
const NO_CACHE_KEYS = [
  "frappe.desk.form.load.getdoctype",
  "frappe.desk.search.search_link",
  "frappe.model.workflow.get_transitions",
  "frappe.desk.reportview.get_count"
]

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    // loader: rootLoader,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "assessments",
        element: <Assessments />,
      },
      {
        path: "candidates",
        element: <Candidates />,
      },
      {
        path: "jobs",
        element: <Jobs />,
      },
    ],
  },
],{
   basename: `/${import.meta.env.VITE_BASE_NAME}` ?? ''
});
function App() {

  function localStorageProvider() {
    // When initializing, we restore the data from `localStorage` into a map.
    // Check if local storage is recent (less than a week). Else start with a fresh cache.
    const timestamp = localStorage.getItem('app-cache-timestamp')
    let cache = '[]'
    if (timestamp && Date.now() - parseInt(timestamp) < 7 * 24 * 60 * 60 * 1000) {
      const localCache = localStorage.getItem('app-cache')
      if (localCache) {
        cache = localCache
      }
    }
    const map = new Map<string, any>(JSON.parse(cache))
  
    // Before unloading the app, we write back all the data into `localStorage`.
    window.addEventListener('beforeunload', () => {
  
  
      // Check if the user is logged in
      const user_id = Cookies.get('user_id')
      if (!user_id || user_id === 'Guest') {
        localStorage.removeItem('app-cache')
        localStorage.removeItem('app-cache-timestamp')
      } else {
        const entries = map.entries()
  
        const cacheEntries = []
  
        for (const [key, value] of entries) {
  
          let hasCacheKey = false
          for (const cacheKey of NO_CACHE_KEYS) {
            if (key.includes(cacheKey)) {
              hasCacheKey = true
              break
            }
          }
  
          //Do not cache doctype meta and search link
          if (hasCacheKey) {
            continue
          }
          cacheEntries.push([key, value])
        }
        const appCache = JSON.stringify(cacheEntries)
        localStorage.setItem('app-cache', appCache)
        localStorage.setItem('app-cache-timestamp', Date.now().toString())
      }
  
    })
  
    // We still use the map for write & read for performance.
    return map
  }
  const getSiteName = () => {
    // @ts-ignore
    if (window.frappe?.boot?.versions?.frappe && (window.frappe.boot.versions.frappe.startsWith('15') || window.frappe.boot.versions.frappe.startsWith('16'))) {
      // @ts-ignore
      return window.frappe?.boot?.sitename ?? import.meta.env.VITE_SITE_NAME
    }
    return import.meta.env.VITE_SITE_NAME

  }
  return (
    <div className="App">
      <FrappeProvider
      url={import.meta.env.VITE_FRAPPE_PATH ?? ''}
      socketPort={import.meta.env.VITE_SOCKET_PORT ? import.meta.env.VITE_SOCKET_PORT : undefined}
      //@ts-ignore
      swrConfig={{
        provider: localStorageProvider
      }}
      siteName={getSiteName()}
      >
        <GlobalStateProvider>
        <RouterProvider router={router} />
        </GlobalStateProvider>
      </FrappeProvider>
    </div>
  );
}

export default App;
