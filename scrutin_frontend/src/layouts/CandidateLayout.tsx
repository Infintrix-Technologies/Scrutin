// import Navbar from "@/components/Navbar";
import { UserProvider } from "@/utils/auth/UserProvider";
// import { useEffect } from "react";
import { Outlet } from "react-router-dom";
// import { FullScreen, useFullScreenHandle } from "react-full-screen";
const CandidateLayout = () => {
  // const handle = useFullScreenHandle();


  const layout = (
    <UserProvider>
    
        {/* <div className="h-screen flex flex-col justify-between items-center"> */}
          {/* <div className="h-max"> */}
            <Outlet />
          {/* </div>
          <>
            <div className="flex flex-col justify-center items-center">
              <div className="text-center text-sm text-gray-500">
                <small>Powered by</small>
              </div>
              <Logo />
            </div>
          </>
        </div> */}
      </UserProvider>
  )
  return (
    <>
     {layout}
      
    </>
  );
};

export default CandidateLayout;
