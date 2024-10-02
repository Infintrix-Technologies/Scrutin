
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

type Props = {}

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

const Assessments = (props: Props) => {
  return (
    <div className='px-32'>

      <div className='flex justify-between mt-10'>
        <h1 className='text-4xl font-bold'>Assessments</h1>
        <button className='bg-pink-700 p-4 rounded-3xl text-white hover:bg-pink-600'>Create Assessment</button>

      </div>

      <div className='my-10'>
        <div>
          <input className='border-2  rounded-xl p-2 w-96' type='text' placeholder='Search...' />
        </div>
        {/* <div className='flex items-center'>
          <table>
            <thead>
              <tr className='border rounded-xl'>
                <button><th className='border px-4 py-2  hover:bg-pink-600 hover:text-white'>Active</th></button>
                <button><th className='border px-4 py-2 hover:bg-pink-600 hover:text-white'>Inactive</th></button>
                <button><th className='border px-4 py-2 hover:bg-pink-600 hover:text-white'>Archived</th></button>
              </tr>
            </thead>
          </table>
        </div> */}
        </div>
         <Tabs defaultValue="active">
      <TabsList className="grid w-full grid-cols-3 bg-pink-700 text-white">
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="inactive">Inactive</TabsTrigger>
        <TabsTrigger value="archive">Archive</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
      <Table>
      <TableCaption>A list of your Active Assessment.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Candidate</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Last Activity</TableHead>
          <TableHead>Date Created</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell>{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
      </TabsContent>
      <TabsContent value="inactive">
      <Table>
      <TableCaption>A list of your Inactive Assessment.</TableCaption>
      <TableHeader>
      <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Candidate</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Last Activity</TableHead>
          <TableHead>Date Created</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell>{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
      </TabsContent>
      <TabsContent value="archive">
      <Table>
      <TableCaption>A list of your Archive Assessment.</TableCaption>
      <TableHeader>
      <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Candidate</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Last Activity</TableHead>
          <TableHead>Date Created</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell>{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
      </TabsContent>
    </Tabs>
    </div>
  )
}

export default Assessments