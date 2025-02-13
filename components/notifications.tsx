import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    // Simulating fetching notifications from an API
    const fetchNotifications = async () => {
      // In a real application, this would be an API call
      const mockNotifications: Notification[] = [
        { id: 1, message: "New study group formed for Data Structures", type: 'info', timestamp: new Date().toISOString() },
        { id: 2, message: "Reminder: CS101 exam in 2 days", type: 'warning', timestamp: new Date().toISOString() },
        { id: 3, message: "New resource shared in your AI group", type: 'success', timestamp: new Date().toISOString() },
      ]
      setNotifications(mockNotifications)
    }

    fetchNotifications()
  }, [])

  const handleDismissNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id))
  }

  const handleSendNotification = () => {
    const newNotification: Notification = {
      id: notifications.length + 1,
      message: "You sent a new notification!",
      type: 'success',
      timestamp: new Date().toISOString()
    }
    setNotifications([newNotification, ...notifications])
    toast({
      title: "Notification Sent",
      description: "Your notification has been sent successfully.",
    })
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="h-4 w-4" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </Button>
      {showNotifications && (
        <Card className="absolute right-0 mt-2 w-80 z-50">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Your latest updates and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <p>No new notifications</p>
            ) : (
              <ul className="space-y-2">
                {notifications.map(notification => (
                  <li key={notification.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <span className="text-sm">{notification.message}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDismissNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            <Button className="w-full mt-4" onClick={handleSendNotification}>
              Send Test Notification
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

