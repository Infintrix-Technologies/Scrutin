import { Button } from "@/components/ui/button";
import { useFrappeDeleteDoc, useFrappeGetCall, useFrappeGetDoc, useFrappeGetDocList, useFrappePostCall } from "frappe-react-sdk";


const CandidateDashboard = () => {

const getCandidatesOfSpecificUser = useFrappeGetCall("scrutin.api.user.get_user_candidates");
console.log(getCandidatesOfSpecificUser, "getCandidatesOfSpecificUser");


// const session_user = useFrappeGetCall("scrutin.api.user.get_logged_user");
// console.log(session_user);


const assessment_tests = useFrappeGetCall("scrutin.api.user.get_assessment_test");
console.log(assessment_tests);

// const update_candidate = useFrappePostCall("scrutin.api.candidate.update_candidate");
// console.log(update_candidate);

// const update_applicant = useFrappePostCall("scrutin.api.candidate.update_job_applicant_status");
// console.log(update_applicant);


const get_specific_assessments = useFrappeGetCall("scrutin.api.assessment_data.get_specific_assessments")
console.log(get_specific_assessments, "get_specific_assessments");

//this api give specific Assessment all details 
const assessment_tessts = useFrappeGetCall("scrutin.api.assessment_data.get_assessment_test_custom_question")
console.log(assessment_tessts, "assessment_tessts");

//this api give job_title of specific Job Applicant
const get_applicant_jobtitle = useFrappeGetCall("scrutin.api.assessment_data.get_applicant_jobtitle")
console.log(get_applicant_jobtitle, "get_applicant_jobtitle");

//this api give the name of job_applicant_name and assessment_name for Candidate
const get_candidate_details = useFrappeGetCall("scrutin.api.assessment_data.get_applicant_name_assessment_name_for_candidate")
console.log(get_candidate_details, "get_candidate_details");


//this api will provide the specific assessment candidate and candidate name fetch from applicant_name
const get_specific_assessment_candidate_name = useFrappePostCall("scrutin.api.assessment_data.get_specific_assessment_candidate_name")

// get the all test for the specific assessment
const get_tests_for_assessment = useFrappePostCall("scrutin.api.assessment_data.get_tests_for_assessment")


//get the all custom question for the specific assessment
const get_custom_questions_for_assessment = useFrappePostCall("scrutin.api.assessment_data.get_custom_questions_for_assessment")




const specific_assessment_candidates = useFrappePostCall("scrutin.api.assessment_data.specific_assessment_candidates")
// console.log(specific_assessment_candidates, "specific_assessment_candidates");


  return (
    <div>CandidateDashboard


<Button onClick={() => {
        specific_assessment_candidates.call({
          assessmnt: 'vk1m38vch1',
        });
      }}>
        Update Job Applicant
      </Button>

      <Button onClick={() => {
        get_specific_assessment_candidate_name.call({
          assessmnt: '0b1bdsk5tu',
        });
      }}>
        Assessment Candidate Name
      </Button>

      <Button onClick={() => {
        get_tests_for_assessment.call({
          assessment_name: '0b1bdsk5tu',
        });
      }}>
        Assessment Test
      </Button>

      <Button onClick={() => {
        get_custom_questions_for_assessment.call({
          assessment_name: '0b1bdsk5tu',
        });
      }}>
        Assessment Custom Question
      </Button>

{/* <Button onClick={() => {
        update_applicant.call({
          // assessment: 'vk1m38vch1',
          job_applicant: 'bilal123@gmail.com'
        });
      }}>
        Update Job Applicant
      </Button> */}

      {/* <Button onClick={() => {
        update_candidate.call({
          assessment: 'pfn2mphqjf',
          // job_applicant: 'bilal123@gmail.com'
        });
      }}>
        Update Scrutin Candidate
      </Button> */}
    </div>
    
  )
}

export default CandidateDashboard