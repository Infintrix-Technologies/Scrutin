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
email:string;
job_applicant:string;
Assessments:number;
status:string;
invited_on:string

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
    overall:string;
    test_scores:string;
    title:string;
  }