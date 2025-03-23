"use client"

import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import {enUS} from "date-fns/locale/en-US"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Card } from "@/components/ui/card"
import type { CalendarEvent } from "@/types" 

const locales = {
  "en-US": enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface CalendarViewProps {
  events: CalendarEvent[]
  isManager: boolean
  userId: string
}

export function CalendarView({ events, isManager }: CalendarViewProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    }
  }

  const handleSelectSlot = ({ start }: { start: Date }) => {
    if (isManager) {
      console.log(start)
      // setSelectedDate(start)
      // setDialogMode("create")
      // setIsDialogOpen(true)
    }
  }

  const handleSelectEvent = (event: CalendarEvent) => {
    console.log(event)
    // setSelectedEvent(event)
    // setDialogMode(isManager ? "edit" : "view")
    // setIsDialogOpen(true)
  }



  const eventStyleGetter = (event: CalendarEvent) => {
    const style = {
      backgroundColor: getPriorityColor(event.priority).replace("bg-", ""),
      borderRadius: "4px",
      opacity: 0.8,
      color: "#fff",
      border: "0px",
      display: "block",
    }
    return {
      style,
    }
  }

  return (
    <Card className="p-4">
      <div className="h-[700px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable={isManager}
          eventPropGetter={eventStyleGetter}
          views={["month", "week", "day", "agenda"]}
        />
      </div>
    </Card>
  )
}

