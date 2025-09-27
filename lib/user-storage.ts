// Shared user storage - in production, this would be a real database
interface User {
  id: number
  username: string
  password: string
  role: "admin" | "practitioner" | "assistant"
  email: string
  fullName: string
}

// Initial users
let users: User[] = [
  { 
    id: 1,
    username: "admin", 
    password: "admin123", 
    role: "admin",
    email: "admin@ahaarwise.com",
    fullName: "System Administrator"
  },
  { 
    id: 2,
    username: "doctor", 
    password: "doctor123", 
    role: "practitioner",
    email: "doctor@ahaarwise.com",
    fullName: "Dr. Ayurved Practitioner"
  },
  { 
    id: 3,
    username: "assistant", 
    password: "assist123", 
    role: "assistant",
    email: "assistant@ahaarwise.com",
    fullName: "Clinical Assistant"
  }
]

export function getAllUsers(): User[] {
  return users
}

export function findUserByUsername(username: string): User | undefined {
  return users.find(u => u.username === username)
}

export function findUserByEmail(email: string): User | undefined {
  return users.find(u => u.email === email)
}

export function findUserByCredentials(username: string, password: string): User | undefined {
  return users.find(u => u.username === username && u.password === password)
}

export function addUser(userData: Omit<User, 'id'>): User {
  const newUser: User = {
    ...userData,
    id: Math.max(...users.map(u => u.id), 0) + 1
  }
  users.push(newUser)
  return newUser
}

export function getUserById(id: number): User | undefined {
  return users.find(u => u.id === id)
}