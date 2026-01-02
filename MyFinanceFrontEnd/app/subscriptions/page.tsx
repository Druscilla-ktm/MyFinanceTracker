"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit2, Trash2, Calendar, Bell, DollarSign } from "lucide-react"
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

interface Subscription {
  id: string
  name: string
  cost: number
  renewalDate: string
  frequency: "monthly" | "yearly"
  status: "active" | "cancelled"
  category: string
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockDataService.getSubscriptions())
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const [formData, setFormData] = useState<Partial<Subscription>>({
    name: "",
    cost: 0,
    renewalDate: "",
    frequency: "monthly",
    status: "active",
    category: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingSubscription) {
      setSubscriptions(
        subscriptions.map((s) => (s.id === editingSubscription.id ? { ...editingSubscription, ...formData } : s)),
      )
      setEditingSubscription(null)
    } else {
      const newSubscription: Subscription = {
        id: Date.now().toString(),
        name: formData.name || "",
        cost: formData.cost || 0,
        renewalDate: formData.renewalDate || "",
        frequency: formData.frequency || "monthly",
        status: formData.status || "active",
        category: formData.category || "",
      }
      setSubscriptions([...subscriptions, newSubscription])
    }
    setIsAddDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      cost: 0,
      renewalDate: "",
      frequency: "monthly",
      status: "active",
      category: "",
    })
  }

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription)
    setFormData(subscription)
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setSubscriptions(subscriptions.filter((s) => s.id !== id))
  }

  const toggleStatus = (id: string) => {
    setSubscriptions(
      subscriptions.map((s) =>
        s.id === id ? { ...s, status: s.status === "active" ? ("cancelled" as const) : ("active" as const) } : s,
      ),
    )
  }

  const getDaysUntilRenewal = (renewalDate: string) => {
    const today = new Date()
    const renewal = new Date(renewalDate)
    const diffTime = renewal.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const activeSubscriptions = subscriptions.filter((s) => s.status === "active")
  const monthlyTotal = activeSubscriptions.filter((s) => s.frequency === "monthly").reduce((sum, s) => sum + s.cost, 0)
  const yearlyTotal = activeSubscriptions.filter((s) => s.frequency === "yearly").reduce((sum, s) => sum + s.cost, 0)
  const totalMonthlyCost = monthlyTotal + yearlyTotal / 12
  const upcomingRenewals = activeSubscriptions.filter((s) => getDaysUntilRenewal(s.renewalDate) <= 7)

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Subscriptions</h1>
            <p className="text-muted-foreground mt-1">Track your recurring subscriptions and renewals</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Subscription
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingSubscription ? "Edit Subscription" : "Add New Subscription"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Subscription Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Netflix, Spotify"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: Number.parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Billing Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value: "monthly" | "yearly") => setFormData({ ...formData, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Entertainment, Productivity"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="renewalDate">Next Renewal Date</Label>
                  <Input
                    id="renewalDate"
                    type="date"
                    value={formData.renewalDate}
                    onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingSubscription ? "Update" : "Add"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Renewal Alerts */}
        {upcomingRenewals.length > 0 && (
          <Alert className="border-info bg-info/10">
            <Bell className="h-4 w-4 text-info" />
            <AlertDescription className="text-info">
              {upcomingRenewals.length} subscription{upcomingRenewals.length > 1 ? "s" : ""} renewing within 7 days!
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${totalMonthlyCost.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Average per month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{activeSubscriptions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yearly Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${(totalMonthlyCost * 12).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Estimated annual cost</p>
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions List */}
        <div className="grid gap-4 md:grid-cols-2">
          {subscriptions.map((subscription) => {
            const daysUntilRenewal = getDaysUntilRenewal(subscription.renewalDate)
            const isRenewingSoon = daysUntilRenewal <= 7 && daysUntilRenewal >= 0

            return (
              <Card key={subscription.id} className={subscription.status === "cancelled" ? "opacity-60" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{subscription.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {subscription.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {subscription.frequency}
                        </Badge>
                        {subscription.status === "cancelled" && (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            Cancelled
                          </Badge>
                        )}
                        {isRenewingSoon && subscription.status === "active" && (
                          <Badge variant="outline" className="text-xs text-info border-info">
                            <Bell className="h-3 w-3 mr-1" />
                            Renewing Soon
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(subscription)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(subscription.id)}
                        className="text-danger hover:text-danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Cost</p>
                      <p className="text-lg font-bold text-foreground">${subscription.cost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Next Renewal</p>
                      <p className="text-sm font-semibold text-foreground">
                        {new Date(subscription.renewalDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">{daysUntilRenewal} days</p>
                    </div>
                  </div>
                  <Button
                    variant={subscription.status === "active" ? "outline" : "default"}
                    onClick={() => toggleStatus(subscription.id)}
                    className="w-full"
                  >
                    {subscription.status === "active" ? "Cancel Subscription" : "Reactivate"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {subscriptions.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No subscriptions tracked. Click "Add Subscription" to start!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
