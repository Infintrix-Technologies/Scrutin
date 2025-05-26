
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TestActions } from "@/components/TestActions";
import { Link, useSearchParams } from "react-router-dom";
import { useFrappePostCall } from "frappe-react-sdk";
import { TestListResponse } from "@/types/Interface";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateTest from "@/components/CreateTest";

const TestsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");
  const search = searchParams.get("test_title") || "";

  const test_list_page_api_query =
    useFrappePostCall<TestListResponse>(
      "scrutin.api.testing_api.tests_list_page_api"
    );

  const testsData = test_list_page_api_query.result;
  const testsDataList = testsData?.message || [];

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      if (searchInput) {
        newParams.set("test_title", searchInput);
      } else {
        newParams.delete("test_title");
      }
      setSearchParams(newParams);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, searchParams, setSearchParams]);

  useEffect(() => {
    test_list_page_api_query.call({
      test_title: search,
    });
  }, [search]);

  return (
    <div className="px-4 sm:px-8 lg:px-32 py-4 min-h-screen text-gray-800 ">
      <div className="flex flex-wrap justify-between items-center mt-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Tests</h1>
        <CreateTest />
      </div>

      <div className="my-3 flex flex-wrap gap-3 justify-between items-center">
        <Input
          placeholder="Search"
          className="w-full sm:w-48 "
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <Card className="bg-white  rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ padding: "20px 20px" }} className="font-bold text-black">
                Title
              </TableHead>
              <TableHead className="font-bold text-center text-black">Level</TableHead>
              <TableHead className="font-bold text-black">Language</TableHead>
              <TableHead className="font-bold text-black">Test Format</TableHead>
              <TableHead className="font-bold text-black">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testsDataList.map((test, index: number) => (
              <TableRow key={index} className="">
                <TableCell
                  className="font-medium"
                  style={{ padding: "0 20px" }}
                >
                  <Link to={`/tests/${test?.name}`}>
                    {test.title}
                  </Link>
                </TableCell>
                <TableCell className="text-center">
                  {test.level}
                </TableCell>
                <TableCell>{test.language}</TableCell>
                <TableCell>{test.test_format}</TableCell>
                <TableCell>
                  <TestActions test={test} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <hr />
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4 sm:gap-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-muted-foreground">
              Items per page
            </span>
            <Select defaultValue="10">
              <SelectTrigger className="w-[70px] sm:w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <span className="text-sm text-muted-foreground w-full sm:w-auto">
              Total Tests: {testsDataList.length}
            </span>
            <span className="text-sm text-muted-foreground w-full sm:w-auto">
              1 - 1 of 1
            </span>

            <div className="block md:flex gap-2 mt-2 sm:mt-0 w-full sm:w-auto justify-center sm:justify-start">
              <Button variant="outline" size="icon">
                <FaChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <FaChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TestsList;
