/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Timer, HelpCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGlobalState } from "@/utils/StateProvider";
import { useNavigate } from "react-router-dom";
import { useFrappePostCall } from "frappe-react-sdk";

export default function TestProgress() {
  const navigate = useNavigate(); 
  const { candidate_id } = useParams();
  const { updateCurrentQuestion, question } = useGlobalState();
  const mark_test_completed  = useFrappePostCall("scrutin.api.candidate_test.mark_test_completed");

  const candidate_test_progress_query = question?.message?.test || [];
  const specific_test_details = candidate_test_progress_query || {};
  const totalDuration = specific_test_details?.total_duration ;
  const remainingTime = Math.round(specific_test_details?.remaining_time );
  const totalQuestions = specific_test_details?.total_no_of_question ;

  const [timeLeft, setTimeLeft] = useState(remainingTime);

  useEffect(() => {
    updateCurrentQuestion(candidate_id);
}, [candidate_id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime:number) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [totalDuration]);

  // Sync the timer with latest remaining time
  useEffect(() => {
    if (remainingTime > 0) {
      setTimeLeft(remainingTime);
    }
  }, [remainingTime]);

  useEffect(() => {
    if (timeLeft == 1) {
      // mark_test_completed.call({
      //   candidate_id,
      //   test_id: question?.message?.test?.test?.test_id,
      // });
      navigate(`/candidacy/${candidate_id}/overview`);
    }
    
  }, [mark_test_completed,timeLeft, candidate_id, navigate,question]);


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };
  const timeProgress = totalDuration ? (timeLeft / totalDuration) * 100 : 0;
  const questionProgress = totalQuestions ? (specific_test_details.show_no_of_test_question / totalQuestions) * 100 : 0;

  return (
    <div className="w-full max-w-sm">
      <div className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Timer className="h-4 w-4 text-primary" />
            <span
              className="text-sm font-medium"
              data-testid="candidate.assessment.timer-progress-bar"
            >
              {formatTime(timeLeft)}
            </span>
          </div>
          <Progress value={timeProgress} className="w-1/2" color="blue" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {specific_test_details.show_no_of_test_question }/{totalQuestions }
            </span>
          </div>
          <Progress value={questionProgress} className="w-1/2" color="blue" />
        </div>
      </div>
    </div>
  );
}
