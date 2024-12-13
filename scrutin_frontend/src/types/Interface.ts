export interface AssessmentType {
  name: string;
  assessment_name: string;
  company: string;
  language: string;
  candidate_count: number;
}

export interface GlobalStateProviderQuestion {
  message: {
    test: {
      test: {
        test_id: string;
        title: string;
      };
      current_question: {
        name: string;
        text: string;
        type: string;
        options: { value: string; label: string }[];
      };
      last_test_question: boolean;
    };
    completed?: boolean;
  };
}

export interface TestResponseResult {
  test_title: string
  test_level: string
  accuracy: number
  total_questions: number
  correct_count: number
  incorrect_count: number
  total_duration: number
  answered_questions: number
  unanswered_questions: number
  finished_time: string
  applicant_name: string
  applicant_email: string
}

export interface CandidateListDetail {
  email: string;
  status: string;
  invited_on: string;
  candidate_id: string;
  assessment_name: string;
  assessment: string;
  applicant_name: string;
  job_applicant: string;
  Assessments: number;
  name: string;
  score: number;
}
export interface Assessment_Detail_Page_Test {
  total_duration: number;
  duration: number;
  weight: string;
  title: number;
  impact: string;
}

export interface TestAssessmentsAccuracy {
  test_title: string;
  accuracy: number;
}
export interface TestResponseReport {
  tests: TestResponseResult[];
  assessment_average: number;
}
export interface AssessmentDetailData {
  applicant_name: string;
  status: string;
  assessment_name: string;
  total_duration_of_all_tests: number;
  total_number_of_tests: number;
  invited_on: string;
  job_applicant: string;
  question: string;
  type: string;
  duration: string;
  overall: string;
  test_scores: string;
  title: string;
  test_response_report: TestResponseReport;
}


export interface Specific_Assessment_Overview_Test {
  assessment_name: string;
  name: string;
  title: string;
  total_duration: number;
  total_questions: number;
  index: number;
  answered_questions: number;
  unanswered_questions: number;
}

export interface CurrentQuestionOption {
  value: string;
  label: string;
}

export interface AssessmentCustomQuestion {
  question: string;
  question_text: string;
  type: "Single Choice" | "Multiple Choice" | "Short Answer" | "Long Answer";
  question_duration: number;
  options: CurrentQuestionOption[];
}

export interface Tests {
  test: string;
  title: string;
  weight: string;
  questions: AssessmentCustomQuestion[];
  test_total_duration: number;
}

export interface SkillData {
  skill: string;
  correct: number;
  incorrect: number;
}

export interface CandidateTestResponseReport {
  test: string;
  weight: string;
  title: string;
  test_title: string;
  accuracy: number;
  correct_count: number;
  incorrect_count: number;
  answered_questions: number;
  unanswered_questions: number;
  total_duration: number;
  finished_time: string;
  test_level:string
  total_questions:number
}

export interface CandidateDetailAssessments {
  tests: CandidateTestResponseReport[];
  assessment_name: string;
  assessment_title: string;
  job_applicant: string;
  candidate_id: string;
  candidate_name: string;
  status: string;
  invited_on: string;
  filled_out_only_once_from_ip_address: number;
  web_cam_enabled: number;
  full_screen_mode_always_active: number;
  mouse_always_in_assessment_window: number;
  questions: AssessmentCustomQuestion[];
  webcam_snapshots: (string | null)[];
  assessment_completed_at: string | null;
}

export interface CustomTestQuestions {
  name: string;
  duration: string;
}

export interface JobApplication {
  assessment: string;
  job_applicant: string;
}

export interface CustomQuestion {
  question: string;
  type: string;
  duration: string;
}

export interface JobApplicant {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  applicant_name: string;
  email_id: string;
  phone_number: string | null;
  country: string;
  job_title: string;
  designation: string | null;
  status: string;
  source: string | null;
  source_name: string | null;
  employee_referral: string | null;
  applicant_rating: number;
  notes: string | null;
  cover_letter: string | null;
  resume_attachment: string | null;
  resume_link: string | null;
  currency: string;
  lower_range: number;
  upper_range: number;
}

export interface JobApplicantActionsProps {
  applicant: JobApplicant;
}

export interface Create_Assessment {
  assessment_name: string;
  company: string;
  language: string;
}


export interface CandidateActionsProps {
  candidate: CandidateListDetail;
}



export interface AssessmentList {
  name: string;
  assessment_name: string;
  company: string;
  language: string;
  candidate_count: number;
}

export interface StartAssessment_And_Continue_Button {
  title: string;
  test_completed: boolean;
}

export interface TestProgressResult {
  test: string;
  duration: number;  
  started_at: string;  
  remaining_time: number; 
  total_questions: number;
  show_question: number;
}
export interface Test_Time_and_Questions {
  message: TestProgressResult[];
}

