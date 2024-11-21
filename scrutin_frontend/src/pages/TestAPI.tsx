/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { useFrappeGetCall, useFrappePostCall } from "frappe-react-sdk";


const TestAPI = () => {

const getCandidatesOfSpecificUser = useFrappeGetCall("scrutin.api.user.get_user_candidates");
console.log(getCandidatesOfSpecificUser, "getCandidatesOfSpecificUser");


// const session_user = useFrappeGetCall("scrutin.api.user.get_logged_user");
// console.log(session_user);

// const update_candidate = useFrappePostCall("scrutin.api.candidate.update_candidate");
// console.log(update_candidate);

// const update_applicant = useFrappePostCall("scrutin.api.candidate.update_job_applicant_status");
// console.log(update_applicant);



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



//this api will give the candidate detail based on the job_applicant email
const get_combined_candidate_detail_with_snapshot = useFrappePostCall("scrutin.api.assessment_data.get_combined_candidate_detail_with_snapshot")



const get_assessment_test_and_question_with_options = useFrappePostCall("scrutin.api.assessment_data.get_assessment_test_and_question_with_options")




  return (
    <div>TestAPI


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
        get_combined_candidate_detail_with_snapshot.call({
          email: 'muhammadsaad123@gmail.com',
        });
      }}>
        Candidate Details & SnapShots
      </Button>

      <Button onClick={() => {
        get_assessment_test_and_question_with_options.call({
          assessment_name: 'ju7mgf9ceg',
        });
      }}>
        Test Question Options
      </Button>

    </div>
    
  )
}

export default TestAPI













// const CandidatesDetailPage: React.FC = () => {
//   const params = useParams();
//   const email = params?.email || null;

//   const get_candidate_details = useFrappeGetCall(
//     "scrutin.api.assessment_data.get_candidate_details",
//     {
//       email: email,
//     }
//   );

//   console.log('i am email', email);

//   const get_specific_assessment = get_candidate_details?.data?.message?.candidate_assessment || [];

//   console.log(get_specific_assessment, 'i am assessment details');

//   const [ratings, setRatings] = React.useState<number[]>(Array(5).fill(0));
//   const globalState = useGlobalState();

//   const handleRatingChange = (index: number) => {
//     const updatedRatings = [...ratings];
//     updatedRatings[index] = updatedRatings[index] === 0 ? 1 : 0;
//     setRatings(updatedRatings);
//   };

//   const totalWidth = 400; 

//   return (
//     <>
//       <header className="flex justify-between px-4 py-3 border-b">
//         <div className="flex items-center gap-3">
//           <Button variant="ghost" size="icon" className="rounded-full bg-[hsl(217.24deg_32.58%_17.45%)] hover:bg-teal-950">
//             <FaChevronLeft className="h-4 w-4" />
//             <span className="sr-only">Go back</span>
//           </Button>

//             <>
              
//                 <div className="flex flex-col sm:flex-col px-2 gap-0 sm:gap-2">
//                   <h1 className="text-base font-semibold">{get_specific_assessment[0].candidate_name}</h1>
//                   <Link to="#" className="text-sm text-muted-foreground hover:underline">
//                     {get_specific_assessment[0].job_applicant}
//                   </Link>
//                 </div>
              
//             </>
        
//       </div>