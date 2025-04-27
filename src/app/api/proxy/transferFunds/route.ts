import { transferFunds } from "@/services/banking/account";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3001",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function POST(request: Request) {
  const { fromAccount, toAccount, amountNumber } = await request.json();
  const transfer = await transferFunds(fromAccount, toAccount, amountNumber);
  return new Response(JSON.stringify(transfer));
}
