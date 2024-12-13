/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFrappePostCall } from "frappe-react-sdk";
export interface UseRetrieveNextQuestion<T> {
    call: (params: Record<string, any>) => Promise<T>;
    result: T | null;
    loading: boolean;
    error: Error | null;
    isCompleted: boolean;
    reset: () => void;
}
export const useRetrieveNextQuestion = () => {
  return useFrappePostCall("scrutin.api.candidate_test.get_current_question",
    
  );
};

export interface useCandidateTestProgress<T> {
  call: (params: Record<string, any>) => Promise<T>;
  result: T | null;
  loading: boolean;
  error: Error | null;
  isCompleted: boolean;
  reset: () => void;
}
export const useCandidateTestProgress = () => {
return useFrappePostCall("scrutin.api.test_duration.get_candidate_test_progress_for_test_page",
  
);
};

