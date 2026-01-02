"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit2, Trash2, Target, Calendar } from "lucide-react"
import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { mockDataService } from "@/services/mock-data-service"

interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  emoji: string
}

export default function SavingsGoalsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>(mockDataService.getSavingsGoals())
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null)
  const [formData, setFormData] = useState<Partial<SavingsGoal>>({
    name: "",
    targetAmount: 0,
    currentAmount: 0,
    deadline: "",
    emoji: "🎯",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingGoal) {
      setGoals(goals.map((g) => (g.id === editingGoal.id ? { ...editingGoal, ...formData } : g)))
      setEditingGoal(null)
    } else {
      const newGoal: SavingsGoal = {
        id: Date.now().toString(),
        name: formData.name || "",
        targetAmount: formData.targetAmount || 0,
        currentAmount: formData.currentAmount || 0,
        deadline: formData.deadline || "",
        emoji: formData.emoji || "🎯",
      }
      setGoals([...goals, newGoal])
    }
    setIsAddDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      targetAmount: 0,
      currentAmount: 0,
      deadline: "",
      emoji: "🎯",
    })
  }

  const handleEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal)
    setFormData(goal)
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id))
  }

  const getPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getDaysRemaining = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const overallPercentage = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Savings Goals</h1>
            <p className="text-muted-foreground mt-1">Set and track your financial goals</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingGoal ? "Edit Goal" : "Create New Goal"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Goal Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Emergency Fund, Vacation"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emoji">Emoji</Label>
                  <Input
                    id="emoji"
                    placeholder="🎯"
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    maxLength={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAmount">Target Amount</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: Number.parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentAmount">Current Amount</Label>
                  <Input
                    id="currentAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({ ...formData, currentAmount: Number.parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Target Date</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingGoal ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Target</p>
                <p className="text-2xl font-bold text-foreground">${totalTarget.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Savings</p>
                <p className="text-2xl font-bold text-success">${totalCurrent.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completion</p>
                <p className="text-2xl font-bold text-primary">{overallPercentage.toFixed(0)}%</p>
              </div>
            </div>
            <Progress value={overallPercentage} className="h-3" />
          </CardContent>
        </Card>

        {/* Goals List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const percentage = getPercentage(goal.currentAmount, goal.targetAmount)
            const remaining = goal.targetAmount - goal.currentAmount
            const daysRemaining = getDaysRemaining(goal.deadline)

            return (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{goal.emoji}</span>
                      <div>
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          {daysRemaining > 0 ? `${daysRemaining} days left` : "Deadline passed"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(goal)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(goal.id)}
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
                        ${goal.currentAmount.toFixed(2)} of ${goal.targetAmount.toFixed(2)}
                      </span>
                      <span className="font-semibold text-primary">{percentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={percentage} />
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-sm text-muted-foreground">Remaining:</span>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${remaining.toFixed(2)}</p>
                      {percentage >= 100 && (
                        <Badge variant="outline" className="text-xs text-success border-success mt-1">
                          <Target className="h-3 w-3 mr-1" />
                          Achieved!
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {goals.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No savings goals yet. Click "Add Goal" to start saving!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
