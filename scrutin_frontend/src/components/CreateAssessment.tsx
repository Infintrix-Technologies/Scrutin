import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useFrappeCreateDoc } from "frappe-react-sdk";
import { useGlobalState } from "@/utils/StateProvider";
import {
  useAssessmentsListQuery,
  useCompanyListQuery,
  useLanguageListQuery,
} from "@/hooks/query-hooks";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RainbowButton } from "./ui/rainbow-button";

type ScrutinAssessment = {
  assessment_name: string;
  company: string;
  language: string;
};

const CreateAssessment = () => {
  const globalState = useGlobalState();

  return (
    <Dialog
      open={globalState.modals.create_assessment.open}
      onOpenChange={() => {
        if (globalState.modals.create_assessment.open) {
          globalState.openModal("create_assessment", false);
        } else {
          globalState.openModal("create_assessment", true);
        }
      }}
    >
      <DialogTrigger asChild>
        <RainbowButton>
        <FaPlus />
        Create Assessment
        </RainbowButton>
        {/* <Button variant="default">
          <FaPlus />
          Create Assessment
        </Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Assessment</DialogTitle>
          <DialogDescription>
            Fill in the details for the new assessment.
          </DialogDescription>
        </DialogHeader>
        <AssessmentForm />
      </DialogContent>
    </Dialog>
  );
};

const AssessmentForm = () => {
  const form = useForm<ScrutinAssessment>();

  const globalState = useGlobalState();
  const assessments_query = useAssessmentsListQuery();
  const languages_query = useLanguageListQuery();
  const companies_query = useCompanyListQuery();

  const create_frappe_doc = useFrappeCreateDoc();

  const onSubmit = async (data: ScrutinAssessment) => {
    try {
      await create_frappe_doc.createDoc("Scrutin Assessment", data);
      assessments_query.mutate();
      globalState.openModal("create_assessment", false);
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="assessment_name"
            rules={{ required: "Assessment Name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assessment Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter assessment name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <FormControl>
                  <Select onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Languages</SelectLabel>
                        {(languages_query?.data || []).map((language) => (
                          <SelectItem key={language.name} value={language.name}>
                            {language.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Select onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Companies</SelectLabel>
                        {(companies_query?.data || []).map((company) => (
                          <SelectItem key={company.name} value={company.name}>
                            {company.company_name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={create_frappe_doc.loading}>
            {create_frappe_doc.loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CreateAssessment;
