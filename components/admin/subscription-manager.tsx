"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Crown,
  Search,
  TrendingUp,
  DollarSign,
  Users,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { supabase, type Subscription } from "@/lib/supabase"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription"

export function SubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [planFilter, setPlanFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [stats, setStats] = useState({
    total_revenue: 0,
    active_subscriptions: 0,
    cancelled_subscriptions: 0,
    churn_rate: 0,
  })

  useEffect(() => {
    loadSubscriptions()
    loadStats()
  }, [])

  const loadSubscriptions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("subscriptions")
        .select(`
          *,
          profiles (
            full_name,
            email,
            avatar_url
          )
        `)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })

      if (error) throw error

      setSubscriptions(data || [])
    } catch (error) {
      console.error("Error loading subscriptions:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      // Calculate stats from subscriptions
      const { data, error } = await supabase
        .from("subscriptions")
        .select("plan, status, created_at, current_period_end")
        .is("deleted_at", null)

      if (error) throw error

      const activeSubscriptions = data.filter((s) => s.status === "active").length
      const cancelledSubscriptions = data.filter((s) => s.status === "cancelled").length
      const totalRevenue = data
        .filter((s) => s.status === "active")
        .reduce((sum, sub) => {
          const plan = SUBSCRIPTION_PLANS.find((p) => p.id === sub.plan)
          return sum + (plan?.price || 0)
        }, 0)

      const churnRate = data.length > 0 ? (cancelledSubscriptions / data.length) * 100 : 0

      setStats({
        total_revenue: totalRevenue,
        active_subscriptions: activeSubscriptions,
        cancelled_subscriptions: cancelledSubscriptions,
        churn_rate: churnRate,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const updateSubscriptionStatus = async (subscriptionId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({
          status: newStatus,
          cancelled_at: newStatus === "cancelled" ? new Date().toISOString() : null,
        })
        .eq("id", subscriptionId)

      if (error) throw error

      setSubscriptions(
        subscriptions.map((sub) => (sub.id === subscriptionId ? { ...sub, status: newStatus as any } : sub)),
      )

      loadStats() // Refresh stats
    } catch (error) {
      console.error("Error updating subscription:", error)
    }
  }

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const user = subscription.profiles
    const matchesSearch =
      user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPlan = planFilter === "all" || subscription.plan === planFilter
    const matchesStatus = statusFilter === "all" || subscription.status === statusFilter

    return matchesSearch && matchesPlan && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400"
      case "cancelled":
        return "bg-yellow-500/20 text-yellow-400"
      case "expired":
        return "bg-red-500/20 text-red-400"
      case "pending":
        return "bg-blue-500/20 text-blue-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "premium":
        return "bg-yellow-500/20 text-yellow-400"
      case "family":
        return "bg-purple-500/20 text-purple-400"
      case "free":
        return "bg-gray-500/20 text-gray-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Subscription Management</h2>
          <p className="text-gray-400">Manage user subscriptions and billing</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-gray-600 text-white bg-transparent">
            <TrendingUp className="w-4 h-4 mr-2" />
            Revenue Report
          </Button>
          <Button onClick={loadStats} className="bg-green-500 hover:bg-green-600">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="plans">Plan Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(stats.total_revenue)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-xs text-green-400 mt-1">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Subscriptions</p>
                    <p className="text-2xl font-bold text-white">{stats.active_subscriptions}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-xs text-green-400 mt-1">+8% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Cancelled</p>
                    <p className="text-2xl font-bold text-white">{stats.cancelled_subscriptions}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-xs text-red-400 mt-1">+3% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Churn Rate</p>
                    <p className="text-2xl font-bold text-white">{stats.churn_rate.toFixed(1)}%</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-yellow-400" />
                </div>
                <p className="text-xs text-yellow-400 mt-1">-1.2% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart Placeholder */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <p>Revenue chart would be displayed here</p>
                  <p className="text-sm">Integration with charting library needed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          {/* Filters */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Subscriptions Table */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Crown className="w-5 h-5 mr-2" />
                Subscriptions ({filteredSubscriptions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-gray-400">Loading subscriptions...</div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-400">User</TableHead>
                      <TableHead className="text-gray-400">Plan</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Period</TableHead>
                      <TableHead className="text-gray-400">Revenue</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.map((subscription) => {
                      const user = subscription.profiles
                      const plan = SUBSCRIPTION_PLANS.find((p) => p.id === subscription.plan)

                      return (
                        <TableRow key={subscription.id} className="border-gray-700 hover:bg-gray-700/50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                                {user?.avatar_url ? (
                                  <img
                                    src={user.avatar_url || "/placeholder.svg"}
                                    alt={user.full_name || ""}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Users className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <div className="text-white font-medium">{user?.full_name || "No name"}</div>
                                <div className="text-gray-400 text-sm">{user?.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPlanColor(subscription.plan)}>
                              {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(subscription.status)}>{subscription.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-gray-300">
                              {subscription.current_period_start && (
                                <div className="text-sm">
                                  {new Date(subscription.current_period_start).toLocaleDateString()} -
                                  {subscription.current_period_end &&
                                    new Date(subscription.current_period_end).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">{formatCurrency(plan?.price || 0)}</TableCell>
                          <TableCell>
                            <Select
                              value={subscription.status}
                              onValueChange={(value) => updateSubscriptionStatus(subscription.id, value)}
                            >
                              <SelectTrigger className="w-28 h-8 bg-gray-700 border-gray-600 text-white text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <Card key={plan.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>{plan.name}</span>
                    <Badge className={getPlanColor(plan.id)}>
                      {formatCurrency(plan.price)}/{plan.interval}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <h4 className="text-white font-medium mb-2">Limits</h4>
                    <div className="space-y-1 text-sm text-gray-400">
                      <div>
                        Skips: {plan.limits.skips_per_hour === -1 ? "Unlimited" : `${plan.limits.skips_per_hour}/hour`}
                      </div>
                      <div>
                        Downloads:{" "}
                        {plan.limits.downloads_per_month === -1
                          ? "Unlimited"
                          : `${plan.limits.downloads_per_month}/month`}
                      </div>
                      <div>Quality: {plan.limits.audio_quality}</div>
                      <div>
                        AI Generations:{" "}
                        {plan.limits.ai_generations_per_day === -1
                          ? "Unlimited"
                          : `${plan.limits.ai_generations_per_day}/day`}
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full border-gray-600 text-white bg-transparent">
                    Edit Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
