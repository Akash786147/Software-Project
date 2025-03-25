
import { FC, useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card } from '@/components/ui/card';
import SemesterTabs from '@/components/SemesterTabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Result: FC = () => {
  const [activeSemester, setActiveSemester] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [semesterResults, setSemesterResults] = useState<Array<{
    subject: string;
    code: string;
    internalMarks: number;
    externalMarks: number;
    totalMarks: number;
    grade: string;
    credits: number;
  }>>([]);
  
  // Results data for different semesters
  const semesterData: Record<number, {
    sgpa: number;
    cgpa: number;
    highestMarks: number;
    highestSubject: string;
    subjects: Array<{
      subject: string;
      code: string;
      internalMarks: number;
      externalMarks: number;
      totalMarks: number;
      grade: string;
      credits: number;
    }>;
  }> = {
    1: {
      sgpa: 8.2,
      cgpa: 8.2,
      highestMarks: 92,
      highestSubject: 'Introduction to Programming',
      subjects: [
        {
          subject: 'Introduction to Programming',
          code: 'CSE1001',
          internalMarks: 28,
          externalMarks: 64,
          totalMarks: 92,
          grade: 'A',
          credits: 3,
        },
        {
          subject: 'Calculus I',
          code: 'MAT1001',
          internalMarks: 22,
          externalMarks: 58,
          totalMarks: 80,
          grade: 'B+',
          credits: 3,
        },
        {
          subject: 'Physics I',
          code: 'PHY1001',
          internalMarks: 25,
          externalMarks: 60,
          totalMarks: 85,
          grade: 'A',
          credits: 3,
        },
        {
          subject: 'Communication Skills',
          code: 'ENG1001',
          internalMarks: 26,
          externalMarks: 54,
          totalMarks: 80,
          grade: 'B+',
          credits: 2,
        },
      ],
    },
    2: {
      sgpa: 8.5,
      cgpa: 8.35,
      highestMarks: 95,
      highestSubject: 'Data Structures',
      subjects: [
        {
          subject: 'Data Structures',
          code: 'CSE1002',
          internalMarks: 29,
          externalMarks: 66,
          totalMarks: 95,
          grade: 'A+',
          credits: 3,
        },
        {
          subject: 'Linear Algebra',
          code: 'MAT1002',
          internalMarks: 24,
          externalMarks: 58,
          totalMarks: 82,
          grade: 'B+',
          credits: 3,
        },
        {
          subject: 'Object Oriented Programming',
          code: 'CSE1003',
          internalMarks: 27,
          externalMarks: 61,
          totalMarks: 88,
          grade: 'A',
          credits: 3,
        },
        {
          subject: 'Digital Electronics',
          code: 'ECE1001',
          internalMarks: 23,
          externalMarks: 57,
          totalMarks: 80,
          grade: 'B+',
          credits: 3,
        },
      ],
    },
    3: {
      sgpa: 8.8,
      cgpa: 8.5,
      highestMarks: 96,
      highestSubject: 'Machine Learning',
      subjects: [
        {
          subject: 'Computer Organization & Architecture',
          code: 'CSE2709',
          internalMarks: 25,
          externalMarks: 65,
          totalMarks: 90,
          grade: 'A',
          credits: 3,
        },
        {
          subject: 'Software Engineering',
          code: 'CSE3005',
          internalMarks: 24,
          externalMarks: 58,
          totalMarks: 82,
          grade: 'B+',
          credits: 3,
        },
        {
          subject: 'Mobile App Development',
          code: 'CSE3709',
          internalMarks: 28,
          externalMarks: 62,
          totalMarks: 90,
          grade: 'A',
          credits: 3,
        },
        {
          subject: 'Design Thinking',
          code: 'PSP2709',
          internalMarks: 22,
          externalMarks: 55,
          totalMarks: 77,
          grade: 'B',
          credits: 2,
        },
        {
          subject: 'Machine Learning',
          code: 'CSE2032',
          internalMarks: 28,
          externalMarks: 68,
          totalMarks: 96,
          grade: 'A+',
          credits: 3,
        },
      ],
    },
    4: {
      sgpa: 9.1,
      cgpa: 8.75,
      highestMarks: 98,
      highestSubject: 'Web Development',
      subjects: [
        {
          subject: 'Web Development',
          code: 'CSE2707',
          internalMarks: 29,
          externalMarks: 69,
          totalMarks: 98,
          grade: 'A+',
          credits: 3,
        },
        {
          subject: 'Artificial Intelligence',
          code: 'CSE4001',
          internalMarks: 27,
          externalMarks: 63,
          totalMarks: 90,
          grade: 'A',
          credits: 3,
        },
        {
          subject: 'Natural Language Processing',
          code: 'CSE4002',
          internalMarks: 26,
          externalMarks: 62,
          totalMarks: 88,
          grade: 'A',
          credits: 3,
        },
        {
          subject: 'Cloud Computing',
          code: 'CSE4003',
          internalMarks: 25,
          externalMarks: 65,
          totalMarks: 90,
          grade: 'A',
          credits: 3,
        },
      ],
    },
  };
  
  useEffect(() => {
    // Simulate API call to fetch results for the active semester
    setIsLoading(true);
    
    // Simulate network delay
    const timer = setTimeout(() => {
      const data = semesterData[activeSemester];
      if (data) {
        setSemesterResults(data.subjects);
      } else {
        setSemesterResults([]);
      }
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [activeSemester]);
  
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
        return 'text-purple';
      case 'A':
        return 'text-green-600';
      case 'B+':
        return 'text-blue-600';
      case 'B':
        return 'text-yellow-600';
      default:
        return 'text-gray-700';
    }
  };
  
  const calculateSGPA = () => {
    if (isLoading || semesterResults.length === 0) return '0.00';
    
    const totalCredits = semesterResults.reduce((sum, subject) => sum + subject.credits, 0);
    const totalGradePoints = semesterResults.reduce((sum, subject) => {
      let gradePoints = 0;
      switch (subject.grade) {
        case 'A+': gradePoints = 10; break;
        case 'A': gradePoints = 9; break;
        case 'B+': gradePoints = 8; break;
        case 'B': gradePoints = 7; break;
        default: gradePoints = 6; break;
      }
      return sum + (gradePoints * subject.credits);
    }, 0);
    
    return (totalGradePoints / totalCredits).toFixed(2);
  };
  
  const chartData = semesterResults.map(result => ({
    name: result.subject.length > 10 ? `${result.subject.substring(0, 10)}...` : result.subject,
    marks: result.totalMarks,
  }));
  
  const currentSemesterData = semesterData[activeSemester] || { sgpa: 0, cgpa: 0, highestMarks: 0, highestSubject: '', subjects: [] };
  
  return (
    <PageLayout title="Result">
      <SemesterTabs activeSemester={activeSemester} onChange={setActiveSemester} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-md rounded-2xl p-6 appear">
          <h3 className="text-lg font-medium mb-2">SGPA</h3>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded-md w-24"></div>
              <div className="h-4 bg-gray-200 rounded-md w-40 mt-2"></div>
            </div>
          ) : (
            <>
              <div className="text-4xl font-bold text-purple">{currentSemesterData.sgpa.toFixed(2)}</div>
              <p className="text-sm text-gray-600 mt-2">Semester {activeSemester} Performance</p>
            </>
          )}
        </Card>
        
        <Card className="shadow-md rounded-2xl p-6 appear">
          <h3 className="text-lg font-medium mb-2">CGPA</h3>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded-md w-24"></div>
              <div className="h-4 bg-gray-200 rounded-md w-40 mt-2"></div>
            </div>
          ) : (
            <>
              <div className="text-4xl font-bold text-purple">{currentSemesterData.cgpa.toFixed(2)}</div>
              <p className="text-sm text-gray-600 mt-2">Overall Performance</p>
            </>
          )}
        </Card>
        
        <Card className="shadow-md rounded-2xl p-6 appear">
          <h3 className="text-lg font-medium mb-2">Highest Marks</h3>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded-md w-24"></div>
              <div className="h-4 bg-gray-200 rounded-md w-40 mt-2"></div>
            </div>
          ) : (
            <>
              <div className="text-4xl font-bold text-purple">{currentSemesterData.highestMarks}</div>
              <p className="text-sm text-gray-600 mt-2">{currentSemesterData.highestSubject}</p>
            </>
          )}
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md rounded-2xl p-6 appear">
          <h3 className="text-xl font-semibold mb-4">Results Summary</h3>
          
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="grid grid-cols-6 gap-4">
                  <div className="h-6 bg-gray-200 rounded-md col-span-2"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-1"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-1"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-1"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-1"></div>
                </div>
              ))}
            </div>
          ) : semesterResults.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left font-medium text-gray-600">Subject</th>
                    <th className="py-3 text-left font-medium text-gray-600">Code</th>
                    <th className="py-3 text-left font-medium text-gray-600">Internal</th>
                    <th className="py-3 text-left font-medium text-gray-600">External</th>
                    <th className="py-3 text-left font-medium text-gray-600">Total</th>
                    <th className="py-3 text-left font-medium text-gray-600">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {semesterResults.map((result, index) => (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className="py-3 font-medium">{result.subject}</td>
                      <td className="py-3 text-gray-600">{result.code}</td>
                      <td className="py-3 text-gray-700">{result.internalMarks}</td>
                      <td className="py-3 text-gray-700">{result.externalMarks}</td>
                      <td className="py-3 font-medium">{result.totalMarks}</td>
                      <td className={`py-3 font-medium ${getGradeColor(result.grade)}`}>
                        {result.grade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No results available for this semester.
            </div>
          )}
        </Card>
        
        <Card className="shadow-md rounded-2xl p-6 appear">
          <h3 className="text-xl font-semibold mb-4">Performance Graph</h3>
          
          {isLoading ? (
            <div className="h-[300px] bg-gray-100 animate-pulse flex items-center justify-center">
              <p className="text-gray-400">Loading chart data...</p>
            </div>
          ) : semesterResults.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="marks" fill="#7963ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-gray-500">No chart data available</p>
            </div>
          )}
        </Card>
      </div>
    </PageLayout>
  );
};

export default Result;
