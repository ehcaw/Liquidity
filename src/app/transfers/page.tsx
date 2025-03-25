import TransferForm from "@/components/transfer-form"

export default function TransfersPage() {
  return (
    <div className="container mx-auto max-w-3xl py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Transfers</h1>
          <p className="text-muted-foreground">Schedule payments or create transfers between accounts</p>
        </div>

        <TransferForm />
      </div>
    </div>
  )
}

