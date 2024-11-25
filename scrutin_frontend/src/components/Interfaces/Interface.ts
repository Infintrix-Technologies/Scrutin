export interface ItemProps {
  name: string;
  quantity: string;
}

export interface Candidate {
  name: string;
  score: number;
  hired: boolean;
}
export interface CandidateList {
  email: string;
  job_applicant: string;
  Assessments: number;
  status: string;
  invited_on: string;
}
export interface Test {
  duration: number;
  weight: string;
  title: number;
  impact: string;
}
export interface AssessmentData {
  applicant_name: string;
  status: string;
  invited_on: string;
  job_applicant: string;
  question: string;
  type: string;
  duration: string;
  overall: string;
  test_scores: string;
  title: string;
}

export interface OverViewPage {
  id: number;
  assessment_name: string;
  name: string;
  title: string;
  total_duration: number;
  total_questions: number;
  index: number;
}

export interface Option {
  value: string;
  label: string;
}

export interface Question {
  question: string;
  question_text: string;
  type: "Single Choice" | "Multiple Choice" | "Short Answer" | "Long Answer"; 
  question_duration: number;
  options: Option[];
}

export interface Tests {
  test: string;
  title: string;
  weight: string;
  questions: Question[];
  test_total_duration: number;
}