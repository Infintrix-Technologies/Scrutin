/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Timer, HelpCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGlobalState } from "@/utils/StateProvider";

export default function TestProgress() {
  const { candidate_id } = useParams();
  const { time_questions, updateQuestionAndTime } = useGlobalState();

  console.log(time_questions, "time_questions");

  const candidate_test_progress_query = time_questions?.message || [];
  const specific_test_details = candidate_test_progress_query[0] || {};
  const totalDuration = specific_test_details?.duration || 0;
  const remainingTime = Math.round(specific_test_details?.remaining_time || 0);
  const totalQuestions = specific_test_details?.total_questions || 0;

  const [timeLeft, setTimeLeft] = useState(remainingTime);

  useEffect(() => {
    updateQuestionAndTime(candidate_id);
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };
  const timeProgress = totalDuration ? (timeLeft / totalDuration) * 100 : 0;
  const questionProgress = totalQuestions ? (specific_test_details.show_question / totalQuestions) * 100 : 0;

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
              {specific_test_details.show_question || 0}/{totalQuestions || 0}
            </span>
          </div>
          <Progress value={questionProgress} className="w-1/2" color="blue" />
        </div>
      </div>
    </div>
  );
}
