import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BackgroundPattern } from "@/components/background-pattern";
import { SearchBar } from "@/components/search-bar";
import { StatusPill } from "@/components/status-pill";
import { LoadingSpinner } from "@/components/loading-spinner";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, MapPin, CheckSquare } from "lucide-react";
import type { CalendarEvent, CalendarTask } from "@shared/schema";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CalendarPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: events = [], isLoading: eventsLoading } = useQuery<CalendarEvent[]>({
    queryKey: ["/api/calendar/events"],
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<CalendarTask[]>({
    queryKey: ["/api/calendar/tasks"],
  });

  const isLoading = eventsLoading || tasksLoading;

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (number | null)[] = [];
    for (let i = 0; i < startingDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    
    return days;
  }, [currentDate]);

  const eventDates = useMemo(() => {
    const dates = new Set<string>();
    events.forEach(e => {
      const d = new Date(e.date);
      dates.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });
    return dates;
  }, [events]);

  const taskDates = useMemo(() => {
    const dates = new Set<string>();
    tasks.forEach(t => {
      const d = new Date(t.dateTime);
      dates.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });
    return dates;
  }, [tasks]);

  const filteredEvents = events.filter(e =>
    e.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTasks = tasks.filter(t =>
    t.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const hasEvent = (day: number) => {
    return eventDates.has(`${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`);
  };

  const hasTask = (day: number) => {
    return taskDates.has(`${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#1A1E32" }}>
      <BackgroundPattern />
      <Header title="CALENDAR OF ACTIVITIES" showBack />

      <main className="flex-1 relative z-10 px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div 
            className="rounded-3xl p-6 md:p-8"
            style={{
              background: "rgba(14, 33, 72, 0.85)",
              backdropFilter: "blur(25px)",
              border: "1px solid rgba(121, 101, 193, 0.4)",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)"
            }}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8 pb-6 border-b-2" style={{ borderColor: "rgba(121, 101, 193, 0.4)" }}>
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #72E01F, #72E01FCC)" }}
                >
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <h2 
                  className="text-2xl md:text-3xl font-extrabold"
                  style={{ color: "#E3D095", textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}
                  data-testid="text-calendar-title"
                >
                  Calendar of Activities
                </h2>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search events or tasks..." />
                <Button
                  className="rounded-lg px-4 gap-2"
                  style={{ background: "#72E01F", color: "#1A1E32" }}
                  data-testid="button-add-event"
                >
                  <Plus className="w-4 h-4" />
                  Add Event
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div 
                className="rounded-xl p-5"
                style={{ background: "rgba(255, 255, 255, 0.05)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 rounded-lg transition-colors hover:bg-white/10"
                    style={{ color: "#E3D095" }}
                    data-testid="button-prev-month"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 
                    className="text-lg font-semibold"
                    style={{ color: "#E3D095" }}
                    data-testid="text-current-month"
                  >
                    {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 rounded-lg transition-colors hover:bg-white/10"
                    style={{ color: "#E3D095" }}
                    data-testid="button-next-month"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS.map(day => (
                    <div key={day} className="text-center text-xs font-semibold py-2" style={{ color: "#E3D095" }}>
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, idx) => (
                    <div
                      key={idx}
                      onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                      className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm cursor-pointer transition-colors ${day ? 'hover:bg-white/10' : ''}`}
                      style={{
                        background: day && isToday(day) ? "linear-gradient(135deg, #f30059, #d4004d)" : "transparent",
                        color: day ? "#E3D095" : "transparent",
                        fontWeight: day && isToday(day) ? "bold" : "normal"
                      }}
                      data-testid={day ? `calendar-day-${day}` : undefined}
                    >
                      {day}
                      {day && (hasEvent(day) || hasTask(day)) && (
                        <div className="flex gap-0.5 mt-0.5">
                          {hasEvent(day) && <span className="w-1.5 h-1.5 rounded-full bg-[#ff9e00]" />}
                          {hasTask(day) && <span className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]" />}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t" style={{ borderColor: "rgba(121, 101, 193, 0.3)" }}>
                  <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(227, 208, 149, 0.7)" }}>
                    <span className="w-2 h-2 rounded-full bg-[#ff9e00]" /> Events
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(227, 208, 149, 0.7)" }}>
                    <span className="w-2 h-2 rounded-full bg-[#00c3ff]" /> Tasks
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div 
                  className="rounded-xl p-5"
                  style={{ background: "rgba(255, 255, 255, 0.05)" }}
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "#E3D095" }}>
                    <Clock className="w-5 h-5" style={{ color: "#f30059" }} />
                    Event Schedule
                  </h3>

                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : filteredEvents.length === 0 ? (
                    <EmptyState
                      icon={CalendarIcon}
                      title="No events scheduled"
                      description="Add your first event to get started with activity scheduling."
                    />
                  ) : (
                    <div className="space-y-3">
                      {filteredEvents.map(event => (
                        <div
                          key={event.id}
                          className="p-4 rounded-xl transition-colors hover:bg-white/5"
                          style={{ 
                            background: "rgba(121, 101, 193, 0.1)",
                            border: "1px solid rgba(121, 101, 193, 0.2)"
                          }}
                          data-testid={`event-card-${event.id}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {event.priority && (
                                  <span 
                                    className="w-2 h-2 rounded-full"
                                    style={{ 
                                      background: event.priority === "High" ? "#DC3545" : 
                                                  event.priority === "Medium" ? "#FFC107" : "#007BFF"
                                    }}
                                  />
                                )}
                                <h4 className="font-semibold" style={{ color: "#E3D095" }}>{event.eventName}</h4>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: "rgba(227, 208, 149, 0.7)" }}>
                                <span className="flex items-center gap-1">
                                  <CalendarIcon className="w-3 h-3" />
                                  {new Date(event.date).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {event.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {event.location}
                                </span>
                              </div>
                              {event.notes && (
                                <p className="text-xs mt-2 line-clamp-2" style={{ color: "rgba(227, 208, 149, 0.6)" }}>
                                  {event.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div 
                  className="rounded-xl p-5"
                  style={{ background: "rgba(255, 255, 255, 0.05)" }}
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "#E3D095" }}>
                    <CheckSquare className="w-5 h-5" style={{ color: "#6F42C1" }} />
                    Task Schedule
                  </h3>

                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : filteredTasks.length === 0 ? (
                    <EmptyState
                      icon={CheckSquare}
                      title="No tasks scheduled"
                      description="Add tasks to track your deadlines and responsibilities."
                    />
                  ) : (
                    <div className="space-y-3">
                      {filteredTasks.map(task => (
                        <div
                          key={task.id}
                          className="p-4 rounded-xl transition-colors hover:bg-white/5 flex items-center gap-4"
                          style={{ 
                            background: "rgba(121, 101, 193, 0.1)",
                            border: "1px solid rgba(121, 101, 193, 0.2)"
                          }}
                          data-testid={`task-card-${task.id}`}
                        >
                          <input 
                            type="checkbox" 
                            checked={task.status === "Complete"}
                            onChange={() => {}}
                            className="w-5 h-5 rounded accent-[#72E01F]"
                            data-testid={`checkbox-task-${task.id}`}
                          />
                          <div className="flex-1">
                            <h4 
                              className={`font-semibold ${task.status === "Complete" ? "line-through opacity-60" : ""}`}
                              style={{ color: "#E3D095" }}
                            >
                              {task.taskName}
                            </h4>
                            <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: "rgba(227, 208, 149, 0.7)" }}>
                              <span>Due: {new Date(task.deadlineDateTime).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <StatusPill status={task.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
