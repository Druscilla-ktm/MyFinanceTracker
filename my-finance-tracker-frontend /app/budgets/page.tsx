"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit2, Trash2, AlertTriangle, TrendingUp } from "lucide-react"
import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { mockDataService } from "@/services/mock-data-service"
import { useCurrency } from "@/contexts/currency-context"

interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  period: "weekly" | "monthly" | "yearly"
  alert: boolean
}

export default function BudgetsPage() {
  const { formatAmount } = useCurrency()
  const [budgets, setBudgets] = useState<Budget[]>(mockDataService.getBudgets())
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [formData, setFormData] = useState<Partial<Budget>>({
    category: "",
    limit: 0,
    spent: 0,
    period: "monthly",
    alert: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingBudget) {
      setBudgets(budgets.map((b) => (b.id === editingBudget.id ? { ...editingBudget, ...formData } : b)))
      setEditingBudget(null)
    } else {
      const newBudget: Budget = {
        id: Date.now().toString(),
        category: formData.category || "",
        limit: formData.limit || 0,
        spent: formData.spent || 0,
        period: formData.period || "monthly",
        alert: (formData.spent || 0) / (formData.limit || 1) >= 0.8,
      }
      setBudgets([...budgets, newBudget])
    }
    setIsAddDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      category: "",
      limit: 0,
      spent: 0,
      period: "monthly",
      alert: false,
    })
  }

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget)
    setFormData(budget)
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setBudgets(budgets.filter((b) => b.id !== id))
  }

  const getPercentage = (spent: number, limit: number) => {
    return Math.min((spent / limit) * 100, 100)
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-danger"
    if (percentage >= 80) return "bg-warning"
    return "bg-success"
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const alertCount = budgets.filter((b) => b.alert).length

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Budgets</h1>
            <p className="text-muted-foreground mt-1">Set spending limits and track your progress</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingBudget ? "Edit Budget" : "Create New Budget"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Groceries, Entertainment"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="limit">Budget Limit</Label>
                  <Input
                    id="limit"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.limit}
                    onChange={(e) => setFormData({ ...formData, limit: Number.parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spent">Current Spending</Label>
                  <Input
                    id="spent"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.spent}
                    onChange={(e) => setFormData({ ...formData, spent: Number.parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Budget Period</Label>
                  <Select
                    value={formData.period}
                    onValueChange={(value: "weekly" | "monthly" | "yearly") =>
                      setFormData({ ...formData, period: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingBudget ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Alerts */}
        {alertCount > 0 && (
          <Alert className="border-warning bg-warning/10">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning">
              You have {alertCount} budget{alertCount > 1 ? "s" : ""} that exceeded 80% of the limit!
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatAmount(totalBudget)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatAmount(totalSpent)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalBudget - totalSpent >= 0 ? "text-success" : "text-danger"}`}>
                {formatAmount(totalBudget - totalSpent)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget List */}
        <div className="grid gap-4 md:grid-cols-2">
          {budgets.map((budget) => {
            const percentage = getPercentage(budget.spent, budget.limit)
            const remaining = budget.limit - budget.spent

            return (
              <Card key={budget.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{budget.category}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {budget.period}
                        </Badge>
                        {budget.alert && (
                          <Badge variant="outline" className="text-xs text-warning border-warning">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Alert
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(budget)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(budget.id)}
                        className="text-danger hover:text-danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {formatAmount(budget.spent)} of {formatAmount(budget.limit)}
                      </span>
                      <span className={percentage >= 80 ? "text-danger font-semibold" : "text-muted-foreground"}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={percentage} className={getProgressColor(percentage)} />
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-border">
                    <span className="text-muted-foreground">Remaining:</span>
                    <span className={`font-semibold ${remaining >= 0 ? "text-success" : "text-danger"}`}>
                      {formatAmount(remaining)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {budgets.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No budgets created yet. Click "Add Budget" to get started!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
