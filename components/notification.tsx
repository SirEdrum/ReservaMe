"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function Notification({ notification, onMarkAsRead }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`p-3 border-b ${notification.read ? "bg-white" : "bg-blue-50"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-sm ${notification.read ? "text-gray-600" : "text-gray-900 font-medium"}`}>
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
        </div>

        {!notification.read && isHovered && (
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onMarkAsRead(notification.id)}>
            <Check className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

