"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, MessageSquare, TrendingUp, Clock } from "lucide-react"

interface AIInsight {
  id: string
  type: "mood" | "recommendation" | "transcript" | "trend"
  title: string
  content: string
  timestamp: Date
  confidence: number
}

export function AIInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([])

  useEffect(() => {
    // Simulación de insights de IA
    const mockInsights: AIInsight[] = [
      {
        id: "1",
        type: "mood",
        title: "Mood Analysis",
        content:
          "Based on your listening patterns, you prefer upbeat music in the morning and ambient sounds during work hours. AI has adjusted your recommendations accordingly.",
        timestamp: new Date(),
        confidence: 0.89,
      },
      {
        id: "2",
        type: "transcript",
        title: "Latest Program Summary",
        content:
          "Morning Talk Show discussed new music releases, interviewed indie artist Sarah Chen about her upcoming album, and covered local music events happening this weekend.",
        timestamp: new Date(Date.now() - 3600000),
        confidence: 0.95,
      },
      {
        id: "3",
        type: "recommendation",
        title: "New Discovery",
        content:
          "AI found 3 new artists similar to your recent favorites. These tracks have a 94% match with your taste profile.",
        timestamp: new Date(Date.now() - 7200000),
        confidence: 0.94,
      },
    ]

    setInsights(mockInsights)
  }, [])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "mood":
        return <Brain className="w-5 h-5 text-green-400" />
      case "transcript":
        return <MessageSquare className="w-5 h-5 text-blue-400" />
      case "recommendation":
        return <TrendingUp className="w-5 h-5 text-yellow-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "mood":
        return "bg-green-500/20"
      case "transcript":
        return "bg-blue-500/20"
      case "recommendation":
        return "bg-yellow-500/20"
      default:
        return "bg-gray-500/20"
    }
  }

  return (
    <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Brain className="w-6 h-6 text-green-400" />
          <span>AI Insights & Analysis</span>
          <Badge className="bg-green-400/20 text-green-300">Live Updates</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className={`p-4 ${getInsightColor(insight.type)} rounded-lg`}>
              <div className="flex items-start space-x-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-2">{insight.title}</h4>
                  <p className="text-gray-200 text-sm mb-3">{insight.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Confidence: {Math.round(insight.confidence * 100)}%</span>
                    <Button size="sm" variant="ghost" className="text-gray-300 hover:bg-white/10">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
