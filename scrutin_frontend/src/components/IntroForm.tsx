import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronRightIcon } from "lucide-react";
import { useFrappeGetCall } from "frappe-react-sdk";
import { Checkbox } from "@/components/ui/checkbox";
import NotFound from "@/pages/NotFound";

// Define a schema Checkboxusing zod
const formSchema = z.object({
  agreePrivacy: z.literal(true, {
    errorMap: () => ({ message: "You must accept the privacy policy" }),
  }),
  subscribeNewsletter: z.literal(true, {
    errorMap: () => ({
      message: "You must agree to receive marketing communications",
    }),
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function IntroForm() {
  const params = useParams();
  const candidate_id = params?.candidate_id || null;
  const navigate = useNavigate();
  
  const {data,isLoading,error} = useFrappeGetCall(
    "scrutin.api.assessment_data.get_candidate_detail_for_intro",
    { candidate_id: candidate_id }  
  );
  const candidate_detail_for_intro =
    data?.message[0];


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = () => {
    navigate(`/candidacy/${candidate_id}/overview`);
  };

  const detectDeviceType = () =>
    // Use a regular expression to test the userAgent string for common mobile device identifiers.
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      ? 'Mobile' 
      : 'Desktop'; 
  
  console.log(detectDeviceType());
  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <NotFound/>;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-start">
          Infintrix Technologies
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <h2 className="text-xl mb-4">Please confirm who you are</h2>
          <hr />
          <div className="space-y-2">
            <Label htmlFor="firstName">Full name</Label>
            <Input
              id="firstName"
              defaultValue={candidate_detail_for_intro?.candidate_name}
              name="firstName"
              disabled
            />
          </div>
          <div>
            <Label htmlFor="firstName">Assessment name</Label>
            <Input
              id="firstName"
              defaultValue={candidate_detail_for_intro?.assessment_title}
              name="firstName"
              disabled
            />
            <Label htmlFor="firstName">Role Applied for:</Label>
            <Input
              id="firstName"
              defaultValue={candidate_detail_for_intro?.job_title}
              name="firstName"
              disabled
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Controller
                name="agreePrivacy"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="agreePrivacy"
                    checked={field.value || false} 
                    onCheckedChange={(checked) => field.onChange(checked)} 
                  />
                )}
              />
              <Label htmlFor="agreePrivacy" className="text-sm">
                I have read and I accept the{" "}
                <Link
                  to="#"
                  // target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  privacy policy
                </Link>{" "}
                and{" "}
                <Link
                  to="#"
                  // target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  candidate terms
                </Link>
              </Label>
            </div>
            {errors.agreePrivacy && (
              <p className="text-red-600">{errors.agreePrivacy.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Controller
                name="subscribeNewsletter"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="subscribeNewsletter"
                    checked={field.value || false}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                )}
              />
              <Label htmlFor="subscribeNewsletter" className="text-sm">
                I agree to receive product, marketing, and job communication
                from Scrutin.
              </Label>
            </div>
            {errors.subscribeNewsletter && (
              <p className="text-red-600">
                {errors.subscribeNewsletter.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full rounded-full">
            Next
            <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
