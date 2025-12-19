"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ProgressLineProps {
  data: Array<{ name: string; savings: number; target: number }>
}

export function ProgressLine({ data }: ProgressLineProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "0.5rem",
          }}
        />
        <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
        <Line
          type="monotone"
          dataKey="target"
          stroke="#14b8a6"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: "#14b8a6" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
