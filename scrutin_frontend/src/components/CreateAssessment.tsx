import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaPlus } from 'react-icons/fa'

type Props = {}

function CreateAssessment({}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FaPlus />
          Create Assessment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Assessment</DialogTitle>
          <DialogDescription>
            Fill in the details for the new assessment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" placeholder="Enter assessment name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input id="description" placeholder="Enter assessment description" className="col-span-3" />
          </div>
          {/* Add more form fields as needed */}
        </div>
        <DialogFooter>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateAssessment
