"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Crown, Check, X, Music, Users, Headphones, Mic, Sparkles } from "lucide-react"

interface SubscriptionPlansProps {
  onClose: () => void
  currentPlan?: string
}

export function SubscriptionPlans({ onClose, currentPlan = "free" }: SubscriptionPlansProps) {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      id: "free",
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      description: "Get started with basic features",
      features: [
        { name: "Limited skips (6 per hour)", included: true },
        { name: "Ads between songs", included: true },
        { name: "Basic AI recommendations", included: true },
        { name: "Join public Jams", included: true },
        { name: "Standard audio quality", included: true },
        { name: "Create Jams", included: false },
        { name: "Unlimited skips", included: false },
        { name: "High-quality audio", included: false },
        { name: "Advanced AI features", included: false },
        { name: "Voice control", included: false },
      ],
      color: "gray",
      popular: false,
    },
    {
      id: "premium",
      name: "Premium",
      price: { monthly: 9.99, yearly: 99.99 },
      description: "Full access to all features",
      features: [
        { name: "Unlimited skips and replays", included: true },
        { name: "Ad-free listening", included: true },
        { name: "High-quality audio streaming", included: true },
        { name: "Advanced AI recommendations", included: true },
        { name: "Create unlimited Jams", included: true },
        { name: "Voice control assistant", included: true },
        { name: "Offline listening", included: true },
        { name: "Custom station creation", included: true },
        { name: "Priority support", included: true },
        { name: "Early access to new features", included: true },
      ],
      color: "green",
      popular: true,
    },
    {
      id: "family",
      name: "Family",
      price: { monthly: 14.99, yearly: 149.99 },
      description: "Premium for up to 6 family members",
      features: [
        { name: "All Premium features", included: true },
        { name: "Up to 6 accounts", included: true },
        { name: "Individual profiles", included: true },
        { name: "Family mix recommendations", included: true },
        { name: "Parental controls", included: true },
        { name: "Shared family Jams", included: true },
        { name: "Kid-safe mode", included: true },
        { name: "Usage monitoring", included: true },
        { name: "Family activity dashboard", included: true },
        { name: "Bulk playlist management", included: true },
      ],
      color: "purple",
      popular: false,
    },
  ]

  const getPrice = (plan) => {
    const price = isYearly ? plan.price.yearly : plan.price.monthly
    if (price === 0) return "Free"
    if (isYearly) return `$${price}/year`
    return `$${price}/month`
  }

  const getSavings = (plan) => {
    if (plan.price.yearly === 0) return null
    const monthlyCost = plan.price.monthly * 12
    const savings = monthlyCost - plan.price.yearly
    return Math.round(savings)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={onClose}>
              ✕
            </Button>
          </div>

          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-black" />
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2">Choose Your Plan</CardTitle>
          <p className="text-gray-400 mb-6">Unlock the full potential of AI-powered radio</p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isYearly ? "text-white" : "text-gray-400"}`}>Monthly</span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-green-500" />
            <span className={`text-sm ${isYearly ? "text-white" : "text-gray-400"}`}>
              Yearly
              <Badge className="ml-2 bg-green-500/20 text-green-300">Save 20%</Badge>
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative border-2 transition-all ${
                  plan.popular
                    ? "border-green-500 bg-green-500/5"
                    : currentPlan === plan.id
                      ? "border-blue-500 bg-blue-500/5"
                      : "border-gray-700 bg-gray-800/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-black font-medium px-3 py-1">Most Popular</Badge>
                  </div>
                )}

                {currentPlan === plan.id && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-blue-500 text-white font-medium px-3 py-1">Current Plan</Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                      plan.color === "green"
                        ? "bg-green-500"
                        : plan.color === "purple"
                          ? "bg-purple-500"
                          : "bg-gray-600"
                    }`}
                  >
                    {plan.color === "green" && <Crown className="w-6 h-6 text-black" />}
                    {plan.color === "purple" && <Users className="w-6 h-6 text-white" />}
                    {plan.color === "gray" && <Music className="w-6 h-6 text-white" />}
                  </div>

                  <CardTitle className="text-xl font-bold text-white">{plan.name}</CardTitle>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

                  <div className="mb-4">
                    <div className="text-3xl font-bold text-white">{getPrice(plan)}</div>
                    {isYearly && getSavings(plan) && (
                      <p className="text-green-400 text-sm">Save ${getSavings(plan)} per year</p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${feature.included ? "text-white" : "text-gray-500"}`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-gray-700" />

                  <Button
                    className={`w-full font-medium ${
                      currentPlan === plan.id
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : plan.color === "green"
                          ? "bg-green-500 hover:bg-green-600 text-black"
                          : plan.color === "purple"
                            ? "bg-purple-500 hover:bg-purple-600 text-white"
                            : "bg-gray-600 hover:bg-gray-700 text-white"
                    }`}
                    disabled={currentPlan === plan.id}
                  >
                    {currentPlan === plan.id
                      ? "Current Plan"
                      : plan.id === "free"
                        ? "Downgrade to Free"
                        : "Upgrade Now"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Comparison */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Feature Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Headphones className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h4 className="text-white font-medium mb-2">High-Quality Audio</h4>
                  <p className="text-gray-400 text-sm">Crystal clear sound with lossless streaming</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h4 className="text-white font-medium mb-2">AI Recommendations</h4>
                  <p className="text-gray-400 text-sm">Personalized music discovery powered by AI</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Mic className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h4 className="text-white font-medium mb-2">Voice Control</h4>
                  <p className="text-gray-400 text-sm">Control your music with voice commands</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h4 className="text-white font-medium mb-2">Social Jams</h4>
                  <p className="text-gray-400 text-sm">Listen together with friends in real-time</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <h4 className="text-white font-medium mb-2">Can I cancel anytime?</h4>
                  <p className="text-gray-400 text-sm">
                    Yes, you can cancel your subscription at any time. Your premium features will remain active until
                    the end of your billing period.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <h4 className="text-white font-medium mb-2">What happens to my data if I downgrade?</h4>
                  <p className="text-gray-400 text-sm">
                    Your listening history and preferences are preserved. You'll just lose access to premium features
                    like unlimited skips and high-quality audio.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <h4 className="text-white font-medium mb-2">Is there a free trial?</h4>
                  <p className="text-gray-400 text-sm">
                    Yes! New users get a 30-day free trial of Premium. No credit card required to start.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
