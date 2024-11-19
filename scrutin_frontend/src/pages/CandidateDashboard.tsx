/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { useFrappeGetCall, useFrappePostCall } from "frappe-react-sdk";


const CandidateDashboard = () => {

const getCandidatesOfSpecificUser = useFrappeGetCall("scrutin.api.user.get_user_candidates");
console.log(getCandidatesOfSpecificUser, "getCandidatesOfSpecificUser");


// const session_user = useFrappeGetCall("scrutin.api.user.get_logged_user");
// console.log(session_user);

// const update_candidate = useFrappePostCall("scrutin.api.candidate.update_candidate");
// console.log(update_candidate);

// const update_applicant = useFrappePostCall("scrutin.api.candidate.update_job_applicant_status");
// console.log(update_applicant);


const get_specific_assessments = useFrappeGetCall("scrutin.api.assessment_data.get_specific_assessments")
console.log(get_specific_assessments, "get_specific_assessments");


//this api give job_title of specific Job Applicant
const get_applicant_jobtitle = useFrappeGetCall("scrutin.api.assessment_data.get_applicant_jobtitle")
console.log(get_applicant_jobtitle, "get_applicant_jobtitle");

//this api give the name of job_applicant_name and assessment_name for Candidate
const get_candidate_details = useFrappeGetCall("scrutin.api.assessment_data.get_applicant_name_assessment_name_for_candidate")
console.log(get_candidate_details, "get_candidate_details");


const specific_assessment_candidates = useFrappePostCall("scrutin.api.assessment_data.specific_assessment_candidates")
// console.log(specific_assessment_candidates, "specific_assessment_candidates");

//this api will give the all question for the specific test and their total duration
const get_questions_for_test_and_total_duration = useFrappePostCall("scrutin.api.assessment_data.get_questions_for_test_and_total_duration")


//this api give the all test of specific assessment with the total dutation of invidual test
const get_assessment_data = useFrappePostCall("scrutin.api.assessment_data.get_assessment_data")



//this api will give the candidate assesment based on the job_applicant email
const get_candidate_assessment_and_assessment_tests = useFrappePostCall("scrutin.api.assessment_data.get_candidate_assessment_and_assessment_tests")


const get_candidate_detail = useFrappePostCall("scrutin.api.assessment_data.get_candidate_detail")


  return (
    <div>CandidateDashboard


<Button onClick={() => {
        specific_assessment_candidates.call({
          assessmnt: 'Python Developer',
        });
      }}>
        Update Job Applicant
      </Button>


      <Button onClick={() => {
        get_questions_for_test_and_total_duration.call({
          test_name: 'k9a5emvdd6',
        });
      }}>
        Test Questions & Total Duration
      </Button>

      <Button onClick={() => {
        get_assessment_data.call({
          assessment_name: 'jvecvcvl4o',
        });
      }}>
        Assessment Detail
      </Button>

      <Button onClick={() => {
        get_candidate_assessment_and_assessment_tests.call({
          email: 'muhammadsaad123@gmail.com',
        });
      }}>
        Candidate Assessment
      </Button>
      <Button onClick={() => {
        get_candidate_detail.call({
          candidate: 'k3jas5g82l',
        });
      }}>
        Candidate Detail
      </Button>

    </div>
    
  )
}

export default CandidateDashboard