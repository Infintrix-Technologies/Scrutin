// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useFrappeGetDoc, useFrappeGetDocList, useFrappePostCall } from "frappe-react-sdk";
// import { useNavigate } from "react-router-dom";

// export function CandidateStatus() {

//     // const navigate = useNavigate();

//   // const candidateStatus = useFrappeGetDoc("Scrutin Candidate", "pfn2mphqjf")
//   // const candidate = candidateStatus?.data || [];
//   // console.log(candidate);

//   // const update_candidate = useFrappePostCall("scrutin.api.candidate.update_candidate");
//   // console.log(update_candidate);

//   const candidates_query = useFrappeGetDocList(
//         'Scrutin Candidate',
//         {
//           fields: ['status'],
//           orderBy: {
//             field: 'creation',
//             order: 'desc',
//           },
//           asDict: true,
//         },
//       );
//       const candidate_status = candidates_query?.data || []
//       const assessmentMap = candidate_status.reduce((map, status) => {
//       map[status.name] = status.status;
//       return map;
// }, {});



//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button style={{background:"none", border:"none", color:"white", boxShadow:"none"}}>
//       {candidates_query.status}
//       </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-24">
//           <DropdownMenuItem>
//             <span>Open</span>
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <span>Accepted</span>
//           </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }






import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFrappeGetDocList } from "frappe-react-sdk";

export function CandidateStatus() {
  // Fetch the list of candidate statuses
  const { data: candidatesData, error, isLoading } = useFrappeGetDocList('Scrutin Candidate', {
    fields: ['name', 'status'],
    orderBy: {
      field: 'creation',
      order: 'desc',
    },
    asDict: true,
  });
console.log(candidatesData,"candidatesDatacandidatesData");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
<>
    { candidatesData?.map((candidate) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button style={{ background: "none", border: "none", color: "white", boxShadow: "none" }}>
          Status
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-24">
        
            <DropdownMenuItem key={candidate.name}>
              <span>{candidate.status}</span>
            </DropdownMenuItem>
        
      </DropdownMenuContent>
    </DropdownMenu>
   ) )}
   </>
  );
}







// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { useFrappeGetDocList } from "frappe-react-sdk";

// export function CandidateStatus({ candidate }: { candidate: { status: string } }) {
// console.log(candidate,"candidatecandidate");


//   const { data: candidates = [] } = useFrappeGetDocList(
//     'Scrutin Candidate',
//     {
//       fields: ['status'],
//       orderBy: {
//         field: 'creation',
//         order: 'desc',
//       },
//       asDict: true,
//     },
//   );
  
//   console.log(candidates, "candidatestatus");

//   // const update_candidate = useFrappePostCall("scrutin.api.candidate.update_candidate");
//   // console.log(update_candidate);

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "Accepted":
//         return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Accepted</Badge>;
//       case "Open":
//         return <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">Open</Badge>;
//       default:
//         return <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">{status}</Badge>;
//     }
//   };

//   return (
//     <div>
//         <div >
//           <Select>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue>sfd</SelectValue>
//             </SelectTrigger>
//             <SelectContent>
//               <SelectGroup>
//                 <SelectLabel>Fruits</SelectLabel>
//                 <SelectItem value="apple">Apple</SelectItem>
//                 <SelectItem value="banana">Banana</SelectItem>
//                 <SelectItem value="blueberry">Blueberry</SelectItem>
//                 <SelectItem value="grapes">Grapes</SelectItem>
//                 <SelectItem value="pineapple">Pineapple</SelectItem>
//               </SelectGroup>
//             </SelectContent>
//           </Select>
//         </div>
//     </div>
//   )
// }
