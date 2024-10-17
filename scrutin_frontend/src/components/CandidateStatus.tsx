import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFrappeGetDoc, useFrappePostCall } from "frappe-react-sdk";
import { useNavigate } from "react-router-dom";

export function CandidateStatus() {

    // const navigate = useNavigate();

  const candidateStatus = useFrappeGetDoc("Scrutin Candidate", "pfn2mphqjf")
  const candidate = candidateStatus?.data || [];
  console.log(candidate);

    const update_candidate = useFrappePostCall("scrutin.api.candidate.update_candidate");
    console.log(update_candidate);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button style={{background:"none", border:"none", color:"white", boxShadow:"none"}}>
      {candidate.status}
      </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-24">
          <DropdownMenuItem>
            <span>Open</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
          onClick={() => {
            update_candidate.call({
              assessment: 'pfn2mphqjf',
            });
          }}
          // onClick={() => navigate("/candidacy/:assessment_id/intro")}
          >
            <span>Accepted</span>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
