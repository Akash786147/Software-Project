
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";

// Import pages
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Timetable from "./pages/Timetable";
import Messages from "./pages/Messages";
import Result from "./pages/Result";
import Courses from "./pages/Courses";
import CourseRegistration from "./pages/CourseRegistration";
import GroupEvaluation from "./pages/GroupEvaluation";
import Attendance from "./pages/Attendance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/result" element={<Result />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course-registration" element={<CourseRegistration />} />
            <Route path="/group-evaluation" element={<GroupEvaluation />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
