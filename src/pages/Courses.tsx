
import { FC, useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import SemesterTabs from '@/components/SemesterTabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Courses: FC = () => {
  const [activeSemester, setActiveSemester] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [courseData, setCourseData] = useState<Array<{
    code: string;
    name: string;
    sessions: number;
    credits: number;
    faculty: string;
  }>>([]);
  
  const navigate = useNavigate();
  
  // Course data for different semesters
  const semesterCourses: Record<number, Array<{
    code: string;
    name: string;
    sessions: number;
    credits: number;
    faculty: string;
  }>> = {
    1: [
      {
        code: 'CSE1001',
        name: 'Introduction to Programming',
        sessions: 40,
        credits: 3.0,
        faculty: 'Dr. Amit Sharma',
      },
      {
        code: 'MAT1001',
        name: 'Calculus I',
        sessions: 30,
        credits: 3.0,
        faculty: 'Dr. Priya Gupta',
      },
      {
        code: 'PHY1001',
        name: 'Physics I',
        sessions: 40,
        credits: 3.0,
        faculty: 'Dr. Rajesh Kumar',
      },
      {
        code: 'ENG1001',
        name: 'Communication Skills',
        sessions: 30,
        credits: 2.0,
        faculty: 'Prof. Neha Singh',
      },
    ],
    2: [
      {
        code: 'CSE1002',
        name: 'Data Structures',
        sessions: 45,
        credits: 3.0,
        faculty: 'Dr. Vikram Patel',
      },
      {
        code: 'MAT1002',
        name: 'Linear Algebra',
        sessions: 30,
        credits: 3.0,
        faculty: 'Dr. Suresh Reddy',
      },
      {
        code: 'CSE1003',
        name: 'Object Oriented Programming',
        sessions: 45,
        credits: 3.0,
        faculty: 'Prof. Ankit Verma',
      },
      {
        code: 'ECE1001',
        name: 'Digital Electronics',
        sessions: 40,
        credits: 3.0,
        faculty: 'Dr. Kavita Sharma',
      },
    ],
    3: [
      {
        code: 'CSE2709',
        name: 'Computer Organization & Architecture',
        sessions: 50,
        credits: 3.0,
        faculty: 'Dr. Satyendr Singh',
      },
      {
        code: 'CSE3005',
        name: 'Software Engineering',
        sessions: 120,
        credits: 3.0,
        faculty: 'Dr. Nishtha Phutela',
      },
      {
        code: 'CSE3709',
        name: 'Mobile App Development',
        sessions: 40,
        credits: 3.0,
        faculty: 'Mr. Gautam Gupta',
      },
      {
        code: 'PSP2709',
        name: 'Design Thinking',
        sessions: 60,
        credits: 3.0,
        faculty: 'Mr. Avijit Chakarvarti',
      },
      {
        code: 'CSE2032',
        name: 'Machine Learning',
        sessions: 120,
        credits: 3.0,
        faculty: 'Prof. Anantha Rao',
      },
    ],
    4: [
      {
        code: 'CSE2707',
        name: 'Web Development',
        sessions: 60,
        credits: 3.0,
        faculty: 'Dr. Ravi Shankar',
      },
      {
        code: 'CSE4001',
        name: 'Artificial Intelligence',
        sessions: 50,
        credits: 3.0,
        faculty: 'Dr. Meenakshi Sundaram',
      },
      {
        code: 'CSE4002',
        name: 'Natural Language Processing',
        sessions: 45,
        credits: 3.0,
        faculty: 'Dr. Anjali Mehta',
      },
      {
        code: 'CSE4003',
        name: 'Cloud Computing',
        sessions: 40,
        credits: 3.0,
        faculty: 'Prof. Saurabh Joshi',
      },
    ],
  };
  
  useEffect(() => {
    // Simulate API call to fetch courses for the active semester
    setIsLoading(true);
    
    // Simulate network delay
    const timer = setTimeout(() => {
      setCourseData(semesterCourses[activeSemester] || []);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [activeSemester]);
  
  const goToCourseRegistration = () => {
    toast({
      title: "Course Registration",
      description: `Navigating to course registration for semester ${activeSemester}`,
    });
    navigate('/course-registration');
  };
  
  return (
    <PageLayout title="Courses">
      <SemesterTabs activeSemester={activeSemester} onChange={setActiveSemester} />
      
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden appear">
        <div className="grid grid-cols-5 py-4 border-b">
          <div className="px-6 font-medium text-gray-600">Code</div>
          <div className="px-6 font-medium text-gray-600">Course Name</div>
          <div className="px-6 font-medium text-gray-600">Sessions</div>
          <div className="px-6 font-medium text-gray-600">Credits</div>
          <div className="px-6 font-medium text-gray-600">Faculty Name</div>
        </div>
        
        {isLoading ? (
          // Loading state
          Array.from({ length: 4 }).map((_, index) => (
            <div 
              key={index} 
              className="grid grid-cols-5 py-6 border-b animate-pulse"
            >
              <div className="px-6"><div className="h-4 bg-gray-200 rounded w-16"></div></div>
              <div className="px-6"><div className="h-4 bg-gray-200 rounded w-32"></div></div>
              <div className="px-6"><div className="h-4 bg-gray-200 rounded w-12"></div></div>
              <div className="px-6"><div className="h-4 bg-gray-200 rounded w-8"></div></div>
              <div className="px-6"><div className="h-4 bg-gray-200 rounded w-28"></div></div>
            </div>
          ))
        ) : courseData.length > 0 ? (
          courseData.map((course, index) => (
            <div 
              key={index} 
              className="grid grid-cols-5 py-6 hover:bg-gray-50 transition-colors border-b last:border-b-0"
            >
              <div className="px-6 text-gray-700">{course.code}</div>
              <div className="px-6 text-gray-800 font-medium">{course.name}</div>
              <div className="px-6 text-gray-700">{course.sessions}</div>
              <div className="px-6 text-gray-700">{course.credits}</div>
              <div className="px-6 text-gray-700">{course.faculty}</div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">
            No courses available for this semester.
          </div>
        )}
      </div>
      
      <div className="flex justify-end mt-4 space-x-4">
        <Button 
          onClick={goToCourseRegistration}
          className="bg-purple hover:bg-purple/90 text-white"
        >
          Course Registration
        </Button>
        <Button 
          className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200"
          onClick={() => {
            const nextSemester = activeSemester < 4 ? activeSemester + 1 : 1;
            setActiveSemester(nextSemester);
            toast({
              title: "Changed Semester",
              description: `Viewing courses for semester ${nextSemester}`,
            });
          }}
        >
          Next
        </Button>
      </div>
    </PageLayout>
  );
};

export default Courses;
