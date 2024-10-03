import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { useFrappeGetDocList } from "frappe-react-sdk";
import { BsThreeDotsVertical } from "react-icons/bs"

  // function createAssessment () {
  //   db.createDoc('My Custom DocType', {
  //     name: 'Test',
  //     test_field: 'This is a test field',
  //   })
  //     .then((doc) => console.log(doc))
  //     .catch((error) => console.error(error));
  // }
  
  export function AssessmentsList() {

    const assessments_query = useFrappeGetDocList<any>(
      'Scrutin Assessment',
      {
        /** Fields to be fetched - Optional */
        fields: ['*'],
        /** Filters to be applied - SQL AND operation */
        // filters: [['creation', '>', '2021-10-09']],
        /** Filters to be applied - SQL OR operation */
        // orFilters: [],
        /** Fetch from nth document in filtered and sorted list. Used for pagination  */
        // limit_start: 5,
        /** Number of documents to be fetched. Default is 20  */
        // limit: 10,
        /** Sort results by field and order  */
        // orderBy: {
        //   field: 'creation',
        //   order: 'desc',
        // },
        /** Fetch documents as a dictionary */
        asDict: true,
      },
      {
        /** SWR Configuration Options - Optional **/
      }
    );

    console.log(assessments_query)

    const assessments = assessments_query?.data || []
    return (
      <Table>
        <TableCaption>A list of your job postings.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Candidates</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Last activity</TableHead>
            <TableHead>Date created</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assessments.map((assessment) => (
            <TableRow key={assessment.name}>
              <TableCell className="font-medium">{assessment.assessment_name}</TableCell>
              <TableCell>{assessment.language}</TableCell>
              <TableCell>{assessment.company}</TableCell>
              <TableCell>{assessment.name}</TableCell>
              <TableCell>{assessment.creation}</TableCell>
              <TableCell>{assessment.owner}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            {/* <TableCell colSpan={7}>Total job postings: {data.length}</TableCell> */}
          </TableRow>
        </TableFooter>
      </Table>
    )
  }
  