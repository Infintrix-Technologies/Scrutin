// import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import TestProgress from "./TestProgress";
import { Button } from "./ui/button";
import { useGlobalState } from "@/utils/StateProvider";

const CandidacyNavbar = () => {
  // const location = useLocation();
  const {candidate_id} = useParams()

  const { updateCurrentQuestion } = useGlobalState();

  // const handleNext = () => {
  //   setTriggerReload((prev) => !prev);
  // };

  return (
    <div className="w-full py-2 flex justify-around items-center">
      <div className="text-xl">Infintrix Technologies</div>
      {/* {location?.pathname?.includes("/test/") && ( */}
        <>
          <TestProgress />
          <Button onClick={()=>updateCurrentQuestion(candidate_id)}>Next</Button>
        </>
      {/* )}  */}
    </div>
  );
};

export default CandidacyNavbar;

