import { ArrowDown, ArrowUp, CreditCard, DollarSign, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database } from "@/types/db"
import { RecentTransactions } from "@/components/admin-recent-transactions"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"]

interface DashboardOverviewProps {
  data: {
    balance: number;
    activeAccounts: number;
    pendingTransactions: number;
    newAccounts: number;
    totalTransactions: number;
    recentTransactions: Transaction[];
  };
}

export function DashboardOverview({ data }: DashboardOverviewProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Bank Balance</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${data.balance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
            <CreditCard className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeAccounts.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">New Accounts</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.newAccounts.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              in the last 30 days
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pendingTransactions}</div>
            <div className="flex items-center text-xs text-muted-foreground">
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Transactions Overview</CardTitle>
            <CardDescription>
              {data.totalTransactions.toLocaleString()} total transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Chart would go here */}
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest account transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Recent transactions list would go here */}
            <RecentTransactions transactions={data.recentTransactions} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}