import { Button } from "@/components/ui/button";
import { useFrappeGetCall, useFrappePostCall } from "frappe-react-sdk";
// import LogImg from "../../../scrutin/public/images/bike12.png"
// import { Image } from "@radix-ui/react-avatar";
//  assets/scrutin/images/bike12.png

const TestAPI = () => {

const getCandidatesOfSpecificUser = useFrappeGetCall("scrutin.api.user.get_user_candidates");
console.log(getCandidatesOfSpecificUser, "getCandidatesOfSpecificUser");
// console.log(LogImg,"vvvvvvvvvvvvvvvv");


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


const get_specific_assessment_tests = useFrappePostCall("scrutin.api.assessment_data.get_specific_assessment_tests")
console.log(get_specific_assessment_tests,"get_specific_assessment_tests");


const get_candidate_responses = useFrappePostCall("scrutin.api.assessment_data.get_candidate_responses")


const get_candidate_response_questions_answer = useFrappePostCall("scrutin.api.assessment_data.get_candidate_response_questions_answer")


const get_candidate_response_test_finish_time = useFrappePostCall("scrutin.api.test_response_report.get_candidate_response_test_finish_time")


const get_specific_test_details = useFrappePostCall("scrutin.api.assessment_data.get_specific_test_details")



const get_applicant_name_assessment_name_for_specific_candidate = useFrappePostCall("scrutin.api.assessment_data.get_applicant_name_assessment_name_for_specific_candidate")



const update_test_Completed_time = useFrappePostCall("scrutin.api.assessment_data.update_test_start_time")



const get_candidate_test_progress = useFrappePostCall("scrutin.api.assessment_data.get_candidate_test_progress")



const add_test_progress = useFrappePostCall("scrutin.api.assessment_data.add_test_progress")




const get_candidate_detail_based_on_candidate_id = useFrappePostCall("scrutin.api.assessment_data.get_candidate_detail_based_on_candidate_id")



const get_candidate_detail_for_intro = useFrappePostCall("scrutin.api.assessment_data.get_candidate_detail_for_intro")



const test_details_for_overview_page = useFrappePostCall("scrutin.api.assessment_data.test_details_for_overview_page")



const get_assessment_test_and_question_with_options_with_candidate_id = useFrappePostCall("scrutin.api.assessment_data.get_assessment_test_and_question_with_options_with_candidate_id")


const get_scrutin_question_detail = useFrappePostCall("scrutin.api.assessment_data.get_scrutin_question_detail")



const add_scrutin_test_progress = useFrappePostCall("scrutin.api.candidate_test.add_scrutin_test_progress")


const add_scrutin_question_response = useFrappePostCall("scrutin.api.candidate_test.add_scrutin_question_response")


const get_candidate_questions_answer_responses = useFrappePostCall("scrutin.api.candidate_test.get_candidate_questions_answer_responses")



// TEST PAGE API
const get_question_with_navigation = useFrappePostCall("scrutin.api.candidate_test.get_question_with_navigation")


const get_question_with_answer_and_post_in_responses = useFrappePostCall("scrutin.api.candidate_test.get_question_with_answer_and_post_in_responses")


const get_current_question = useFrappePostCall("scrutin.api.candidate_test.get_current_question")


const start_assessment = useFrappePostCall("scrutin.api.candidate_test.start_assessment")


const complete_assessment = useFrappePostCall("scrutin.api.candidate_test.complete_assessment")



const are_all_questions_answered = useFrappePostCall("scrutin.api.candidate_test.are_all_questions_answered")



const check_how_many_candidate_responses_are_correct = useFrappePostCall("scrutin.api.candidate_test.check_how_many_candidate_responses_are_correct")



const get_candidate_assessment_test_and_question = useFrappePostCall("scrutin.api.candidate_test.get_candidate_assessment_test_and_question")



const get_candidate_assessment_performance = useFrappePostCall("scrutin.api.candidate_test.get_candidate_assessment_performance")



const get_assessment_based_on_designation = useFrappePostCall("scrutin.api.assessment_based_on_designation.get_assessment_based_on_designation")



const get_candidate_test_response_report = useFrappePostCall("scrutin.api.test_response_report.get_candidate_test_response_report")



const send_email_to_candidate_test_response_report = useFrappePostCall("scrutin.api.test_response_report.send_email_to_candidate_test_response_report")


const get_assessment_data_for_assessment_detail_page = useFrappePostCall("scrutin.api.assessment_data.get_assessment_data_for_assessment_detail_page")



const get_candidate_test_response_report_for_assessment_detail_page = useFrappePostCall("scrutin.api.assessment_data.get_candidate_test_response_report_for_assessment_detail_page")



const assessment_list_page_api = useFrappePostCall("scrutin.api.assessment_data.assessment_list_page_api")



const update_job_applicant_rating = useFrappePostCall("scrutin.api.candidate_test.update_job_applicant_rating")



const update_job_applicant_status = useFrappePostCall("scrutin.api.candidate_test.update_job_applicant_status")



const comparison_two_candidates_test_response_report = useFrappePostCall("scrutin.api.candidate_response_comparison.comparison_two_candidates_test_response_report")



const get_candidate_test_progress_for_test_page = useFrappePostCall("scrutin.api.test_duration.get_candidate_test_progress_for_test_page")



const add_scrutin_test_progress_duration = useFrappePostCall("scrutin.api.test_duration.add_scrutin_test_progress_duration")



const get_test_templete_data = useFrappePostCall("scrutin.api.test_template.get_test_templete_data")



const get_test_details = useFrappePostCall("scrutin.api.test_template.get_test_details")



const create_scrutin_test_from_template = useFrappePostCall("scrutin.api.test_template.create_scrutin_test_from_template")



const create_test_template_from_scrutin_test = useFrappePostCall("scrutin.api.test_template.create_test_template_from_test")




const get_current_question_for_testing = useFrappePostCall("scrutin.api.get_current_question.get_current_question")



const send_invite = useFrappePostCall("scrutin.api.send_invite.send_invite")


const assessment_list = useFrappePostCall("scrutin.api.send_invite.assessment_list")



const anti_cheating_checks = useFrappePostCall("scrutin.api.anti_cheating.anti_cheating_checks")




const get_candidate_webcam_snapshot = useFrappePostCall("scrutin.api.upload_webcam_snapshots.get_candidate_webcam_snapshot")



const upload_image = useFrappePostCall("scrutin.api.upload_webcam_snapshots.upload_image")





// const upload_image = useFrappePostCall("scrutin.api.upload_webcam_snapshots.upload_image")


  return (
    <div style={{display:"flex",
      justifyContent:"start",
      alignItems:"start",
      width:"500px",
      height:"auto",
      flexDirection:"column",
      gap:"12px",
    }}>TestAPI
      <Button onClick={() => {
        specific_assessment_candidates.call({
          assessmnt: 'Python Developer',
        });
      }}>
        Update Job Applicant
      </Button>


      <Button onClick={() => {
        get_questions_for_test_and_total_duration.call({
          test_name: 'gh76ldgot2',
        });
      }}>
        Test Questions & Total Duration
      </Button>

      <Button onClick={() => {
        get_assessment_data.call({
          assessment_id: 'ju7mgf9ceg',
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
          assessment_name: 'jvecvcvl4o',
        });
      }}>
        Test Question Options
      </Button>

      <Button onClick={() => {
        get_specific_assessment_tests.call({
          assessment_name: 'c2ms1le5va',
        });
      }}>
        Specific Assessment Tests
      </Button>


      <Button onClick={() => {
        get_candidate_responses.call({
          email: 'abdulmuneeb123@gmail.com',
        });
      }}>
        Candidate Test Responses
      </Button>


      <Button onClick={() => {
        get_candidate_test_progress.call({
          candidate_id: '97c5oqlsf5',
        });
      }}>
        get_candidate_test_progress
      </Button>


      <Button onClick={() => {
        get_candidate_response_questions_answer.call({
          candidate_id: '37hc0ipka2',
        });
      }}>
        Candidate Question/Answer Responses
      </Button>


      <Button onClick={() => {
        get_candidate_response_test_finish_time.call({
          candidate_id: 'k39k9ek7i1',
        });
      }}>
        GET Candidate Test Progress
      </Button>


      <Button onClick={() => {
        get_question_with_answer_and_post_in_responses.call({
          candidate_id: '37hc0ipka2',
          selected_option: {value: [3]}    //we can send single value (selected_option: 3) like this
        });
      }}>
        get_question_with_answer_and_post_in_responses
      </Button>


      <Button onClick={() => {
        add_test_progress.call({
          email: 'abdulmuneeb123@gmail.com',
          test_name: 'k8krlm90s7'
        });
      }}>
        Add Test in the Candidate Test Progress
      </Button>


      <Button onClick={() => {
        get_specific_test_details.call({
          test_id: '36se65gll1',
        });
      }}>
        Specific Test Duration & no_of_q
      </Button>


      <Button onClick={() => {
        get_applicant_name_assessment_name_for_specific_candidate.call({
          candidate_id: 'k265ossobt',
        });
      }}>
        get_specific_candidate_details
      </Button>


      <Button onClick={() => {
        get_candidate_detail_for_intro.call({
          candidate_id: '37hc0ipka2',
        });
      }}>
        get_specific_candidate_details_for_intro_page
      </Button>


      <Button onClick={() => {
        get_candidate_detail_based_on_candidate_id.call({
          candidate_id: '37hc0ipka2',
        });
      }}>
        get_candidate_detail_based_on_candidate_id
      </Button>


      <Button onClick={() => {
        get_assessment_test_and_question_with_options_with_candidate_id.call({
          candidate_id: 'k39k9ek7i1',
        });
      }}>
        Test Question With Options With Candidate ID
      </Button>


      <Button onClick={() => {
        test_details_for_overview_page.call({
          candidate_id: 'g4ckk5b9ml',
        });
      }}>
        test_details_for_overview_page
      </Button>


      <Button onClick={() => {
        update_test_Completed_time.call({
          test_id: 'k9o3uoe1ob',
        });
      }}>
        update_test_Completed_time
      </Button>


      <Button onClick={() => {
        get_question_with_navigation.call({
          candidate_id: 'k2abf6d21j',

        });
      }}>
        get_question_with_navigation
      </Button>


      <Button onClick={() => {
        get_scrutin_question_detail.call({
          question_id: 'dd6dd2hpd7',
        });
      }}>
        get_question_details
      </Button>


      <Button onClick={() => {
        get_current_question.call({
          candidate_id: 'k39k9ek7i1',
        });
      }}>
        Get Current Question
      </Button>


      <Button onClick={() => {
        add_scrutin_question_response.call({
          candidate_id: 'k39k9ek7i1',
          question_id: '1nuqjb313j',
          answer: '[2,4]'
        });
      }}>
        POST Candidate Question Response
      </Button>


      <Button onClick={() => {
        get_candidate_questions_answer_responses.call({
          candidate_id: 'k39k9ek7i1'
        });
      }}>
        GET Candidate Question Response
      </Button>


      <Button onClick={() => {
        add_scrutin_test_progress.call({
          candidate_id: '37hc0ipka2',
          test_id: 'k9o3uoe1ob'
        });
      }}>
        POST Candidate Test Progress
      </Button>


      <Button onClick={() => {
        start_assessment.call({
          candidate_id: '37hc0ipka2',
        });
      }}>
        Update Assessment started time
      </Button>


      <Button onClick={() => {
        complete_assessment.call({
          candidate_id: '37hc0ipka2',
        });
      }}>
        Update Assessment Completed time
      </Button>


      <Button onClick={() => {
        are_all_questions_answered.call({
          candidate_id: '37hc0ipka2',
          test_name: 'f3988t64af'
        });
      }}>
        Check complete test progress for overview page
      </Button>


      <Button onClick={() => {
        check_how_many_candidate_responses_are_correct.call({
          candidate_id: 'k39k9ek7i1'
        });
      }}>
        how many candidate responses are correct
      </Button>



      <Button onClick={() => {
        get_candidate_assessment_test_and_question.call({
          candidate_id: 'k39k9ek7i1'
        });
      }}>
        get candidate assessment test & question
      </Button>



      <Button onClick={() => {
        get_candidate_assessment_performance.call({
          candidate_id: 'v4qp61h4m8'
        });
      }}>
        get individual test average
      </Button>


      <Button onClick={() => {
        get_assessment_based_on_designation.call({
          applicant_id: 'salmansaeed7272@gmail.com'
        });
      }}>
        get job applicant designation
      </Button>


      <Button onClick={() => {
        get_candidate_test_response_report.call({
          candidate_id: 'k3jas5g82l'
        });
      }}>
        Candidate Test Response Report
      </Button>


      <Button onClick={() => {
        send_email_to_candidate_test_response_report.call({
          candidate_id: 'v4qp61h4m8'
        });
      }}>
        Send E-mail Candidate Test Response Report
      </Button>


      <Button onClick={() => {
        get_assessment_data_for_assessment_detail_page.call({
          assessment_id: 'juocinh9un',
        });
      }}>
        Assessment Data For Assessment Detail Page
      </Button>



      <Button onClick={() => {
        get_candidate_test_response_report_for_assessment_detail_page.call({
          candidate_id: 'k39k9ek7i1',
        });
      }}>
        Test & Assessment Average For Detail Page
      </Button>


      <Button onClick={() => {
        assessment_list_page_api.call({
        
        });
      }}>
        Assessment List Page API
      </Button>


      <Button onClick={() => {
        update_job_applicant_rating.call({
        applicant_id: "ayeshamalik123@gmail.com",
        rating: 0.7,
        });
      }}>
        update job applicant rating
      </Button>


      <Button onClick={() => {
        update_job_applicant_status.call({
        applicant_id: "salmansaeed7272@gmail.com",
        });
      }}>
        Update Job Applicant Status
      </Button>



      <Button onClick={() => {
        comparison_two_candidates_test_response_report.call({
        candidate_id: "k39k9ek7i1",
        // candidate_id_2: "37hc0ipka2"
        });
      }}>
        Compare Two Candidates Responses Reports
      </Button>


      <Button onClick={() => {
        get_candidate_test_progress_for_test_page.call({
        candidate_id: "k3jas5g82l",
        });
      }}>
        get_candidate_test_progress_for_test_page
      </Button>



      <Button onClick={() => {
        add_scrutin_test_progress_duration.call({
        candidate_id: "97c5oqlsf5",
        });
      }}>
        add_scrutin_test_progress_duration
      </Button>


      <Button onClick={() => {
        get_test_templete_data.call({
        template_id: "nja77nc2mg",
        });
      }}>
        get_test_templete_data
      </Button>


      <Button onClick={() => {
        get_test_details.call({
        test_id: "k9o3uoe1ob",
        });
      }}>
        get_test_details
      </Button>


      <Button onClick={() => {
        create_scrutin_test_from_template.call({
        template_id: "nja77nc2mg",
        });
      }}>
        create_scrutin_test_from_template
      </Button>



      <Button onClick={() => {
        create_test_template_from_scrutin_test.call({
        test_id: "goodt6rf6d",
        });
      }}>
        create_test_template_from_scrutin_test
      </Button>



      <Button onClick={() => {
        get_current_question_for_testing.call({
        candidate_id: "k3jas5g82l",
        });
      }}>
        Testing if time is complete then it will show the next test
      </Button>



      <Button onClick={() => {
        send_invite.call({
        assessment: "6475tpkkla",
        email_id: "khawarshadzad856@gmail.com"
        });
      }}>
        Send Invite
      </Button>



      <Button onClick={() => {
        assessment_list.call({
        });
      }}>
        Assessment List
      </Button>



      <Button onClick={() => {
        anti_cheating_checks.call({
          candidate_id: "97c5oqlsf5",
          ip_address: 1,
          web_cam: 0,
          full_screen: 0,
          mouse: 1,
        });
      }}>
        Anti Cheating Checks
      </Button>


      <Button onClick={() => {
        get_candidate_webcam_snapshot.call({
          candidate_id: "97c5oqlsf5",
        });
      }}>
        Candidate Snapshot
      </Button>


      <Button onClick={() => {
        upload_image.call({
          candidate_name: "97c5oqlsf5",
          image_file: "https://cdn.ferrari.com/cms/network/media/img/resize/667401a0cc30da0012c7bb67-laferrari_20240627_cover_768x1024_v4?width=768&height=1024"
        });
      }}>
        Upload Image
      </Button>


      {/* <Button onClick={() => {
        upload_image.call({
          candidate_name : "37hc0ipka2",
          image_file : {LogImg} 
        });
      }}>
        Upload Images in Candidate
      </Button> */}
{/* <img src={LogImg} alt="img"/> */}
    </div>
    
  )
}

export default TestAPI
