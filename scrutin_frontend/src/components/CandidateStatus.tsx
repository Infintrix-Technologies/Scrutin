import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export function CandidateStatus() {

    const navigate = useNavigate();


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button style={{background:"none", border:"none", color:"white", boxShadow:"none"}}>
      Open
      </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-24">
          <DropdownMenuItem>
            <span>Open</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/candidacy/:assessment_id/intro")}>
            <span>Accepted</span>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
