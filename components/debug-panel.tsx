"use client"

import { useState, useEffect } from "react"

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Any client-side initialization can go here
    // For example, you might want to open the panel based on a query parameter
    const shouldOpen = new URLSearchParams(window.location.search).get("debug") === "true"
    setIsOpen(shouldOpen)
  }, [])

  return (
    <details
      className="absolute inset-x-0 top-0 z-[999] cursor-pointer border-b border-yellow-100 bg-yellow-50 text-yellow-900"
      open={isOpen}
    >
      <summary className="px-4 py-2 font-medium">Debug Panel</summary>
      <div className="px-4 py-2">
        {/* Debug information goes here */}
        <p>Debug information will be displayed here.</p>
      </div>
    </details>
  )
}

