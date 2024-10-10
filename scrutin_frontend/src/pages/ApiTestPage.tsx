import { useFrappeGetCall } from 'frappe-react-sdk';

// interface Assessment {
//   language: string;
//   company: string;
// }

const SpecificAssessments: React.FC = () => {
  
 
  const sendEmailToCandidate = useFrappeGetCall<any>("scrutin.api.send_email_to_candidate.create_scrutin_candidate")
  console.log(sendEmailToCandidate)

  return (
    <div>
      <h1>Check the console for assessments data.</h1>
    </div>
  );
};

export default SpecificAssessments;






