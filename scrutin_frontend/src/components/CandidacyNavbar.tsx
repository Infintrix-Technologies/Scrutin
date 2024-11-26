import { useLocation } from "react-router-dom";
import TestProgress from "./TestProgress";

const CandidacyNavbar = () => {
  const location = useLocation();

  return (
    <div className="w-full flex justify-around items-center">
      <div className="text-xl">Infintrix Technologies</div>
      
      {location?.pathname?.includes("/test/") && <TestProgress />}
      
      {/* <RainbowButton>Next</RainbowButton> */}
    </div>
  );
};

export default CandidacyNavbar;
