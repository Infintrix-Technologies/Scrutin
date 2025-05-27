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
import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

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

  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const toggleExpand = (questionId: string) => {
    setExpandedQuestionId((prev) => (prev === questionId ? null : questionId));
  };

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
              <React.Fragment key={q.question}>
                <TableRow
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleExpand(q.question)}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      {expandedQuestionId === q.question ? (
                        <ChevronDown className="mt-1" size={16} />
                      ) : (
                        <ChevronRight className="mt-1" size={16} />
                      )}
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: q.question_text }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>{q.type}</TableCell>
                  <TableCell>{q.question_duration}</TableCell>
                </TableRow>

                {expandedQuestionId === q.question && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className="ml-6 mt-2">
                        <ul className="list-disc pl-4 space-y-1">
                          {q.options.map((opt: any) => {
                            const isCorrect = opt.value === q.answer;
                            return (
                              <li
                                key={opt.value}
                                className={`${
                                  isCorrect
                                    ? "text-green-500 font-semibold"
                                    : "text-red-600"
                                }`}
                              >
                                {opt.label}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
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
