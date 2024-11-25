import { OverViewPage } from "@/components/Interfaces/Interface"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useFrappeGetCall} from "frappe-react-sdk"
import { CheckIcon, ChevronRightIcon, EyeIcon } from "lucide-react"
import { Link, useParams } from "react-router-dom"

export default function AssessmentOverview() {

  const params = useParams();
  const candidate_id = params?.candidate_id || null;

  const get_specific_assessment_tests = useFrappeGetCall( "scrutin.api.assessment_data.get_specific_assessment_tests",
    { assessment_name: candidate_id }
  );
  const specific_assessment_tests = get_specific_assessment_tests?.data?.message || [];
  console.log(specific_assessment_tests, "specific_assessment_tests");

  return (
    <div className="px-4 sm:px-8 lg:px-32 xl:px-64">
      <Card className="w-full">
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4">
            Hello Abdul! Ready to showcase your skills?
          </h2>
          <p className="mb-2 text-sm sm:text-base">
            Thank you for applying for this role and welcome to your skill assessment administered by TestGorilla.
          </p>
          <p className="mb-6 text-sm sm:text-base">
            Completing it will give you a chance to show off your skills and stand out from the crowd! Good luck!
          </p>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">This assessment includes the following steps:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 lg:mt-4">
              {specific_assessment_tests?.tests?.map((data: OverViewPage) => (
                <div className="flex flex-col items-center text-center space-y-2" key={data?.id}>
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <CheckIcon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">{data?.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {data?.total_questions}{data?.total_questions == 1 ? " Question " : " Questions "}  •{" "}
                      {data?.total_duration < 60
                        ? `${data.total_duration} seconds`
                        : `${Math?.floor(data?.total_duration / 60)} min${
                            data?.total_duration % 60 > 0 ? ` ${data?.total_duration % 60} sec` : ""
                          }`}                          
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-8 h-8 rounded-full cursor-pointer bg-primary flex items-center justify-center">
                <CheckIcon className="w-5 h-5 text-primary-foreground" />
                </div>
                
                <div>
                  <p className="font-semibold">Custom Questions</p>
                  <p className="text-sm text-muted-foreground">{specific_assessment_tests?.custom_questions}</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-8 h-8 rounded-full cursor-pointer bg-secondary flex items-center justify-center">
                  <EyeIcon className="w-5 h-5 text-secondary-foreground" />
                </div>
                
                <div>
                  <p className="font-semibold">View results</p>
                  <p className="text-sm text-muted-foreground">Custom questions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-8">
            <div className="w-full">
              <h3 className="font-semibold mb-2">Learn how to navigate your assessment:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  We recommend <strong>completing the assessment in one go</strong> but you can{" "}
                  <strong>pause or take breaks between tests</strong> if needed.
                </li>
                <li>The <strong>assessment is timed</strong>. A timer is shown per test and/or per question.</li>
                <li>
                  You can use pen, paper, and calculator during the assessment but avoid using AI and other tools.
                </li>
              </ul>
            </div>
            <div className="w-full">
              <h3 className="font-semibold mb-2">Technical requirements for your assessment:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Have a <strong>camera and microphone</strong> as you may be required to answer questions in a video
                  format.
                </li>
                <li>Enable webcam and speakers/headphones for identity verification and test integrity.</li>
                <li>
                  <strong>Snapshots will be taken</strong> of you periodically during the assessment to ensure fairness
                  for everyone.
                </li>
                <li>
                  Ensure you have a <strong>reliable internet connection</strong> to avoid any disruptions during your
                  assessment.
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Link to={`/candidacy/${candidate_id}/setup`}>
              <Button className="text-end flex items-center">
                Next
                <ChevronRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}