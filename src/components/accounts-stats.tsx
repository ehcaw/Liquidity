"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatCurrency } from "@/utils/format";

export type AccountStats = {
  total_balance: number;
  change_1_day: number;
  change_1_week: number;
  change_1_month: number;
  change_3_months: number;
  change_1_year: number;
  change_all_time: number;
}

interface IAccountStatsProps {
  stats: AccountStats;
}

const AccountsStats: React.FC<IAccountStatsProps> = ({ stats }) => {
  return (
    <Card>
      <Tabs defaultValue="1M">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Portfolio Balance</CardTitle>
            <CardDescription>
              Your total balance across all accounts
            </CardDescription>
          </div>
          <TabsList>
            <TabsTrigger value="1W">1W</TabsTrigger>
            <TabsTrigger value="1M">1M</TabsTrigger>
            <TabsTrigger value="3M">3M</TabsTrigger>
            <TabsTrigger value="1Y">1Y</TabsTrigger>
            <TabsTrigger value="ALL">ALL</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="p-4">
                  <CardDescription>Balance</CardDescription>
                  <CardTitle className="text-2xl">
                    {formatCurrency(stats.total_balance)}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardDescription>Day Change</CardDescription>
                  <div className="flex items-baseline gap-2">
                    <CardTitle className={`text-2xl ${stats.change_1_day >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {formatCurrency(stats.change_1_day)}
                    </CardTitle>
                  </div>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <TabsContent value="1W">
                    <CardDescription>Period Change (1W)</CardDescription>
                    <div className="flex items-baseline gap-2">
                      <CardTitle className={`text-2xl ${stats.change_1_week >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {formatCurrency(stats.change_1_week)}
                      </CardTitle>
                    </div>
                  </TabsContent>
                  <TabsContent value="1M">
                    <CardDescription>Period Change (1M)</CardDescription>
                    <div className="flex items-baseline gap-2">
                      <CardTitle className={`text-2xl ${stats.change_1_month >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {formatCurrency(stats.change_1_month)}
                      </CardTitle>
                    </div>
                  </TabsContent>
                  <TabsContent value="3M">
                    <CardDescription>Period Change (3M)</CardDescription>
                    <div className="flex items-baseline gap-2">
                      <CardTitle className={`text-2xl ${stats.change_3_months >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {formatCurrency(stats.change_3_months)}
                      </CardTitle>
                    </div>
                  </TabsContent>
                  <TabsContent value="1Y">
                    <CardDescription>Period Change (1Y)</CardDescription>
                    <div className="flex items-baseline gap-2">
                      <CardTitle className={`text-2xl ${stats.change_1_year >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {formatCurrency(stats.change_1_year)}
                      </CardTitle>
                    </div>
                  </TabsContent>
                  <TabsContent value="ALL">
                    <CardDescription>Period Change (ALL)</CardDescription>
                    <div className="flex items-baseline gap-2">
                      <CardTitle className={`text-2xl ${stats.change_all_time >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {formatCurrency(stats.change_all_time)}
                      </CardTitle>
                    </div>
                  </TabsContent>
                </CardHeader>
              </Card>
            </div>
          </div>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default AccountsStats;
