"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Mock login - in production, this would call your Django backend
      if (email === "demo@example.com" && password === "demo123") {
        localStorage.setItem("isAuthenticated", "true")
        router.push("/dashboard")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-border/50 shadow-2xl">
          <CardContent className="p-8 space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <img src="/icon.png" alt="MyFinanceTracker Logo" className="w-50 h-50" />
              </div>
              {/* <h1 className="text-3xl font-bold text-foreground">MyFinanceTracker</h1> */}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">{error}</div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">New to MyFinanceTracker?</span>
              </div>
            </div>

            {/* Sign up link */}
            <Button variant="outline" className="w-full h-11 bg-transparent" onClick={() => router.push("/signup")}>
              Create an Account
            </Button>

            {/* Demo credentials */}
            {/*<div className="p-4 rounded-lg bg-info/10 border border-info/20 text-sm">
              <p className="font-semibold mb-2 text-foreground">Demo Account:</p>
              <div className="space-y-1 text-muted-foreground">
                <p>Email: demo@example.com</p>
                <p>Password: demo123</p>
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
