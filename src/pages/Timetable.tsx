
import { FC, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import SemesterTabs from '@/components/SemesterTabs';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { format, addDays } from 'date-fns';

const Timetable: FC = () => {
  const [activeSemester, setActiveSemester] = useState(1);
  const [date, setDate] = useState<Date>(new Date());
  
  // Generate dynamic schedule data
  const generateScheduleData = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const subjects = [
      'Software Engineering', 
      'Machine Learning', 
      'COA', 
      'MAD', 
      'Design Thinking'
    ];
    
    // Create a dynamic weekly schedule
    const scheduleData: Record<string, Array<{subject: string, startTime: string, endTime: string, cancelled?: boolean}>> = {};
    
    days.forEach(day => {
      if (day === 'Saturday' || day === 'Sunday') {
        scheduleData[day] = [];
        return;
      }
      
      // Generate 1-3 classes for each weekday
      const classCount = Math.floor(Math.random() * 3) + 1;
      const dayClasses = [];
      
      for (let i = 0; i < classCount; i++) {
        const subjectIndex = Math.floor(Math.random() * subjects.length);
        const startHour = 8 + Math.floor(Math.random() * 8); // Classes between 8 AM and 4 PM
        const startTime = `${startHour}:${Math.random() > 0.5 ? '30' : '00'}`;
        const endHour = startHour + 1;
        const endTime = `${endHour}:${Math.random() > 0.5 ? '30' : '00'}`;
        
        // 10% chance of a class being cancelled
        const cancelled = Math.random() < 0.1;
        
        dayClasses.push({
          subject: cancelled ? 'Cancelled' : subjects[subjectIndex],
          startTime,
          endTime,
          cancelled
        });
      }
      
      // Sort classes by start time
      dayClasses.sort((a, b) => {
        const aHour = parseInt(a.startTime.split(':')[0]);
        const bHour = parseInt(b.startTime.split(':')[0]);
        return aHour - bHour;
      });
      
      scheduleData[day] = dayClasses;
    });
    
    return scheduleData;
  };
  
  const scheduleData = generateScheduleData();
  
  // Generate today's dynamic schedule based on the selected date
  const generateTodaySchedule = (selectedDate: Date) => {
    const dayName = format(selectedDate, 'EEEE');
    const daySchedule = scheduleData[dayName] || [];
    
    // Add lunch break
    const todaySchedule = [...daySchedule];
    if (todaySchedule.length > 0) {
      todaySchedule.push({
        subject: 'Lunch',
        startTime: '12:15',
        endTime: '13:15'
      });
      
      // Sort all events by start time
      todaySchedule.sort((a, b) => {
        const aHour = parseInt(a.startTime.split(':')[0]);
        const bHour = parseInt(b.startTime.split(':')[0]);
        return aHour - bHour;
      });
    }
    
    return todaySchedule;
  };
  
  const todaySchedule = generateTodaySchedule(date);
  
  // Generate calendar events
  const generateCalendarEvents = () => {
    const events = [];
    const currentDate = new Date();
    
    // Generate some random events in the next 30 days
    for (let i = 0; i < 5; i++) {
      const randomDaysAhead = Math.floor(Math.random() * 30);
      const eventDate = addDays(currentDate, randomDaysAhead);
      const eventTypes = ['Exam', 'Assignment Due', 'Project Presentation', 'Workshop', 'Guest Lecture'];
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const subjects = ['Software Engineering', 'Machine Learning', 'COA', 'MAD', 'Design Thinking'];
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      
      events.push({
        date: eventDate,
        title: `${eventType}: ${subject}`,
        time: `${10 + Math.floor(Math.random() * 6)}:${Math.random() > 0.5 ? '30' : '00'}`,
        important: Math.random() > 0.7
      });
    }
    
    return events;
  };
  
  const calendarEvents = generateCalendarEvents();
  
  // Function to check if a date has events
  const getDateEvents = (day: Date) => {
    return calendarEvents.filter(event => 
      event.date.getDate() === day.getDate() && 
      event.date.getMonth() === day.getMonth() && 
      event.date.getFullYear() === day.getFullYear()
    );
  };
  
  // Custom day renderer for the calendar
  const renderDay = (day: Date) => {
    const events = getDateEvents(day);
    
    if (events.length === 0) return undefined;
    
    return (
      <div className="relative h-full w-full">
        <div className="absolute bottom-0 left-0 right-0">
          <div className={`h-1 w-full ${events.some(e => e.important) ? 'bg-red-500' : 'bg-purple'}`}></div>
        </div>
      </div>
    );
  };
  
  return (
    <PageLayout title="Timetable">
      <SemesterTabs activeSemester={activeSemester} onChange={setActiveSemester} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 appear">
        <Card className="lg:col-span-1 shadow-md rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Calendar</h3>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border"
            components={{
              DayContent: ({ date }) => renderDay(date)
            }}
          />
          
          <div className="mt-6">
            <h4 className="font-medium text-lg mb-3">Events for {format(date, 'MMMM d, yyyy')}</h4>
            <div className="space-y-2">
              {getDateEvents(date).length > 0 ? (
                getDateEvents(date).map((event, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-lg ${event.important ? 'bg-red-100 border-l-4 border-red-500' : 'bg-purple/10'}`}
                  >
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-600">{event.time}</p>
                    {event.important && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                        Important
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No events scheduled for this day</p>
              )}
            </div>
          </div>
        </Card>
        
        <Card className="lg:col-span-2 shadow-md rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Schedule for {format(date, 'EEEE, MMMM d')}</h3>
          
          {todaySchedule.length > 0 ? (
            <>
              <div className="grid grid-cols-3 bg-gray-100 p-3 rounded-xl mb-4">
                <div className="text-center font-medium text-purple bg-white rounded-lg py-2 shadow-sm">Subject</div>
                <div className="text-center text-gray-700">Start Time</div>
                <div className="text-center text-gray-700">End Time</div>
              </div>
              
              <div className="space-y-2">
                {todaySchedule.map((session, index) => (
                  <div 
                    key={index}
                    className="grid grid-cols-3 py-3 border-b last:border-0"
                  >
                    <div className={`pl-4 font-medium ${session.cancelled ? 'text-red-500' : ''}`}>
                      {session.subject}
                    </div>
                    <div className="text-center text-gray-700">{session.startTime}</div>
                    <div className="text-center text-gray-700">{session.endTime}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="text-xl text-gray-500">No classes scheduled for this day</p>
            </div>
          )}
        </Card>
      </div>
    </PageLayout>
  );
};

export default Timetable;
