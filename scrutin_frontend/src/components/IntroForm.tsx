import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

// Define a schema using zod
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  agreePrivacy : z.string().optional(),
  subscribeNewsletter: z.string().optional(),
//   agreePrivacy: z.boolean().refine((val) => val === true, {
//     message: "You must accept the privacy policy",
//   }),
//   subscribeNewsletter: z.boolean().optional(),
})

type FormData = z.infer<typeof formSchema>

export default function IntroForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-start">Infintrix Technologies</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <h2 className="text-xl mb-4">Please confirm who you are</h2>
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              {...register("firstName")}
              required
            />
            {errors.firstName && <p className="text-red-600">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              {...register("lastName")}
              required
            />
            {errors.lastName && <p className="text-red-600">{errors.lastName.message}</p>}
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
            <Checkbox
                id="agreePrivacy"
                {...register("agreePrivacy")}
              />
              <Label htmlFor="agreePrivacy" className="text-sm">
                I have read and I accept the{' '}
                <a href="https://www.testgorilla.com/terms/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  privacy policy
                </a>{' '}
                and{' '}
                <a href="https://www.testgorilla.com/candidate-terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  candidate terms
                </a>
              </Label>
            </div>
            {errors.agreePrivacy && <p className="text-red-600">{errors.agreePrivacy.message}</p>}
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="subscribeNewsletter"
                {...register("subscribeNewsletter")}
              />
              <Label htmlFor="subscribeNewsletter" className="text-sm">
                I agree to receive product, marketing, and job communication from Scrutin.
              </Label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Submit</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
