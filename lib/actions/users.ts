"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import type { NewUser } from "@/types"

export async function getUsers() {
  try {
    const data = await db.select().from(users).orderBy(desc(users.createdAt))
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { success: false, error: "Failed to fetch users" }
  }
}

export async function createUser(userData: NewUser) {
  try {
    await db.insert(users).values(userData)
    revalidatePath("/dashboard/usuarios")
    return { success: true }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, error: "Failed to create user" }
  }
}

export async function updateUser(id: string, userData: Partial<NewUser>) {
  try {
    await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
    revalidatePath("/dashboard/usuarios")
    return { success: true }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, error: "Failed to update user" }
  }
}

export async function deleteUser(id: string) {
  try {
    await db.delete(users).where(eq(users.id, id))
    revalidatePath("/dashboard/usuarios")
    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: "Failed to delete user" }
  }
}
