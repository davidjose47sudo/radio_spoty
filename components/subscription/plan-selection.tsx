"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Crown, Check, X, Music, Users, Headphones, Mic, Sparkles, ArrowRight } from "lucide-react"

interface PlanSelectionProps {
  onClose: () => void
  onSelectPlan: (planId: string, billing: string) => void
  currentPlan?: string
  isNewUser?: boolean
}

export function PlanSelection({ onClose, onSelectPlan, currentPlan = "free", isNewUser = false }: PlanSelectionProps) {
  const [isYearly, setIsYearly] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(currentPlan)
  const [isProcessing, setIsProcessing] = useState(false)

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
      recommended: false,
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
      recommended: true,
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
      recommended: false,
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

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handleContinue = () => {
    const billing = isYearly ? "yearly" : "monthly"

    if (selectedPlan === "free") {
      onSelectPlan(selectedPlan, billing)
    } else {
      // Simulate payment processing for paid plans
      setIsProcessing(true)

      setTimeout(() => {
        setIsProcessing(false)
        onSelectPlan(selectedPlan, billing)
      }, 2000)
    }
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
          <CardTitle className="text-3xl font-bold text-white mb-2">
            {isNewUser ? "Choose Your Plan" : "Upgrade Your Experience"}
          </CardTitle>
          <p className="text-gray-400 mb-6">
            {isNewUser
              ? "Start your musical journey with the perfect plan for you"
              : "Unlock the full potential of AI-powered radio"}
          </p>

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative border-2 transition-all cursor-pointer ${
                  plan.popular
                    ? "border-green-500 bg-green-500/5"
                    : selectedPlan === plan.id
                      ? "border-blue-500 bg-blue-500/5"
                      : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                }`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-black font-medium px-3 py-1">Most Popular</Badge>
                  </div>
                )}

                {plan.recommended && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-blue-500 text-white font-medium px-3 py-1">Recommended</Badge>
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
                    {plan.features.slice(0, 6).map((feature, index) => (
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
                    {plan.features.length > 6 && (
                      <p className="text-gray-400 text-sm">+ {plan.features.length - 6} more features</p>
                    )}
                  </div>

                  <div className="pt-4">
                    <div
                      className={`w-4 h-4 rounded-full border-2 mx-auto ${
                        selectedPlan === plan.id ? "border-green-500 bg-green-500" : "border-gray-600"
                      }`}
                    >
                      {selectedPlan === plan.id && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Plan Summary */}
          {selectedPlan && (
            <Card className="bg-gray-800/50 border-gray-700 mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium mb-1">
                      Selected: {plans.find((p) => p.id === selectedPlan)?.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {getPrice(plans.find((p) => p.id === selectedPlan))} • {isYearly ? "Yearly" : "Monthly"} billing
                    </p>
                  </div>
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-black font-medium px-8"
                    onClick={handleContinue}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : selectedPlan === "free" ? (
                      "Continue with Free"
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

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
          {isNewUser && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <h4 className="text-white font-medium mb-2">Can I change my plan later?</h4>
                    <p className="text-gray-400 text-sm">
                      Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at your next
                      billing cycle.
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

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <h4 className="text-white font-medium mb-2">What happens if I cancel?</h4>
                    <p className="text-gray-400 text-sm">
                      You can cancel anytime. Your premium features will remain active until the end of your billing
                      period, then you'll automatically switch to the free plan.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
