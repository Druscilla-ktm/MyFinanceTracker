"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit2, Trash2, AlertCircle, Calendar, TrendingDown } from "lucide-react"
import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { mockDataService } from "@/services/mock-data-service"

interface Debt {
  id: string
  creditor: string
  amount: number
  interestRate: number
  dueDate: string
  status: "active" | "paid"
  category: "loan" | "credit_card" | "borrowed"
}

export default function DebtTrackingPage() {
  const [debts, setDebts] = useState<Debt[]>(mockDataService.getDebts())
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null)
  const [formData, setFormData] = useState<Partial<Debt>>({
    creditor: "",
    amount: 0,
    interestRate: 0,
    dueDate: "",
    status: "active",
    category: "loan",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingDebt) {
      setDebts(debts.map((d) => (d.id === editingDebt.id ? { ...editingDebt, ...formData } : d)))
      setEditingDebt(null)
    } else {
      const newDebt: Debt = {
        id: Date.now().toString(),
        creditor: formData.creditor || "",
        amount: formData.amount || 0,
        interestRate: formData.interestRate || 0,
        dueDate: formData.dueDate || "",
        status: formData.status || "active",
        category: formData.category || "loan",
      }
      setDebts([...debts, newDebt])
    }
    setIsAddDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      creditor: "",
      amount: 0,
      interestRate: 0,
      dueDate: "",
      status: "active",
      category: "loan",
    })
  }

  const handleEdit = (debt: Debt) => {
    setEditingDebt(debt)
    setFormData(debt)
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDebts(debts.filter((d) => d.id !== id))
  }

  const markAsPaid = (id: string) => {
    setDebts(debts.map((d) => (d.id === id ? { ...d, status: "paid" as const } : d)))
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const activeDebts = debts.filter((d) => d.status === "active")
  const totalDebt = activeDebts.reduce((sum, d) => sum + d.amount, 0)
  const upcomingPayments = activeDebts.filter((d) => getDaysUntilDue(d.dueDate) <= 7)

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Debt & Loan Tracking</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor your debts and loans</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Debt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingDebt ? "Edit Debt" : "Add New Debt"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="creditor">Creditor Name</Label>
                  <Input
                    id="creditor"
                    placeholder="e.g., Bank Name, Friend's Name"
                    value={formData.creditor}
                    onChange={(e) => setFormData({ ...formData, creditor: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({ ...formData, interestRate: Number.parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Type</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: "loan" | "credit_card" | "borrowed") =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loan">Loan</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="borrowed">Borrowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingDebt ? "Update" : "Add"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Upcoming Payments Alert */}
        {upcomingPayments.length > 0 && (
          <Alert className="border-warning bg-warning/10">
            <AlertCircle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning">
              You have {upcomingPayments.length} payment{upcomingPayments.length > 1 ? "s" : ""} due within 7 days!
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-danger">${totalDebt.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Debts</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{activeDebts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Payments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{upcomingPayments.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Debts List */}
        <div className="space-y-4">
          {debts.map((debt) => {
            const daysUntilDue = getDaysUntilDue(debt.dueDate)
            const isOverdue = daysUntilDue < 0
            const isDueSoon = daysUntilDue <= 7 && daysUntilDue >= 0

            return (
              <Card key={debt.id} className={debt.status === "paid" ? "opacity-60" : ""}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-foreground">{debt.creditor}</h3>
                        <Badge variant="outline" className="text-xs">
                          {debt.category.replace("_", " ")}
                        </Badge>
                        {debt.status === "paid" && (
                          <Badge variant="outline" className="text-xs text-success border-success">
                            Paid
                          </Badge>
                        )}
                        {isOverdue && debt.status === "active" && (
                          <Badge variant="outline" className="text-xs text-danger border-danger">
                            Overdue
                          </Badge>
                        )}
                        {isDueSoon && debt.status === "active" && (
                          <Badge variant="outline" className="text-xs text-warning border-warning">
                            Due Soon
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Amount</p>
                          <p className="font-semibold text-foreground">${debt.amount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Interest Rate</p>
                          <p className="font-semibold text-foreground">{debt.interestRate}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Due Date</p>
                          <p className="font-semibold text-foreground">{new Date(debt.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Days Until Due</p>
                          <p
                            className={`font-semibold ${
                              isOverdue ? "text-danger" : isDueSoon ? "text-warning" : "text-foreground"
                            }`}
                          >
                            {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {debt.status === "active" && (
                        <Button variant="outline" onClick={() => markAsPaid(debt.id)} className="text-success">
                          Mark Paid
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(debt)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(debt.id)}
                        className="text-danger hover:text-danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {debts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No debts tracked. Click "Add Debt" to start tracking!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
