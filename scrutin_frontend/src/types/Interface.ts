export interface AssessmentType {
  name: string;
  assessment_name: string;
  company: string;
  language: string;
  candidate_count: number;
}

export interface StateProviderQuestion {
  message: {
    test: {
      test: {
        name: string;
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


export interface TestResult {
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
  applicant_rating: number
}



export interface ItemProps {
  name: string;
  quantity: string;
}

export interface Candidate {
  name: string;
  score: number;
  hired: boolean;
}
export interface CandidateQueryData {
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
export interface Test {
  total_duration: number;
  duration: number;
  weight: string;
  title: number;
  impact: string;
}
export interface AssessmentData {
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
}

export interface OverviewTest {
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

export interface Question {
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
  questions: Question[];
  test_total_duration: number;
}
export interface Question {
  question: string;
  question_text: string;
}

export interface SkillData {
  skill: string;
  correct: number;
  incorrect: number;
}

export interface AssessmentTest {
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
}

export interface Assessment {
  tests: AssessmentTest[];
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
  questions: Question[];
  webcam_snapshots: (string | null)[];
  assessment_completed_at: string | null;
}

export interface CustomTest {
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

export interface Applicant {
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
  applicant: Applicant;
}

export interface ScrutinAssessment {
  assessment_name: string;
  company: string;
  language: string;
}

export interface CandidateAct {
  candidate_id: string;
  assessment_name: string;
  assessment: string;
  applicant_name: string;
  job_applicant: string;
  Assessments: number;
  invited_on: string;
  name: string;
}

export interface CandidateActionsProps {
  candidate: CandidateAct;
}
export interface TestResponseReport {
  tests: TestAssessments[];
  assessment_average: number;
}
export interface Assessment_Data {
  assessment_name: string;
  applicant_name: string;
  status: string;
  invited_on: string;
  total_duration_of_all_tests: number;
  total_number_of_tests: number;
  test_response_report: TestResponseReport;
}

export interface TestAssessments {
  test_title: string;
  accuracy: number;
}

export interface AssessmentList {
  name: string;
  assessment_name: string;
  company: string;
  language: string;
  candidate_count: number;
}
