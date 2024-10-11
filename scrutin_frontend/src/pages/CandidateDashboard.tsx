import { useFrappeGetCall } from "frappe-react-sdk";


const CandidateDashboard = () => {

const getCandidatesOfSpecificUser = useFrappeGetCall("scrutin.api.user.get_user_candidates");
console.log(getCandidatesOfSpecificUser);


const session_user = useFrappeGetCall("scrutin.api.user.get_logged_user");
console.log(session_user);

const assessment_tests = useFrappeGetCall("scrutin.api.user.get_assessment_test");
console.log(assessment_tests);

  return (
    <div>CandidateDashboard</div>
  )
}

export default CandidateDashboard