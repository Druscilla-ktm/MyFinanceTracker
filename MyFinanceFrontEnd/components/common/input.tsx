"use client"

import type React from "react"

interface InputProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  className?: string
  name?: string
}

export function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
  className = "",
  name,
}: InputProps) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
    />
  )
}
