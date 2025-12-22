// Mock Authentication Service - Replace with actual API calls
interface User {
  id: string
  email: string
  name: string
}

class AuthService {
  private mockUsers = [{ id: "1", email: "demo@example.com", password: "demo123", name: "Demo User" }]

  async login(email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = this.mockUsers.find((u) => u.email === email && u.password === password)
    if (!user) {
      throw new Error("Invalid credentials")
    }

    // Store in localStorage (in production, use secure HTTP-only cookies)
    localStorage.setItem("authToken", `token-${user.id}`)
    localStorage.setItem("user", JSON.stringify(user))

    return { id: user.id, email: user.email, name: user.name }
  }

  async signup(name: string, email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
    }

    this.mockUsers.push(newUser)
    localStorage.setItem("authToken", `token-${newUser.id}`)
    localStorage.setItem("user", JSON.stringify(newUser))

    return { id: newUser.id, email: newUser.email, name: newUser.name }
  }

  logout(): void {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  }
}

export const authService = new AuthService()
