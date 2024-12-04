import { useLocation } from "react-router-dom";
import TestProgress from "./TestProgress";
import { Button } from "./ui/button";

const CandidacyNavbar = () => {
  const location = useLocation();

  return (
    <div className="w-full py-2 flex justify-around items-center">
      <div className="text-xl">Infintrix Technologies</div>
      {location?.pathname?.includes("/test/") && (
        <>
          <TestProgress />
          <Button >Next</Button>
        </>
      )}
    </div>
  );
};

export default CandidacyNavbar;

