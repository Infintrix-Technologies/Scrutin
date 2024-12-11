import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Timer, HelpCircle } from "lucide-react";
import { useFrappeGetCall } from "frappe-react-sdk";
import { useParams, useSearchParams } from "react-router-dom";

export default function TestProgress() {
  const [searchParams] = useSearchParams();
  const {candidate_id} = useParams()

  const questionIndex = parseInt(searchParams.get("question") || "1", 10);

  // const { data } = useFrappeGetCall("scrutin.api.assessment_data.get_specific_test_details", {
  //   test_id: "f3988t64af",
  // });

  const {data:test_progress} = useFrappeGetCall("scrutin.api.test_duration.get_candidate_test_progress_for_test_page",{
    candidate_id: candidate_id ,
  })
  const candidate_test_progress_query = test_progress?.message || {};
  console.log(candidate_test_progress_query,"candidate_test_progress_query")
  console.log(test_progress,"test_progress")
  const specific_test_details = test_progress?.message || {};
  const totalDuration = specific_test_details[0]?.total_duration || 0;
  const totalQuestions = specific_test_details[0]?.total_questions || 0;

  const [timeLeft, setTimeLeft] = useState(totalDuration);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime:number) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [totalDuration]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const timeProgress = totalDuration ? (timeLeft / totalDuration) * 100 : 0;
  const questionProgress = totalQuestions ? (questionIndex / totalQuestions) * 100 : 0;

  return (
    <div className="w-full max-w-sm">
      <div className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Timer className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium" data-testid="candidate.assessment.timer-progress-bar">
              {formatTime(timeLeft)}
            </span>
          </div>
          <Progress value={timeProgress} className="w-1/2" color="blue" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{candidate_test_progress_query[0]?.show_question}/{candidate_test_progress_query[0]?.total_questions}</span>
          </div>
          <Progress value={questionProgress} className="w-1/2" color="blue" />
        </div>
      </div>
    </div>
  );
}
