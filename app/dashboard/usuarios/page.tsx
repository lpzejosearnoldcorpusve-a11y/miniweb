import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { UsersHeader } from "@/components/users/users-header"
import { UsersTable } from "@/components/users/users-table"
import { getUsers } from "@/lib/actions/users"

export default async function UsersPage() {
  const { data: users = [] } = await getUsers()

  return (
    <DashboardShell>
      <div className="space-y-6">
        <UsersHeader />
        <UsersTable users={users || []} />
      </div>
    </DashboardShell>
  )
}
