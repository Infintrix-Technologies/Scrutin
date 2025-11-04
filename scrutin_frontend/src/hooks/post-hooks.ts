import { useFrappePostCall } from "frappe-react-sdk";
export interface UseRetrieveNextQuestion<T> {
    call: (params: Record<string, unknown>) => Promise<T>;
    result: T | null;
    loading: boolean;
    error: Error | null;
    isCompleted: boolean;
    reset: () => void;
}
export const useRetrieveNextQuestion = () => {
  return useFrappePostCall("scrutin.api.get_current_question.get_current_question",
      )};