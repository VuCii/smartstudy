"use client"

import * as React from "react"
import { signIn } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={() => {
          setIsLoading(true)
          signIn("github", { callbackUrl: "/dashboard" })
        }}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        Continue with GitHub
      </Button>
    </div>
  )
}

