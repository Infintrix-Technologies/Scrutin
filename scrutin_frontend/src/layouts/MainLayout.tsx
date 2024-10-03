import { UserProvider } from "@/utils/auth/UserProvider";
import { Link, Outlet } from "react-router-dom";

const MainLayout = () => {

  
  return (
    <div>
      <nav className="flex bg-pink-700 p-4 text-white">
        <Link to={"/"} className="logo font-bold mr-4">
          Scrutin
        </Link>
        <ul className="flex justify-between list-none gap-5">
          <Link className="hover:bg-black cursor-pointer" to={"/assessments"}>
            <li>Assessments</li>
          </Link>
          <Link className="hover:bg-black cursor-pointer" to={"/candidates"}>
            <li>Candidates</li>
          </Link>
          <Link className="hover:bg-black cursor-pointer" to={"/jobs"}>
            <li>Jobs</li>
          </Link>
        </ul>
      </nav>

      <UserProvider>
        <Outlet />
      </UserProvider>
    </div>
  );
};

export default MainLayout;
