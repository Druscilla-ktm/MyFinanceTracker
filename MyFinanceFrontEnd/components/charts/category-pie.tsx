"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface CategoryPieProps {
  data: Array<{ name: string; value: number }>
}

export function CategoryPie({ data }: CategoryPieProps) {
  const COLORS = ["#0f766e", "#10b981", "#14b8a6", "#f59e0b", "#ef4444", "#3b82f6"]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: $${value}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
      </PieChart>
    </ResponsiveContainer>
  )
}
