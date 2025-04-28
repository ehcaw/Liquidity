import { getRecentTransactions } from "@/services/banking/admin";
import { ClientError, ServerError } from "@/utils/exceptions";

export async function GET() {
    try {
        const transactions = await getRecentTransactions();
        return Response.json({ data: transactions });
    } catch (error: unknown) {
        
        if (error instanceof ClientError) {
            return Response.json(
                { error: error.message }, 
                { status: error.status }
            );
        } else if (error instanceof ServerError) {
            return Response.json(
                { error: error.message }, 
                { status: error.status }
            );
        }
        
        return Response.json(
            { error: "Internal server error" }, 
            { status: 500 }
        );
    }
}