
import { FC, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import SemesterTabs from '@/components/SemesterTabs';

const CalendarPage: FC = () => {
  const [activeSemester, setActiveSemester] = useState(1);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Generate calendar data for the current month
  const calendarData = [
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28],
    [29, 30, 31, 1, 2, 3, 4],
  ];
  
  // Events data
  const events = [
    {
      day: 10,
      time: '10:00',
      title: 'Management in Parliament',
      status: 'Urgent',
      location: 'Online',
    },
    {
      day: 24,
      time: '15:00',
      title: 'Qualification P1',
      status: 'Urgent',
    }
  ];
  
  return (
    <PageLayout title="Calendar">
      <SemesterTabs activeSemester={activeSemester} onChange={setActiveSemester} />
      
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden appear">
        <div className="grid grid-cols-7 border-b">
          {days.map((day) => (
            <div key={day} className="p-4 text-center font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>
        
        {calendarData.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-b last:border-none">
            {week.map((day, dayIndex) => {
              const isNextMonth = weekIndex === 4 && dayIndex >= 4;
              const event = events.find(e => e.day === day);
              
              return (
                <div 
                  key={`${weekIndex}-${dayIndex}`} 
                  className={`p-4 min-h-[140px] border-r last:border-r-0 relative ${
                    isNextMonth ? 'text-gray-400' : ''
                  }`}
                >
                  <div className="text-right font-medium text-lg mb-2">
                    {day}
                    {isNextMonth && <div className="text-xs mt-1 text-gray-500">April</div>}
                  </div>
                  
                  {event && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      {day === 10 ? (
                        <div className="bg-purple/10 rounded-lg p-2 min-w-[150px]">
                          <div className="text-xs text-gray-700">{event.time}</div>
                          <div className="text-sm font-medium">{event.title}</div>
                          <div className="mt-1 flex gap-1 flex-wrap">
                            <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">Urgent</span>
                            <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">Online</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-purple/10 rounded-lg p-2 w-[120px]">
                          <div className="text-xs text-gray-700">{event.time}</div>
                          <div className="text-sm font-medium">{event.title}</div>
                          <div className="mt-1">
                            <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">Urgent</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export default CalendarPage;
