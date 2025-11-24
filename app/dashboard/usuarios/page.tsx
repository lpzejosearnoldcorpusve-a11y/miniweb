import { UsersHeader } from "@/components/users/users-header"
import { UsersTable } from "@/components/users/users-table"
import { getUsers } from "@/lib/actions/users"

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  const { data: users = [] } = await getUsers()

  return (
    <div className="space-y-6">
      <UsersHeader />
      <UsersTable users={users || []} />
    </div>
  )
}