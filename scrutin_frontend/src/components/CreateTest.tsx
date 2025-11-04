import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaPlus } from "react-icons/fa";


const CreateTest = () => {


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="shadow-lg rounded-full">
          <FaPlus className="mr-2" />
          Create Test
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Test Template</DialogTitle>
          <DialogDescription>
            Fill in the details for the new Test.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTest;
