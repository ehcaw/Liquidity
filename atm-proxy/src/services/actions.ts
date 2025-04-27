export async function getAccounts(token: string) {
  const response = await fetch("http://localhost:3000/api/proxy/getAccounts", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    console.error(`Failed to fetch accounts: ${response.status}`);
  }
  const data = await response.json();
  console.log(data);
  return data;
}

export async function checkBalance(userId: string, accountNumber: string) {
  const response = await fetch(
    `http://localhost:3000/api/proxy/checkBalance/userId=${userId}&accountNumber=${accountNumber}`,
  );
  const balance = await response.json();
  return balance;
}

export async function withdrawFunds(
  accountNumber: string,
  amountNumber: number,
  token: string,
) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/proxy/withdrawFunds`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountNumber: accountNumber,
          amountNumber: amountNumber,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to withdraw funds");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error withdrawing funds:", error);
    throw error;
  }
}

export async function depositFunds(
  accountNumber: string,
  amountNumber: number,
) {
  console.log(accountNumber);
  const response = await fetch(`http://localhost:3000/api/proxy/depositFunds`, {
    method: "POST",
    body: JSON.stringify({
      accountNumber: accountNumber,
      amountNumber: amountNumber,
    }),
  });
  const deposit = await response.json();
  return deposit;
}

export async function transferFunds(
  fromAccount: string,
  toAccount: string,
  amountNumber: number,
) {
  const response = await fetch(
    "http://localhost:3000/api/proxy/transferFunds",
    {
      method: "POST",
      body: JSON.stringify({
        fromAccount: fromAccount,
        toAccount: toAccount,
        amountNumber: amountNumber,
      }),
    },
  );
  const transfer = await response.json();
  return transfer;
}
