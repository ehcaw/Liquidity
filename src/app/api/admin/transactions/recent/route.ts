import { getRecentTransactions } from "@/services/banking/transaction";
import { ClientError, ServerError } from "@/utils/exceptions";

export async function GET() {
    try {
        console.log("API Endpoint Hit - Start"); // Terminal log
        const transactions = await getRecentTransactions();
        console.log("API Endpoint - Success"); // Terminal log
        return Response.json({ data: transactions });
    } catch (error: unknown) {
        console.error("API Endpoint Error:", error); // Terminal log
        
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