"use server";
import { transferFunds } from "@/services/banking/account";
import {
  checkCheckExistence as checkCheckExistenceService,
  depositFundsService,
  insertCheck as insertCheckService,
} from "@/services/banking/transaction"; // Import the original service functions
import { ServerError } from "@/utils/exceptions"; // Assuming ServerError is defined here
import { revalidatePath } from "next/cache"; // To refresh data if needed

// Action to check if a check exists
export async function checkCheckExistenceAction(
  check_id: string,
  name: string,
  scannedAmount: number,
  date: string,
): Promise<boolean> {
  try {
    return await checkCheckExistenceService(
      check_id,
      name,
      scannedAmount,
      date,
    );
  } catch (error) {
    console.error("Server Action Error (checkCheckExistenceAction):", error);
    // Handle or re-throw the error appropriately for the client
    // Returning 'true' might prevent deposit, which could be safer
    // depending on how you want to handle errors.
    return true; // Or throw an error the client can catch
  }
}

// Action to insert a check
export async function insertCheckAction(
  name: string,
  amount: number,
  date: string,
  check_id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Consider removing the unused 'check_or_not' parameter from the service function
    await insertCheckService(name, amount, date, check_id);
    return { success: true };
  } catch (error) {
    console.error("Server Action Error (insertCheckAction):", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: message };
  }
}

// You might also want an action for the PUT /api/account/transactions logic
export async function depositCheckFundsAction(
  amount: number,
  accountNumber: string,
): Promise<{ success: boolean; error?: string }> {
  console.log("depositCheckFundsAction called with:", {
    amount,
    accountNumber,
  });
  const checkDepositResponse = await depositFundsService(accountNumber, amount);
  if (checkDepositResponse.success) {
    return { success: true };
  } else {
    return { success: false, error: "Error depositing funds" };
  }
}

export async function processCheckDepositAction(
  check_id: string,
  name: string,
  scannedAmount: number,
  date: string,
  accountNumber: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(
      `Processing deposit for check ID: ${check_id}, Account: ${accountNumber}, Amount: ${scannedAmount}`,
    );

    const checkExists = await checkCheckExistenceService(
      check_id,
      name,
      scannedAmount,
      date,
    );
    if (checkExists) {
      console.warn(
        `Deposit attempt for already existing check ID: ${check_id}`,
      );
      return {
        success: false,
        error: "This check has already been deposited.",
      };
    }
    console.log(`Check ID ${check_id} does not exist. Proceeding...`);

    await insertCheckService(name, scannedAmount, date, check_id);
    console.log(`Inserted check record for ID: ${check_id}`);
    await depositCheckFundsAction(scannedAmount, accountNumber);
    console.log(
      `Successfully deposited ${scannedAmount} into account ${accountNumber}`,
    );

    // --- Step 4: Revalidate relevant data paths ---
    // Adjust paths based on where your data is displayed
    revalidatePath("/dashboard");
    revalidatePath(`/accounts/${accountNumber}`); // Example: Revalidate specific account page
    revalidatePath("/transactions"); // Example: Revalidate transactions list

    console.log(`Deposit complete for check ID: ${check_id}`);
    return { success: true };
  } catch (error) {
    console.error(
      `Error during check deposit process for check ID ${check_id}:`,
      error,
    );
    // Consider more specific error handling or logging here.
    // If insertCheck succeeded but depositFunds failed, you might have an orphaned check record.
    // Advanced: Implement rollback logic (e.g., delete the inserted check record).
    const message =
      error instanceof Error
        ? error.message
        : "Check deposit failed due to an unexpected error.";
    return { success: false, error: message };
  }
}
