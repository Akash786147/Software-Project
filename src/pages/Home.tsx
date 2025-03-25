
import { FC, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { format } from 'date-fns';

const Home: FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const studentInfo = {
    name: 'Akshit Wadhwa',
    course: 'BTech. Computer Science',
    batch: 'CSE 6',
    profileImage: '/public/uploads/yash-gupta.png'
  };
  
  const scheduleItems = [
    { subject: 'Software Engineering', timeFrom: '9:15', timeTo: '10:10' },
    { subject: 'Software Engineering', timeFrom: '10:15', timeTo: '11:10' },
    { subject: 'Cancelled', timeFrom: '11:15', timeTo: '12:10' },
    { subject: 'Lunch', timeFrom: '12:15', timeTo: '13:15' },
    { subject: 'Machine Learning', timeFrom: '14:15', timeTo: '15:10' },
    { subject: 'Machine Learning', timeFrom: '15:15', timeTo: '16:15' },
  ];
  
  return (
    <PageLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Profile */}
        <Card className="shadow-md rounded-2xl overflow-hidden appear">
          <CardContent className="p-0">
            <div className="flex items-center p-6">
              <div className="relative w-24 h-24 mr-6">
                <img 
                  src={studentInfo.profileImage} 
                  alt={studentInfo.name} 
                  className="rounded-xl object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-500/20 rounded-xl"></div>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-1">{studentInfo.name}</h2>
                <p className="text-gray-700 mb-1">Course: <span className="font-medium">{studentInfo.course}</span></p>
                <p className="text-gray-700 mb-2">Batch: <span className="font-medium">{studentInfo.batch}</span></p>
                
                <button className="px-5 py-2 border border-purple rounded-full text-purple hover:bg-purple/5 transition-colors">
                  Profile
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Calendar */}
        <Card className="shadow-md rounded-2xl appear">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="w-full max-w-sm">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  classNames={{
                    day_selected: "bg-purple text-white hover:bg-purple-dark focus:bg-purple-dark",
                    day_today: "bg-purple/10 text-purple",
                  }}
                />
              </div>
              
              <div className="mt-4 w-full space-y-2">
                {[11, 25].includes(date?.getDate() || 0) && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-purple/5">
                    <Bell className="text-purple h-5 w-5" />
                    <div>
                      <p className="font-medium">
                        {date?.getDate() === 11 ? 'DSA Mid sem' : 'MAD Quiz'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {date?.getDate() === 11 ? '1/2/25' : '23/2/25'} · {date?.getDate() === 11 ? '13:00' : '15:00'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Schedule */}
        <Card className="shadow-md rounded-2xl appear">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">Schedule</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-purple/20 grid grid-cols-3 p-2 rounded-xl mx-4">
              <button className="py-2 px-4 rounded-lg bg-purple text-white font-medium">Today</button>
              <button className="py-2 px-4 rounded-lg text-purple hover:bg-purple/10 transition-colors">From</button>
              <button className="py-2 px-4 rounded-lg text-purple hover:bg-purple/10 transition-colors">To</button>
            </div>
            
            <div className="mt-4">
              {scheduleItems.map((item, index) => (
                <div 
                  key={index}
                  className="grid grid-cols-3 border-b last:border-0 py-4 px-6"
                >
                  <div className={`text-sm font-medium ${item.subject === 'Cancelled' ? 'text-red-500' : ''}`}>
                    {item.subject}
                  </div>
                  <div className="text-sm text-center">{item.timeFrom}</div>
                  <div className="text-sm text-center">{item.timeTo}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Date and Attendance */}
        <div className="space-y-6">
          {/* Date */}
          <Card className="shadow-md rounded-2xl appear">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-4 py-2">
                {[8, 9, 10, 11, 12, 13, 14].map((day) => (
                  <button
                    key={day}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      day === 11 
                        ? 'bg-purple text-white' 
                        : 'bg-purple/10 text-purple hover:bg-purple/20'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-purple rounded-xl text-white p-4 text-center">
                  <h3 className="text-3xl font-bold mb-1">88</h3>
                  <p className="text-sm">Classes Left</p>
                </div>
                <div className="bg-gray-100 rounded-xl p-4 text-center">
                  <h3 className="text-3xl font-bold mb-1">15</h3>
                  <p className="text-sm">Classes Done</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Attendance */}
          <Card className="shadow-md rounded-2xl appear">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-48 w-full flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border-[20px] border-purple/20 relative flex items-center justify-center">
                  <div className="absolute text-3xl font-bold">88%</div>
                </div>
                
                <div className="absolute right-12 top-4 bg-purple/20 text-purple rounded-xl p-3 text-center">
                  <div className="text-lg font-semibold">72%</div>
                  <div className="text-sm">COA</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;
