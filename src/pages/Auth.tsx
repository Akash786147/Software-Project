
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { type UserRole } from '@/lib/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [batch, setBatch] = useState('');
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Since we're bypassing authentication, just check if there are values
      if (!loginEmail || !loginPassword) {
        throw new Error('Please fill in all required fields');
      }

      // Directly navigate to home page - simulating faculty login
      navigate('/');
      
      toast({
        title: "Success",
        description: "Signed in as faculty!",
      });
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate required fields
      if (!signupEmail || !signupPassword || !confirmPassword || !firstName || !lastName || !role) {
        throw new Error('Please fill in all required fields');
      }
      
      // Validate password match
      if (signupPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      // Validate password strength
      if (signupPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Directly navigate to home page - simulating student login
      navigate('/');
      
      toast({
        title: "Success",
        description: `Signed up as ${role}!`,
      });
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src="/uploads/image.png" alt="BMU Logo" className="mx-auto h-20" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Welcome to BMU Portal
          </h2>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSignIn} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    autoComplete="email"
                    required
                    placeholder="Enter your email"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    className="mt-1"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-purple-700 hover:bg-purple-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in as Faculty"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder="First Name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      placeholder="Last Name"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="signupEmail">Email address</Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={(value) => setRole(value as UserRole)} required>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {role === 'student' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="batch">Batch</Label>
                      <Input
                        id="batch"
                        value={batch}
                        onChange={(e) => setBatch(e.target.value)}
                        placeholder="e.g., 2023-2027"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="course">Course</Label>
                      <Input
                        id="course"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        placeholder="e.g., B.Tech"
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
                
                {role === 'faculty' && (
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g., Computer Science"
                      className="mt-1"
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="signupPassword">Password</Label>
                  <Input
                    id="signupPassword"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    placeholder="Create a password"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm password"
                    className="mt-1"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-purple-700 hover:bg-purple-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Sign up as Student"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
