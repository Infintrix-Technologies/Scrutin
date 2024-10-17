import { Button } from "@/components/ui/button";
import { useFrappeGetCall, useFrappePostCall } from "frappe-react-sdk";


const CandidateDashboard = () => {

const getCandidatesOfSpecificUser = useFrappeGetCall("scrutin.api.user.get_user_candidates");
console.log(getCandidatesOfSpecificUser);


const session_user = useFrappeGetCall("scrutin.api.user.get_logged_user");
console.log(session_user);

const assessment_tests = useFrappeGetCall("scrutin.api.user.get_assessment_test");
console.log(assessment_tests);

const update_candidate = useFrappePostCall("scrutin.api.candidate.update_candidate");
console.log(update_candidate);

const update_applicant = useFrappePostCall("scrutin.api.candidate.update_job_applicant_status");
console.log(update_applicant);

  return (
    <div>CandidateDashboard

<Button onClick={() => {
        update_applicant.call({
          // assessment: 'vk1m38vch1',
          job_applicant: 'bilal123@gmail.com'
        });
      }}>
        Update Job Applicant
      </Button>

      <Button onClick={() => {
        update_candidate.call({
          assessment: 'pfn2mphqjf',
          // job_applicant: 'bilal123@gmail.com'
        });
      }}>
        Update Scrutin Candidate
      </Button>
    </div>
    
  )
}

export default CandidateDashboard