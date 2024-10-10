import { Button } from '@/components/ui/button';
import {  useFrappePostCall } from 'frappe-react-sdk';

// interface Assessment {
//   language: string;
//   company: string;
// }

const SpecificAssessments: React.FC = () => {
  
 
  const create_candidate = useFrappePostCall("scrutin.api.candidate.create_candidate")


  console.log(create_candidate)

  return (
    <div>
      <h1>Check the console for assessments data.</h1>
      <Button onClick={()=>{
        create_candidate.call({
          assessment: '644g3qsnej',
          job_applicant: 'salmansaeed7272@gmail.com'
      })
      }}>Invite Candidate</Button>
    </div>
  );
};

export default SpecificAssessments;






