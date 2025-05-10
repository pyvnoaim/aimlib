import { Role } from './role'

export type User = {
  id: string
  name: string
  email: string
  image: string
  role: Role
  createdAt: string
  updatedAt: string
}
