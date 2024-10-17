import { Button } from '@/components/ui/button';
import { useFrappeGetDoc, useFrappePostCall } from 'frappe-react-sdk';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"

import { useNavigate, useParams } from 'react-router-dom';
import { CandidateStatus } from '@/components/CandidateStatus';

const SpecificAssessments: React.FC = () => {
  const navigate = useNavigate();
  // Get the candidate_id param from the URL
  const { candidate_id } = useParams<{ candidate_id: string }>();

  const create_candidate = useFrappePostCall("scrutin.api.candidate.create_candidate");
  console.log(create_candidate);

  // Fetch the specific candidate's details based on the candidate_id from the URL
  const specificCandidate = useFrappeGetDoc("Scrutin Candidate", candidate_id || "");
  const candidate = specificCandidate?.data || [];
  console.log(candidate);

  return (
    <div>
      <h1>Check the console for assessments data.</h1>
      <Button onClick={() => {
        create_candidate.call({
          assessment: 'vk1m38vch1',
          job_applicant: 'salmansaeed7272@gmail.com'
        });
      }}>
        Invite Candidate
      </Button>

      <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Candidate Details</CardTitle>
        <CardDescription>Candidate Personal Information</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name" className='font-semibold'>Name</Label>
              <h1>
                {candidate.name}
              </h1>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name" className='font-semibold'>Email</Label>
              <h1>
                {candidate.job_applicant}
              </h1>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name" className='font-semibold'>Assessments</Label>
              <h1>
                {candidate.assessment}
              </h1>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name" className='font-semibold'>User</Label>
              <h1>
                {candidate.user}
              </h1>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name" className='font-semibold'>Status</Label>
              <CandidateStatus />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name" className='font-semibold'>Invited On</Label>
              <h1>
                {candidate.invited_on}
              </h1>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button onClick={() => navigate("/candidacy/:assessment_id/intro")}>
          Next
          </Button>
      </CardFooter>
    </Card>

    </div>
  );
};

export default SpecificAssessments;





