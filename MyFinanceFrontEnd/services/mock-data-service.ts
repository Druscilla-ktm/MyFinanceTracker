// Mock Data Service - Provides realistic test data

class MockDataService {
  getUser() {
    return {
      id: "1",
      name: "Alex Johnson",
      email: "alex@example.com",
      totalBalance: 24500,
    }
  }

  getMonthlyStats() {
    return {
      income: 5500,
      expenses: 3200,
      savings: 2300,
      monthlyData: [
        { name: "Week 1", income: 1375, expenses: 800 },
        { name: "Week 2", income: 1375, expenses: 850 },
        { name: "Week 3", income: 1375, expenses: 750 },
        { name: "Week 4", income: 1375, expenses: 800 },
      ],
    }
  }

  getCategorySpending() {
    return [
      { name: "Groceries", value: 450 },
      { name: "Transport", value: 320 },
      { name: "Entertainment", value: 280 },
      { name: "Utilities", value: 180 },
      { name: "Shopping", value: 520 },
      { name: "Healthcare", value: 450 },
    ]
  }

  getTransactions() {
    return [
      {
        id: "1",
        description: "Salary",
        amount: 5500,
        category: "Income",
        date: "2024-01-01",
        type: "income" as const,
        recurring: true,
      },
      {
        id: "2",
        description: "Grocery Store",
        amount: 85.5,
        category: "Food",
        date: "2024-01-15",
        type: "expense" as const,
        recurring: false,
      },
      {
        id: "3",
        description: "Gas Station",
        amount: 45.0,
        category: "Transport",
        date: "2024-01-16",
        type: "expense" as const,
        recurring: false,
      },
      {
        id: "4",
        description: "Movie Tickets",
        amount: 30.0,
        category: "Entertainment",
        date: "2024-01-17",
        type: "expense" as const,
        recurring: false,
      },
      {
        id: "5",
        description: "Rent",
        amount: 1200,
        category: "Utilities",
        date: "2024-01-01",
        type: "expense" as const,
        recurring: true,
      },
    ]
  }

  getBudgets() {
    return [
      { id: "1", category: "Groceries", limit: 400, spent: 285, period: "monthly" as const, alert: false },
      { id: "2", category: "Entertainment", limit: 300, spent: 280, period: "monthly" as const, alert: true },
      { id: "3", category: "Transport", limit: 200, spent: 145, period: "monthly" as const, alert: false },
      { id: "4", category: "Dining", limit: 250, spent: 195, period: "monthly" as const, alert: false },
    ]
  }

  getSavingsGoals() {
    return [
      { id: "1", name: "Emergency Fund", targetAmount: 5000, currentAmount: 3500, deadline: "2025-06-01", emoji: "🏦" },
      { id: "2", name: "Vacation", targetAmount: 2000, currentAmount: 1200, deadline: "2025-07-15", emoji: "✈️" },
      { id: "3", name: "New Laptop", targetAmount: 1500, currentAmount: 800, deadline: "2025-03-01", emoji: "💻" },
    ]
  }

  getDebts() {
    return [
      {
        id: "1",
        creditor: "Bank of America",
        amount: 5000,
        interestRate: 4.5,
        dueDate: "2025-02-15",
        status: "active" as const,
        category: "loan" as const,
      },
      {
        id: "2",
        creditor: "Credit Card - Chase",
        amount: 1200,
        interestRate: 18.5,
        dueDate: "2025-01-20",
        status: "active" as const,
        category: "credit_card" as const,
      },
      {
        id: "3",
        creditor: "Brother Mike",
        amount: 500,
        interestRate: 0,
        dueDate: "2025-02-01",
        status: "active" as const,
        category: "borrowed" as const,
      },
    ]
  }

  getSubscriptions() {
    return [
      {
        id: "1",
        name: "Netflix",
        cost: 15.99,
        renewalDate: "2025-01-20",
        frequency: "monthly" as const,
        status: "active" as const,
        category: "Entertainment",
      },
      {
        id: "2",
        name: "Spotify",
        cost: 12.99,
        renewalDate: "2025-01-25",
        frequency: "monthly" as const,
        status: "active" as const,
        category: "Entertainment",
      },
      {
        id: "3",
        name: "Adobe Creative Cloud",
        cost: 54.99,
        renewalDate: "2025-02-05",
        frequency: "monthly" as const,
        status: "active" as const,
        category: "Productivity",
      },
      {
        id: "4",
        name: "Gym Membership",
        cost: 49.99,
        renewalDate: "2025-02-01",
        frequency: "monthly" as const,
        status: "active" as const,
        category: "Health",
      },
    ]
  }

  getAlerts() {
    return [
      { id: "1", title: "Budget Alert", message: "You've reached 85% of your Entertainment budget" },
      { id: "2", title: "Upcoming Payment", message: "Your Chase Credit Card payment is due in 3 days" },
      { id: "3", title: "Subscription Reminder", message: "Adobe Creative Cloud renews in 5 days" },
    ]
  }

  getYearlyReport() {
    return {
      totalIncome: 66000,
      totalExpenses: 38400,
      netSavings: 27600,
      monthlyTrend: [
        { month: "Jan", income: 5500, expenses: 3200 },
        { month: "Feb", income: 5500, expenses: 3100 },
        { month: "Mar", income: 5500, expenses: 3300 },
        { month: "Apr", income: 5500, expenses: 3050 },
        { month: "May", income: 5500, expenses: 3150 },
        { month: "Jun", income: 5500, expenses: 3200 },
        { month: "Jul", income: 5500, expenses: 3400 },
        { month: "Aug", income: 5500, expenses: 3100 },
        { month: "Sep", income: 5500, expenses: 3250 },
        { month: "Oct", income: 5500, expenses: 3200 },
        { month: "Nov", income: 5500, expenses: 3100 },
        { month: "Dec", income: 5500, expenses: 2350 },
      ],
      cumulativeSavings: [
        { month: "Jan", savings: 2300 },
        { month: "Feb", savings: 4600 },
        { month: "Mar", savings: 6800 },
        { month: "Apr", savings: 9350 },
        { month: "May", savings: 11700 },
        { month: "Jun", savings: 14000 },
        { month: "Jul", savings: 16200 },
        { month: "Aug", savings: 18600 },
        { month: "Sep", savings: 20850 },
        { month: "Oct", savings: 23250 },
        { month: "Nov", savings: 25550 },
        { month: "Dec", savings: 27600 },
      ],
      categoryBreakdown: [
        { category: "Groceries", amount: 5400 },
        { category: "Transport", amount: 2400 },
        { category: "Entertainment", amount: 3600 },
        { category: "Utilities", amount: 10800 },
        { category: "Shopping", amount: 9600 },
        { category: "Dining", amount: 4200 },
        { category: "Healthcare", amount: 2400 },
      ],
    }
  }
}

export const mockDataService = new MockDataService()
