"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, History, Info, Recycle, Package, AlertTriangle } from "lucide-react"
import { getUserHistory } from "@/app/actions"
import ScannerComponent from "@/components/scanner-component"
import HistoryList from "@/components/history-list"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("scan")
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === "history") {
      loadHistory()
    }
  }, [activeTab])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const data = await getUserHistory()
      setHistory(data)
    } catch (error) {
      console.error("Failed to load history:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleScanComplete = async (result: any) => {
    // Refresh history after a successful scan
    if (result) {
      await loadHistory()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-green-500 to-teal-500 py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">MediDispose</h1>
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

        <Tabs defaultValue="scan" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="scan" className="text-lg py-3">
              <Upload className="mr-2 h-5 w-5" /> Scan Medicine
            </TabsTrigger>
            <TabsTrigger value="history" className="text-lg py-3">
              <History className="mr-2 h-5 w-5" /> Scan History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="mt-0">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <ScannerComponent onScanComplete={handleScanComplete} />
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="mr-2 h-5 w-5 text-blue-500" />
                      Disposal Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Recycle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <h3 className="font-medium">Recycle</h3>
                        <p className="text-sm text-gray-600">
                          Empty plastic medicine bottles can be recycled with regular plastics.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Package className="h-5 w-5 text-amber-500 mt-1" />
                      <div>
                        <h3 className="font-medium">Pharmacy Drop-Off</h3>
                        <p className="text-sm text-gray-600">
                          Many pharmacies accept unused medications for proper disposal.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-1" />
                      <div>
                        <h3 className="font-medium">Hazardous Waste</h3>
                        <p className="text-sm text-gray-600">
                          Some medications require special handling at hazardous waste facilities.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Why Proper Disposal Matters</CardTitle>
                    <CardDescription>
                      Improper medication disposal can harm the environment and pose risks to public health.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      When medications are flushed or thrown in the trash, they can contaminate water supplies and harm
                      wildlife. Using our AI-powered system ensures you're disposing of medicines in the safest way
                      possible.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <HistoryList history={history} loading={loading} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

