import Navbar from "@/components/Navbar";
import { UserProvider } from "@/utils/auth/UserProvider";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <UserProvider>
        <Navbar />
        <Outlet />
      </UserProvider>
    </>
  );
};

export default AdminLayout;
