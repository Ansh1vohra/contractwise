import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import heroImage from "@/assets/hero-contracts.jpg";
import { apiRequest } from "@/lib/api";

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Call backend signup
    await apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        // name: formData.name,
        username: formData.email,
        password: formData.password,
      }),
    });

    // Redirect after success
    alert("Signup successful! Please log in.");
    navigate("/login");
  } catch (err: any) {
    setError(err.message || "Signup failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img 
          src={heroImage}
          alt="Contract Management Dashboard"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="text-4xl font-bold mb-4">Join ContractPro</h1>
            <p className="text-xl text-white/90">
              Transform your contract management with intelligent automation
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-2xl font-bold text-foreground">ContractPro</h1>
          </div>
          
          <Card className="shadow-card border-card-border">
            <CardHeader>
              <CardTitle>Create your account</CardTitle>
              <CardDescription>
                Start managing your contracts more efficiently
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
                
                <p className="text-sm text-muted-foreground text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in here
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}