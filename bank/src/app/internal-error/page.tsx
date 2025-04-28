import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Custom500() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="space-y-6 max-w-md">
        <AlertTriangle className="h-24 w-24 text-destructive mx-auto" />
        <h1 className="text-4xl font-bold tracking-tight">500 - Server Error</h1>
        <p className="text-muted-foreground text-lg">
          Sorry, we encountered an unexpected error on our servers. Our team has been notified and is working to fix the
          issue.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
