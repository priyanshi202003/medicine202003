"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Recycle, Package, AlertTriangle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface HistoryItem {
  id: string
  date: string
  method: string
  imageUrl: string
}

interface HistoryListProps {
  history: HistoryItem[]
  loading: boolean
}

export default function HistoryList({ history, loading }: HistoryListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredHistory = history.filter((item) => item.method.toLowerCase().includes(searchTerm.toLowerCase()))

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "Recycle":
        return <Recycle className="h-5 w-5 text-green-500" />
      case "Pharmacy Drop-Off":
        return <Package className="h-5 w-5 text-amber-500" />
      case "Hazardous Waste":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search by disposal method..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-green-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your scan history...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto bg-gray-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No scan history found</h3>
            <p className="text-gray-600">
              {searchTerm ? "No results match your search criteria." : "You haven't scanned any medicines yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredHistory.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="h-40 overflow-hidden">
                <img
                  src={item.imageUrl || "/placeholder.svg?height=160&width=320"}
                  alt="Medicine scan"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-base flex items-center justify-between">
                  <div className="flex items-center">
                    {getMethodIcon(item.method)}
                    <span className="ml-2">{item.method}</span>
                  </div>
                  <span className="text-sm text-gray-500 font-normal">{formatDate(item.date)}</span>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

