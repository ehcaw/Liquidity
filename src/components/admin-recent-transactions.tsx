import { Database } from "@/types/db"
import { fetchData } from "@/utils/fetch";
import { Badge } from "@/components/ui/badge"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"] & {
  status: "Completed" | "Pending" | "Failed" | string;
};

export default async function RecentTransactions() {
    const transactions = await fetchData<Transaction[]>(
        '/api/admin/transactions/recent'
    );

    if (!transactions) {
        return <div className="text-gray-500">Loading transactions...</div>;
    }

    if (transactions.length === 0) {
        return <div className="text-gray-500">No recent transactions</div>;
    }

    return (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                {/* Add transaction details here */}
              </div>
              <div className="flex flex-col items-end">
                <p className="text-sm font-medium">
                  ${typeof transaction.amount === 'number' 
                    ? transaction.amount.toFixed(2) 
                    : '0.00'}
                </p>
                <Badge variant={getStatusVariant(transaction.status)}>
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
    )
}

function getStatusVariant(
    status: string,
): "default" | "outline" | "secondary" | "destructive" {
    switch (status) {
        case "Completed":
            return "default";
        case "Pending":
            return "secondary";
        case "Failed":
            return "destructive";
        default:
            return "outline";
    }
}