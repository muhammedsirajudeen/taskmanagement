"use client"

import { useState } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import enUS from "date-fns/locale/en-US"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Card } from "@/components/ui/card"
import type { CalendarEvent } from "@/lib/types"
import { getPriorityColor } from "@/lib/utils"
import { TaskDialog } from "@/components/calendar/task-dialog"

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

export function CalendarView({ events, isManager, userId }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"view" | "create" | "edit">("view")

  const handleSelectSlot = ({ start }: { start: Date }) => {
    if (isManager) {
      setSelectedDate(start)
      setDialogMode("create")
      setIsDialogOpen(true)
    }
  }

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setDialogMode(isManager ? "edit" : "view")
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setSelectedEvent(null)
    setSelectedDate(null)
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

      <TaskDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        mode={dialogMode}
        event={selectedEvent}
        date={selectedDate}
        isManager={isManager}
        userId={userId}
      />
    </Card>
  )
}

