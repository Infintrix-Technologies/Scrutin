// import Navbar from "@/components/Navbar";
import { UserProvider } from "@/utils/auth/UserProvider";
import { Outlet } from "react-router-dom";

const CandidateLayout = () => {
  return (
    <>
      <UserProvider>
        {/* <Navbar /> */}
        <Outlet />
      </UserProvider>
    </>
  );
};

export default CandidateLayout;
