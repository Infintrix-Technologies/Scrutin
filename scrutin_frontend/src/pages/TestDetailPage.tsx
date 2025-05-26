import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFrappeGetCall } from "frappe-react-sdk";
import { useParams } from "react-router-dom";

const TestDetailPage = () => {
  const params = useParams();
  const test_id = params?.test_id || null;

  const { data, isLoading, error } = useFrappeGetCall(
    "scrutin.api.testing_api.get_test_questions",
    {
      test_id: test_id,
    }
  );

  const testData = data?.message;
  const testTitle = testData?.test_title || "";
  const questions = testData?.questions || [];

  return (
    <div className="px-6 py-4">
      <h1 className="text-2xl font-bold mb-2">{testTitle}</h1>
      <p className="mb-6 text-muted-foreground">Test ID: {test_id}</p>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error fetching test data</p>}

      {!isLoading && questions.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-black">#</TableHead>
              <TableHead className="font-semibold text-black">Question</TableHead>
              <TableHead className="font-semibold text-black">Type</TableHead>
              <TableHead className="font-semibold text-black">Duration (sec)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((q: any, index: number) => (
              <TableRow key={q.question}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: q.question_text }}
                  />
                </TableCell>
                <TableCell>{q.type}</TableCell>
                <TableCell>{q.question_duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {!isLoading && questions.length === 0 && (
        <p className="text-gray-500">No questions found for this test.</p>
      )}
    </div>
  );
};

export default TestDetailPage;
