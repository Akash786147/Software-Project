
import { FC, useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card } from '@/components/ui/card';
import { format, subDays } from 'date-fns';

const Attendance: FC = () => {
  const [activeTab, setActiveTab] = useState('present');
  const [isLoading, setIsLoading] = useState(true);
  const [subjectAttendance, setSubjectAttendance] = useState<Array<{
    subject: string;
    present: number;
    total: number;
    percentage: number;
  }>>([]);
  const [attendanceHistory, setAttendanceHistory] = useState<Array<{
    date: string;
    day: string;
    status: string;
    subject: string;
  }>>([]);
  
  // Generate random subject attendance data
  const generateSubjectAttendance = () => {
    const subjects = [
      'Software Engineering',
      'Machine Learning',
      'Computer Organization & Architecture',
      'Mobile App Development',
      'Design Thinking',
    ];
    
    return subjects.map(subject => {
      const total = 10 + Math.floor(Math.random() * 10); // 10-19 classes
      const present = Math.floor((70 + Math.random() * 30) / 100 * total); // 70-99% attendance
      const percentage = Math.round((present / total) * 100);
      
      return {
        subject,
        present,
        total,
        percentage,
      };
    });
  };
  
  // Generate random attendance history
  const generateAttendanceHistory = () => {
    const subjects = [
      'Software Engineering',
      'Machine Learning',
      'Computer Organization & Architecture',
      'Mobile App Development',
      'Design Thinking',
    ];
    
    const history = [];
    const today = new Date();
    
    // Generate 30 days of attendance history
    for (let i = 0; i < 30; i++) {
      const date = subDays(today, i);
      const formattedDate = format(date, 'dd MMM yyyy');
      const day = format(date, 'EEEE');
      
      // Skip weekends
      if (day === 'Saturday' || day === 'Sunday') continue;
      
      // For each day, generate 1-3 class attendances
      const classCount = 1 + Math.floor(Math.random() * 3);
      
      for (let j = 0; j < classCount; j++) {
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const status = Math.random() > 0.2 ? 'Present' : 'Absent'; // 80% chance of being present
        
        history.push({
          date: formattedDate,
          day,
          status,
          subject,
        });
      }
    }
    
    return history;
  };
  
  useEffect(() => {
    // Simulate API call to fetch attendance data
    setIsLoading(true);
    
    // Simulate network delay
    const timer = setTimeout(() => {
      setSubjectAttendance(generateSubjectAttendance());
      setAttendanceHistory(generateAttendanceHistory());
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Calculate overall attendance percentage
  const calculateOverallAttendance = () => {
    if (subjectAttendance.length === 0) return 0;
    
    const totalPresent = subjectAttendance.reduce((sum, subject) => sum + subject.present, 0);
    const totalClasses = subjectAttendance.reduce((sum, subject) => sum + subject.total, 0);
    
    return Math.round((totalPresent / totalClasses) * 100);
  };
  
  // Get the subject with highest attendance
  const getHighestAttendance = () => {
    if (subjectAttendance.length === 0) return { subject: '', percentage: 0 };
    
    return subjectAttendance.reduce((prev, current) => 
      (prev.percentage > current.percentage) ? prev : current
    );
  };
  
  // Get the subject with lowest attendance
  const getLowestAttendance = () => {
    if (subjectAttendance.length === 0) return { subject: '', percentage: 0 };
    
    return subjectAttendance.reduce((prev, current) => 
      (prev.percentage < current.percentage) ? prev : current
    );
  };
  
  const highestAttendance = getHighestAttendance();
  const lowestAttendance = getLowestAttendance();
  const overallAttendance = calculateOverallAttendance();
  
  return (
    <PageLayout title="Attendance">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-md rounded-2xl overflow-hidden appear">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Subject Attendance</h2>
              
              {isLoading ? (
                <div className="space-y-4 animate-pulse">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <div className="h-5 bg-gray-200 rounded w-40"></div>
                        <div className="h-5 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5"></div>
                      <div className="h-4 bg-gray-200 rounded w-24 mt-1"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {subjectAttendance.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{item.subject}</h3>
                        <span className={`font-semibold ${getPercentageColor(item.percentage)}`}>
                          {item.percentage}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            item.percentage >= 90 ? 'bg-green-500' : 
                            item.percentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mt-1">
                        {item.present} / {item.total} classes
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card className="shadow-md rounded-2xl overflow-hidden appear h-full">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Attendance Overview</h2>
              
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="relative h-52 w-52 mx-auto mb-6">
                    <div className="w-full h-full rounded-full border-[20px] border-gray-200 relative flex items-center justify-center">
                      <div className="h-8 w-20 bg-gray-200 rounded-md"></div>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4 text-center">
                    <div className="h-4 bg-gray-200 rounded-md w-32 mx-auto"></div>
                    <div className="h-6 bg-gray-200 rounded-md w-40 mx-auto mt-2"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-36 mx-auto mt-2"></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative h-52 w-52 mx-auto mb-6">
                    <div className="w-full h-full rounded-full border-[20px] border-purple/20 relative flex items-center justify-center">
                      <div className="absolute text-4xl font-bold">{overallAttendance}%</div>
                    </div>
                    
                    <div className="absolute -right-4 top-6 bg-green-100 text-green-700 rounded-xl p-3 text-center">
                      <div className="text-lg font-semibold">{highestAttendance.percentage}%</div>
                      <div className="text-sm">{highestAttendance.subject.split(' ')[0]}</div>
                    </div>
                    
                    <div className="absolute -left-4 bottom-6 bg-yellow-100 text-yellow-700 rounded-xl p-3 text-center">
                      <div className="text-lg font-semibold">{lowestAttendance.percentage}%</div>
                      <div className="text-sm">{lowestAttendance.subject.split(' ')[0]}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 rounded-xl p-4 text-center">
                    <div className="text-sm text-gray-600">Current Status</div>
                    <div className={`text-xl font-semibold ${
                      overallAttendance >= 75 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {overallAttendance >= 75 ? 'Good Standing' : 'Low Attendance'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Minimum required: 75%
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
      
      <Card className="shadow-md rounded-2xl overflow-hidden mt-6 appear">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Attendance History</h2>
          
          <div className="flex space-x-4 mb-6">
            <button 
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'present' 
                  ? 'bg-purple text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              onClick={() => setActiveTab('present')}
            >
              Present
            </button>
            <button 
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'absent' 
                  ? 'bg-purple text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              onClick={() => setActiveTab('absent')}
            >
              Absent
            </button>
          </div>
          
          <div className="grid grid-cols-4 py-3 border-b font-medium text-gray-600">
            <div className="px-4">Date</div>
            <div className="px-4">Day</div>
            <div className="px-4">Status</div>
            <div className="px-4">Subject</div>
          </div>
          
          {isLoading ? (
            <div className="animate-pulse">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="grid grid-cols-4 py-4 border-b">
                  <div className="px-4"><div className="h-4 bg-gray-200 rounded w-20"></div></div>
                  <div className="px-4"><div className="h-4 bg-gray-200 rounded w-16"></div></div>
                  <div className="px-4"><div className="h-4 bg-gray-200 rounded w-14"></div></div>
                  <div className="px-4"><div className="h-4 bg-gray-200 rounded w-32"></div></div>
                </div>
              ))}
            </div>
          ) : attendanceHistory
            .filter(item => activeTab === 'present' 
              ? item.status === 'Present' 
              : item.status === 'Absent').length > 0 ? (
            attendanceHistory
              .filter(item => activeTab === 'present' 
                ? item.status === 'Present' 
                : item.status === 'Absent')
              .slice(0, 10) // Show only the first 10 entries
              .map((item, index) => (
                <div key={index} className="grid grid-cols-4 py-4 border-b last:border-b-0">
                  <div className="px-4">{item.date}</div>
                  <div className="px-4">{item.day}</div>
                  <div className={`px-4 font-medium ${
                    item.status === 'Present' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.status}
                  </div>
                  <div className="px-4">{item.subject}</div>
                </div>
              ))
          ) : (
            <div className="py-8 text-center text-gray-500">
              No {activeTab} records found.
            </div>
          )}
        </div>
      </Card>
    </PageLayout>
  );
};

export default Attendance;
