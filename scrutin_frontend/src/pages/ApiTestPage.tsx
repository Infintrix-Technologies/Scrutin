import { useFrappeGetCall, useFrappePostCall } from 'frappe-react-sdk';

// interface Assessment {
//   language: string;
//   company: string;
// }

const SpecificAssessments: React.FC = () => {
  
  // const useFilterOnAssessment = useFrappeGetCall<any>("scrutin.api.create_candidate.create_scrutin_candidate");
  // console.log(useFilterOnAssessment)


  const createScrutinCandidates = useFrappeGetCall<any>("scrutin.api.create_scrutin_candidate.create_scrutin_candidate");
  console.log(createScrutinCandidates)


  return (
    <div>
      <h1>Check the console for assessments data.</h1>
    </div>
  );
};

export default SpecificAssessments;






