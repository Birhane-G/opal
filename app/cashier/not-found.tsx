import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CashierNotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">The cashier page you're looking for doesn't exist.</p>
          <Link href="/dashboard/cashier">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Back to Cashier Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
