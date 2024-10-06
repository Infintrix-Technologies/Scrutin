import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function TestPage() {
  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-7xl mx-auto">
        {/* <CardHeader>
        <CardTitle>Question</CardTitle>
      </CardHeader> */}
        <CardContent className="space-y-6">
          <div className="flex space-x-4 my-6">
            <div className="flex-1 p-4">
            <h3 className="text-lg font-semibold mb-2">Question</h3>
              <p>The following is the schedule of Nathan, Sarah, and Violet:</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sun</TableHead>
                    <TableHead>Mon</TableHead>
                    <TableHead>Tue</TableHead>
                    <TableHead>Wed</TableHead>
                    <TableHead>Thu</TableHead>
                    <TableHead>Fri</TableHead>
                    <TableHead>Sat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Sarah</TableCell>
                    <TableCell>Violet</TableCell>
                    <TableCell>Sarah</TableCell>
                    <TableCell>Violet</TableCell>
                    <TableCell>Sarah</TableCell>
                    <TableCell>Nathan</TableCell>
                    <TableCell>Sarah</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Nathan</TableCell>
                    <TableCell>Violet</TableCell>
                    <TableCell>Nathan</TableCell>
                    <TableCell>Violet</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Nancy can work on any day either Nathan or Joy are scheduled.
                Joy can work on any day either Sarah or Violet are scheduled.
              </p>
            </div>
            <div className="flex-1 p-4">
              <h3 className="text-lg font-semibold mb-2">Select Answer</h3>
              <RadioGroup className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="joy-and-nancy" id="joy-and-nancy" />
                  <Label htmlFor="joy-and-nancy">Joy and Nancy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="joy" id="joy" />
                  <Label htmlFor="joy">Joy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nancy" id="nancy" />
                  <Label htmlFor="nancy">Nancy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no-one" id="no-one" />
                  <Label htmlFor="no-one">No one</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
