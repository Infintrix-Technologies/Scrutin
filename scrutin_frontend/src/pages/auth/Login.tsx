import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUser } from "@/hooks/useUser";
import { Navigate, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const user = useUser()
  const navigate = useNavigate()
  interface LoginFormInputs {
    email: string;
    password: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [error, setError] = useState("");

  const onSubmit = async (data: { email: string; password: string }) => {
    setError("");

    // Log the form data
    console.log("Login attempt with:", data);

    try {
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Demo success logic
      if (data.password === "wrongpassword") {
        throw new Error("Invalid credentials");
      }
      navigate("/assessments")

      // alert("Login successful!");
      // Handle successful login (e.g., state updates, redirection, etc.)
    } catch {
      setError("Failed to log in. Please check your credentials.");
    }
  };

  if (user.isLoading){
    return <div>Loading...</div>
  }

  if (user.currentUser){
    return <Navigate to="/assessments" />
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your email and password to log in.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-600">{String(errors.email.message)}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-600">
                  {String(errors.password.message)}
                </p>
              )}
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Log in
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
