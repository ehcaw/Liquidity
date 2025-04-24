import { Button } from "@/components/ui/button";
import { Lock, Home } from "lucide-react";
import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md text-center">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-destructive/10 rounded-full">
              <Lock className="h-12 w-12 text-destructive" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">403 Forbidden</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this resource
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Button asChild variant="default">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Return Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}