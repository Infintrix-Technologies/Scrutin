/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, MoreHorizontal, Search, Settings } from "lucide-react";
import TestsAndQuestions from "@/components/TestsAndQuestions";

type Props = {};

const AssessmentDetail = (props: Props) => {
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: "Abdul Muqeet",
      overall: "-",
      problemSolving: "25%",
      communication: "18%",
      timeManagement: "22%",
      motivation: "-",
      stage: "Not yet evaluated",
      status: "Assessment started",
      invitedOn: "Sep 30, 2024",
      rating: 0,
    },
  ]);
  return (
    <div className="px-32">
      <div className="p-6 bg-background">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Candidates</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-8" placeholder="Search candidates" />
            </div>
            <Button variant="outline">
              Score range
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline">
              Stage
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline">
              Status
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="ghost">
              <Settings className="h-4 w-4 mr-2" />
              More filters
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Overall</TableHead>
              <TableHead>Problem Solving</TableHead>
              <TableHead>Communication</TableHead>
              <TableHead>Time Management</TableHead>
              <TableHead>Motivation</TableHead>
              <TableHead>Hiring stage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invited on</TableHead>
              <TableHead>Overall rating</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span>Abdul Muqeet</span>
                  <Badge>Owner</Badge>
                </div>
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>25%</TableCell>
              <TableCell>18%</TableCell>
              <TableCell>22%</TableCell>
              <TableCell>-</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Not yet evaluated
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></div>
                  Assessment started
                </div>
              </TableCell>
              <TableCell>Sep 30, 2024</TableCell>
              <TableCell>{/* Placeholder for rating component */}-</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit candidate</DropdownMenuItem>
                    <DropdownMenuItem>Delete candidate</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <TestsAndQuestions/>
    </div>
  );
};

export default AssessmentDetail;
