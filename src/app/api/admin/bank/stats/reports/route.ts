import { getReport } from "@/services/banking/admin";
import { ClientError, ServerError } from "@/utils/exceptions";

export async function POST(req: Request) {
    try {
        const filters = await req.json();

        const reportData = await getReport(filters);

        return Response.json({data: reportData });
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