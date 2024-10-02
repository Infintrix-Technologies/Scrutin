import { FrappeProvider } from "frappe-react-sdk";
import {
  Outlet,
  RouterProvider,
  Link,
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import Login from "./pages/auth/Login";
import Assessments from "./pages/Assessments";
import Candidates from "./pages/Candidates";
import Jobs from "./pages/Jobs";

const rootRoute = createRootRoute({
  component: () => (
    <>
       <nav className="flex bg-pink-700 p-4 text-white">

<Link to={"/"} className="logo font-bold mr-4">
  Scrutin
</Link>
<ul className="flex justify-between list-none gap-10">
  <Link className="hover:bg-black cursor-pointer" to={"/assessments"}><li>Assessments</li></Link>
  <Link className="hover:bg-black cursor-pointer" to={"/candidates"}><li>Candidates</li></Link>
  <Link className="hover:bg-black cursor-pointer" to={"/jobs"}><li>Jobs</li></Link>

</ul>
</nav>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component:Login,
})

const assessmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/assessments',
  component: Assessments,
})
const candidatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/candidates',
  component: Candidates,
})
const jobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs',
  component: Jobs,
})
const routeTree = rootRoute.addChildren([loginRoute, assessmentsRoute,candidatesRoute, jobsRoute])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <>
//       <Route path='/login' Component={React.lazy(() => import('@/pages/auth/Login'))} />
//       <Route path='/register' Component={React.lazy(() => import('@/pages/auth/Register'))} />

//       {/* <Route path='/login-with-email' lazy={() => import('@/pages/auth/LoginWithEmail')} />
//       <Route path='/signup' lazy={() => import('@/pages/auth/SignUp')} />
//       <Route path='/forgot-password' lazy={() => import('@/pages/auth/ForgotPassword')} /> */}
//       <Route path="/" element={<ProtectedRoute />} errorElement={<>Not found</>}>
//         <Route path='' Component={React.lazy(() => import('@/pages/Home'))} />
//         <Route path='assessments' Component={React.lazy(() => import('@/pages/Assessments'))} />
//         <Route path='candidates' Component={React.lazy(() => import('@/pages/Candidates'))} />
//       </Route>
//     </>
//   ), {
//   basename: `/${import.meta.env.VITE_BASE_NAME}` ?? '',
// }
// )
function App() {
  //   const [count, setCount] = useState(0)

  return (
    <div className="App">
      <FrappeProvider>
      <RouterProvider router={router} />
      </FrappeProvider>
    </div>
  );
}

export default App;
