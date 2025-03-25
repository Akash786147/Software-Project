
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6 flex justify-center">
            <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">
            Sorry, the page you are looking for could not be found.
          </p>
          
          <Button asChild className="bg-purple hover:bg-purple-dark">
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
