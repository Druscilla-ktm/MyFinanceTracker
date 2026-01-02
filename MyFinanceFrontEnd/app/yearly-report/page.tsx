"use client"

import { useState } from "react"
import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, PieChartIcon } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { mockDataService } from "@/services/mock-data-service"

type ReportPeriod = "weekly" | "monthly" | "yearly"

const COLORS = [
  "#10b981", // Emerald green
  "#0d9488", // Teal
  "#f59e0b", // Amber
  "#eab308", // Yellow
  "#8b5cf6", // Purple
]

export default function YearlyReportPage() {
  const [period, setPeriod] = useState<ReportPeriod>("yearly")
  const yearlyData = mockDataService.getYearlyReport()

  // Generate data based on selected period
  const getReportData = () => {
    switch (period) {
      case "weekly":
        return {
          title: "Weekly Report",
          totalIncome: 1375,
          totalExpenses: 800,
          netSavings: 575,
          trend: [
            { label: "Mon", income: 275, expenses: 120 },
            { label: "Tue", income: 0, expenses: 80 },
            { label: "Wed", income: 0, expenses: 150 },
            { label: "Thu", income: 0, expenses: 90 },
            { label: "Fri", income: 1100, expenses: 200 },
            { label: "Sat", income: 0, expenses: 100 },
            { label: "Sun", income: 0, expenses: 60 },
          ],
        }
      case "monthly":
        return {
          title: "Monthly Report",
          totalIncome: 5500,
          totalExpenses: 3200,
          netSavings: 2300,
          trend: [
            { label: "Week 1", income: 1375, expenses: 800 },
            { label: "Week 2", income: 1375, expenses: 850 },
            { label: "Week 3", income: 1375, expenses: 750 },
            { label: "Week 4", income: 1375, expenses: 800 },
          ],
        }
      case "yearly":
      default:
        return {
          title: "Yearly Report",
          totalIncome: yearlyData.totalIncome,
          totalExpenses: yearlyData.totalExpenses,
          netSavings: yearlyData.netSavings,
          trend: yearlyData.monthlyTrend,
        }
    }
  }

  const reportData = getReportData()
  const savingsRate = ((reportData.netSavings / reportData.totalIncome) * 100).toFixed(1)

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Financial Summary</h1>
            <p className="text-muted-foreground mt-1">Comprehensive financial reports and analytics</p>
          </div>
          <Select value={period} onValueChange={(value: ReportPeriod) => setPeriod(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">${reportData.totalIncome.toLocaleString()}</div>
              <Badge variant="outline" className="mt-2 text-xs">
                {reportData.title}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-danger" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-danger">${reportData.totalExpenses.toLocaleString()}</div>
              <Badge variant="outline" className="mt-2 text-xs">
                {reportData.title}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${reportData.netSavings.toLocaleString()}</div>
              <Badge variant="outline" className="mt-2 text-xs">
                {reportData.title}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{savingsRate}%</div>
              <p className="text-xs text-muted-foreground mt-2">Of total income</p>
            </CardContent>
          </Card>
        </div>

        {/* Income vs Expenses Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={reportData.trend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey={period === "yearly" ? "month" : "label"}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
                <Area
                  type="monotone"
                  dataKey="income"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.7}
                  name="Income"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stackId="2"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.7}
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Yearly-specific data */}
        {period === "yearly" && (
          <>
            {/* Cumulative Savings */}
            <Card>
              <CardHeader>
                <CardTitle>Cumulative Savings Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={yearlyData.cumulativeSavings}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                    <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
                    <Line
                      type="monotone"
                      dataKey="savings"
                      stroke="#0d9488"
                      strokeWidth={3}
                      dot={{ fill: "#0d9488", r: 4 }}
                      name="Total Savings"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={yearlyData.categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {yearlyData.categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Spending Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={yearlyData.categoryBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis
                        dataKey="category"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))",
                        }}
                      />
                      <Bar dataKey="amount" fill="#0d9488" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 border border-border rounded-lg">
                <TrendingUp className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Strong Savings Rate</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    You're saving {savingsRate}% of your income, which is excellent! Keep up the good work.
                  </p>
                </div>
              </div>
              {Number.parseFloat(savingsRate) < 20 && (
                <div className="flex items-start gap-3 p-4 border border-warning bg-warning/10 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-warning mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-warning">Improve Savings Rate</h4>
                    <p className="text-sm text-warning mt-1">
                      Consider reducing expenses in high-spending categories to increase your savings rate to at least
                      20%.
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3 p-4 border border-border rounded-lg">
                <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Financial Progress</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your total savings for this {period} period is ${reportData.netSavings.toLocaleString()}. Stay
                    consistent with your financial goals!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
