import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { usePDF } from 'react-to-pdf'

function getStatusVariant(status: string | undefined) {
  if (!status) return "bg-gray-100 text-gray-800";

  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Frozen":
      return "bg-blue-100 text-blue-800";
    case "Closed":
      return "bg-red-100 text-red-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Overdrawn":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

interface State {
  code: string;
  name: string;
}

interface AccountReport {
  account_id: number;
  customer_name: string;
  account_type: string;
  balance: number;
  account_status: string;
  user_status: string;
  zip_code: string;
  city: string;
  state_code: string;
  created_date: string;
}

interface ReportFilters {
  p_city?: string;
  p_date_from?: string;
  p_date_to?: string;
  p_max_balance?: number;
  p_min_balance?: number;
  p_state_code?: string;
  p_statuses?: ('Active' | 'Frozen' | 'Closed' | 'Pending' | 'Overdrawn')[];
  p_zip_codes?: string[];
}

export function ReportGenerator() {
  const [states, setStates] = useState<State[]>([]);
  const [filters, setFilters] = useState<ReportFilters>({});
  const [reportData, setReportData] = useState<AccountReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zipCodeInput, setZipCodeInput] = useState<string>("");

  const { toPDF, targetRef } = usePDF({filename: 'Report.pdf'});

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch("/api/states");
        if (!response.ok) throw new Error("Failed to fetch states");
        const result = await response.json();
        console.log("Fetched states:", result);
        setStates(result.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
  
    fetchStates();
  }, []);

  const generateReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/bank/stats/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate report");
      }

      const { data } = await response.json();
      setReportData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Report generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof ReportFilters, value: ReportFilters[keyof ReportFilters]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: Array.isArray(value) && value.length === 0 ? undefined : value,
    }));
  };

  // handle zip code input changes
  const handleZipCodeChange = (value: string) => {
    setZipCodeInput(value);
    
    // process zip codes and update filters
    if (value.trim()) {
      const zipArray = value
        .split(",")
        .map((zip) => zip.trim())
        .filter((zip) => zip.length > 0);
      
      handleFilterChange("p_zip_codes", zipArray.length > 0 ? zipArray : undefined);
    } else {
      handleFilterChange("p_zip_codes", undefined);
    }
  };
  
  // reset filters function to clear all filters
  const resetFilters = () => {
    setFilters({});
    setReportData([]);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
            {/* Date Fields */}
            <div className="space-y-2">
              <Label htmlFor="date_from">Created Date From</Label>
              <Input
                id="date_from"
                type="date"
                value={filters.p_date_from || ""}
                onChange={(e) => handleFilterChange("p_date_from", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_to">Created Date To</Label>
              <Input
                id="date_to"
                type="date"
                value={filters.p_date_to || ""}
                onChange={(e) => handleFilterChange("p_date_to", e.target.value)}
                min={filters.p_date_from || undefined}
              />
            </div>

            {/* Balance Range */}
            <div className="space-y-2">
              <Label htmlFor="min_balance">Min Balance ($)</Label>
              <Input
                id="min_balance"
                placeholder="e.g., 100"
                value={filters.p_min_balance?.toString() || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "p_min_balance",
                    e.target.value.trim() ? parseFloat(e.target.value) : undefined
                  )
                }
                type="text"
                inputMode="decimal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_balance">Max Balance ($)</Label>
              <Input
                id="max_balance"
                placeholder="e.g., 5000"
                value={filters.p_max_balance?.toString() || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "p_max_balance",
                    e.target.value.trim() ? parseFloat(e.target.value) : undefined
                  )
                }
                type="text"
                inputMode="decimal"
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="e.g., New York"
                value={filters.p_city || ""}
                onChange={(e) => handleFilterChange("p_city", e.target.value)}
              />
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state_code">State</Label>
              <Select
                value={filters.p_state_code || "__all__"}
                onValueChange={(value) =>
                  handleFilterChange("p_state_code", value === "__all__" ? undefined : value)
                }
              >
                <SelectTrigger id="state_code">
                  <SelectValue placeholder="All states" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All states</SelectItem>
                  {states.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name} ({state.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Zip Codes */}
            <div className="space-y-2">
              <Label htmlFor="zip_codes">Zip Codes (comma-separated)</Label>
              <Input
                id="zip_codes"
                placeholder="e.g., 90210, 10001, 94105"
                value={zipCodeInput}
                onChange={(e) => handleZipCodeChange(e.target.value)}
                type="text"
              />
              <p className="text-xs text-muted-foreground">
                Enter multiple zip codes separated by commas
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Account Status</Label>
              <MultiSelect
                options={[
                  { value: "Active", label: "Active" },
                  { value: "Frozen", label: "Frozen" },
                  { value: "Closed", label: "Closed" },
                  { value: "Pending", label: "Pending" },
                  { value: "Overdrawn", label: "Overdrawn" },
                ]}
                selected={filters.p_statuses || []}
                onChange={(selected) =>
                  handleFilterChange("p_statuses", selected.length ? selected : undefined)
                }
                placeholder="Select statuses..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <Button 
              onClick={resetFilters} 
              variant="outline" 
              className="px-6 py-2"
              disabled={loading || Object.keys(filters).length === 0}
            >
              Reset Filters
            </Button>

            <Button onClick={generateReport} disabled={loading} className="gap-2 px-6 py-2">
              {loading ? "Generating..." : "Generate Report"}
            </Button>

            <Button 
              onClick={() => toPDF()}
              disabled={loading || reportData.length === 0}
            > 
              Print Report 
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-500 border bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-700 font-medium">Error generating report:</p>
            <p className="text-red-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && reportData.length === 0 && (
        <div className="p-6 text-center text-gray-500 border rounded-lg bg-gray-50">
          No results found for the selected filters. Try adjusting your criteria.
        </div>
      )}

      {!loading && reportData.length > 0 && (
        <Card ref={targetRef}>
          <CardHeader>
            <CardTitle>Report Results ({reportData.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Account ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Zip Code</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>User Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((account) => (
                  <TableRow key={account.account_id}>
                    <TableCell className="font-medium pl-6">
                      A-{String(account.account_id).padStart(6, "0")}
                    </TableCell>
                    <TableCell>{account.customer_name}</TableCell>
                    <TableCell className="text-right">
                      $
                      {account.balance.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusVariant(account.account_status)}`}
                      >
                        {account.account_status || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>{account.state_code}</TableCell>
                    <TableCell>{account.city}</TableCell>
                    <TableCell>{account.zip_code}</TableCell>
                    <TableCell>
                      {new Date(account.created_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          account.user_status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {account.user_status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}