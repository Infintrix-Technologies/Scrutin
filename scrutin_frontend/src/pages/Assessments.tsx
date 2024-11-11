/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssessmentsList } from "@/pages/AssessmentsList";
import CreateAssessment from "@/components/CreateAssessment";
// import { CreateAssessment } from "@/components/CreateAssessment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import {  useFrappeDeleteDoc } from "frappe-react-sdk";

type Props = {};




const Assessments = (props: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // const delete_api = useFrappeDeleteDoc()


  

  const status = searchParams.get("status") || "active";

  return (
    <div className="px-32">
      {/* <Button onClick={()=>{
        delete_api.deleteDoc('Scrutin Assessment', '0b1bdsk5tu')
      }}>Delete</Button> */}
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
