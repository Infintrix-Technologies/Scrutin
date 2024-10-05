/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssessmentsList } from "@/components/AssessmentsList";
import CreateAssessment from "@/components/CreateAssessment";
// import { CreateAssessment } from "@/components/CreateAssessment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";

type Props = {};



const Assessments = (props: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const status = searchParams.get("status") || "active";

  return (
    <div className="px-32">
      <div className="flex justify-between mt-10">
        <h1 className="text-3xl font-bold">Assessments</h1>
        <CreateAssessment/>
      </div>

      <div className="my-3">
        <div className="flex justify-between items-center">
          <Input placeholder="Search" className="w-48" />
          <div>
            <Button
              variant={status === "active" ? "default" : "outline"}
              onClick={() => {
                searchParams.set("status", "active");
                setSearchParams(searchParams);
              }}
            >
              Active
            </Button>

            <Button
              variant={status === "inactive" ? "default" : "outline"}
              onClick={() => {
                searchParams.set("status", "inactive");
                setSearchParams(searchParams);
              }}
            >
              Inactive
            </Button>
          </div>
        </div>
      </div>

      <AssessmentsList />
    </div>
  );
};

export default Assessments;
