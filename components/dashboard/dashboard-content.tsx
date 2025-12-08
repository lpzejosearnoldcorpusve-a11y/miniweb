'use client'

import { StatsOverview } from "./stats-overview"
import { DevicesChart } from "./devices-chart"
import { RoutesCard } from "./routes-card"
import { AlertsCard } from "./alerts-card"
import { ReportsCard } from "./reports-card"
import { LiveMonitor } from "./live-monitor"
import { ConnectivityStatus } from "./connectivity-status"
import { DevicesTable } from "./devices-table"

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Panel de Control</h1>
        <p className="text-muted-foreground mt-2">
          Sistema de Movilidad Urbana - Gobierno Autónomo Municipal de La Paz
        </p>
      </div>

      {/* Stats Overview */}
      <StatsOverview />

      {/* Main Dashboard Grid */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        {/* Devices Chart - spans 2 columns */}
        <DevicesChart />

        {/* Routes Card */}
        <RoutesCard />
      </div>

      {/* Second Row */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        {/* Alerts Card */}
        <AlertsCard />

        {/* Reports Card - spans 2 columns */}
        <ReportsCard />
      </div>

      {/* Connectivity Status and Live Monitoring */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        <ConnectivityStatus />
      </div>

      {/* Devices Table in Real-time */}
      <DevicesTable />

      {/* Live Monitoring */}
      <LiveMonitor />
    </div>
  )
}
