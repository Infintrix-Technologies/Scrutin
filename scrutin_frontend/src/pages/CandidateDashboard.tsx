import { Button } from "@/components/ui/button";
import { useFrappeDeleteDoc, useFrappeGetCall, useFrappeGetDoc, useFrappeGetDocList, useFrappePostCall } from "frappe-react-sdk";


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

const get_assessment_name = useFrappeGetCall("scrutin.api.assessment_data.get_assessment_name")
console.log(get_assessment_name);


const assessment_data =  useFrappeGetDoc(
  'Scrutin Assessment', '0b1bdsk5tu',
  {
    fields: ['*'],
    orderBy: {
      field: 'creation',
      order: 'desc',
    },
    asDict: true,
  },
);
console.log(assessment_data, 'assessmentdata');

const test_data = useFrappeGetDoc(
  "Scrutin Test", 'Backend Development',
  {
    fields:['*'],
    orderBy: {
      field: 'creation',
      order: 'desc',
    },
    asDict: true,
  },
);
console.log(test_data, 'testdata');

const question_data = useFrappeGetDocList(
  "Scrutin Question",
  {
    fields:['*'],
    orderBy: {
      field: 'creation',
      order: 'desc',
    },
    asDict: true,
  },
);
console.log(question_data, 'questiondata');


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