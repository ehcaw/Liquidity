import { Database } from "@/types/db"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Wallet, Send, Receipt } from "lucide-react"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"]

interface RecentTransactionsProps {
  transactions: Transaction[]
}

const getTransactionIcon = (type: string) => {
  switch(type) {
    case 'Deposit':
      return <ArrowUp className="h-4 w-4 text-green-500" />
    case 'Withdrawal':
      return <ArrowDown className="h-4 w-4 text-red-500" />
    case 'Transfer':
      return <Send className="h-4 w-4 text-blue-500" />
    case 'Payment':
      return <Receipt className="h-4 w-4 text-purple-500" />
    default:
      return <Wallet className="h-4 w-4 text-gray-500" />
  }
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
              {getTransactionIcon(transaction.transaction_type)}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {transaction.description}
              </p>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  {transaction.transaction_type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  A-{transaction.account_id.toString().padStart(4, '0')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className={`text-sm font-medium ${
              transaction.transaction_type === 'Deposit' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {transaction.transaction_type === 'Deposit' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
            </p>
            <Badge
              variant={
                transaction.status === 'Complete'
                  ? 'default'
                  : transaction.status === 'Pending'
                    ? 'secondary'
                    : 'destructive'
              }
              className="mt-1 text-xs"
            >
              {transaction.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
