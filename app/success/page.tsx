import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home } from "lucide-react"

export default function SuccessPage() {
  return (
    <div className="container mx-auto py-12 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Report Submitted</CardTitle>
          <CardDescription>Thank you for submitting your missing person report</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>
            Your report has been received and is being processed. A case number has been assigned and sent to your
            email.
          </p>
          <p className="text-muted-foreground">
            Our team will review the information and may contact you for additional details if needed.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

