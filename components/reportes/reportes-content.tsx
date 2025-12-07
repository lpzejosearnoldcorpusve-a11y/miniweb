"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportesHeader } from "./reportes-header"
import { ReportesEstadisticas } from "./reportes-estadisticas"
import { ReportesTable } from "./reportes-table"
import { ReportesHistorial } from "./reportes-historial"
import { InfraccionesPanel } from "./infracciones-panel"

export function ReportesContent() {
  const [activeTab, setActiveTab] = useState("reportes")

  return (
    <div className="flex flex-col gap-6">
      <ReportesHeader />
      <ReportesEstadisticas />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
          <TabsTrigger value="infracciones">Infracciones</TabsTrigger>
        </TabsList>

        <TabsContent value="reportes" className="mt-4">
          <ReportesTable />
        </TabsContent>

        <TabsContent value="historial" className="mt-4">
          <ReportesHistorial />
        </TabsContent>

        <TabsContent value="infracciones" className="mt-4">
          <InfraccionesPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
