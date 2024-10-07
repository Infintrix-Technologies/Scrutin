import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";

export function AssessmentActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button style={{background:"none", border:"none", color:"white", boxShadow:"none"}}>
      <BsThreeDotsVertical className="cursor-pointer h-5 w-5" />
      </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-24">
          <DropdownMenuItem>
            <MdDeleteForever className="h-5 w-5 mr-2" />
            <span>Delete</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CiEdit className="mr-2 h-5 w-5" />
            <span>Edit</span>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
