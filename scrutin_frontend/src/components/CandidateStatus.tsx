
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFrappeGetDocList } from "frappe-react-sdk";

export function CandidateStatus() {
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
    {candidatesData?.map((candidate) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent border-0 text-white shadow-none">
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
