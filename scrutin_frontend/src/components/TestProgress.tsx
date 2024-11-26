import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Timer, HelpCircle } from "lucide-react";
import { useFrappeGetCall } from "frappe-react-sdk";
import { useSearchParams } from "react-router-dom";

export default function TestProgress() {
  const [searchParams] = useSearchParams();
  const questionIndex = parseInt(searchParams.get("question") || "1", 10);

  const { data } = useFrappeGetCall("scrutin.api.assessment_data.get_specific_test_details", {
    test_id: "k887uj90a1",
  });

  const specific_test_details = data?.message || {};
  const totalDuration = specific_test_details?.total_duration || 0;
  const totalQuestions = specific_test_details?.total_questions || 0;

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
            <span className="text-sm font-medium">{questionIndex}/{totalQuestions}</span>
          </div>
          <Progress value={questionProgress} className="w-1/2" color="blue" />
        </div>
      </div>
    </div>
  );
}
