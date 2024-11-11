// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { CiEdit } from "react-icons/ci";
// import { MdDeleteForever } from "react-icons/md";

// export function AssessmentActions() {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button style={{background:"none", border:"none", color:"white", boxShadow:"none"}}>
//       <BsThreeDotsVertical className="cursor-pointer h-5 w-5" />
//       </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-24">
//           <DropdownMenuItem>
//             <MdDeleteForever className="h-5 w-5 mr-2" />
//             <span>Delete</span>
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <CiEdit className="mr-2 h-5 w-5" />
//             <span>Edit</span>
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
import { useFrappeDeleteDoc } from "frappe-react-sdk";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";

interface Props {
  assessment: any;
}

export const AssessmentActions = ({assessment}:Props )=> {
  const delete_api = useFrappeDeleteDoc();

  console.log(assessment,"0000000000004")

  const handleDelete = (name: string) => {
    console.log(name,"name");
    delete_api?.deleteDoc('Scrutin Assessment', name);
  };

  return (
    <div>
      
        <div  style={{ marginBottom: "1rem" }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button style={{ background: "none", border: "none", color: "white", boxShadow: "none" }}>
                <BsThreeDotsVertical className="cursor-pointer h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-24">
         
              <DropdownMenuItem key={assessment.assessment_name}>
                <MdDeleteForever  className="h-5 w-5 mr-2" />
                <span  onClick={() => handleDelete(assessment?.name)}>Delete</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CiEdit className="mr-2 h-5 w-5" />
                <span>Edit</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
    </div>
  );
}
