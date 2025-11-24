"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoutesHeader } from "@/components/routes/routes-header"
import { TelefericoView } from "@/components/routes/teleferico-view"
import { MinibusView } from "@/components/routes/minibus-view"

export default function RutasPage() {
  return (
    <div className="space-y-6">
      <RoutesHeader />
      <Tabs defaultValue="telefericos" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="telefericos">Teleféricos</TabsTrigger>
          <TabsTrigger value="minibuses">Minibuses</TabsTrigger>
        </TabsList>
        <TabsContent value="telefericos" className="space-y-4">
          <TelefericoView />
        </TabsContent>
        <TabsContent value="minibuses" className="space-y-4">
          <MinibusView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
