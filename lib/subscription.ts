import { supabase } from "./supabase"
import { logGlobalEvent } from "./events"

export interface SubscriptionPlan {
  id: "free" | "premium" | "family"
  name: string
  price: number
  interval: "month" | "year"
  features: string[]
  limits: {
    skips_per_hour: number
    downloads_per_month: number
    audio_quality: "standard" | "high" | "lossless"
    offline_playlists: number
    ai_generations_per_day: number
  }
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "month",
    features: ["Limited skips", "Standard audio quality", "Ads between songs", "Basic AI recommendations"],
    limits: {
      skips_per_hour: 6,
      downloads_per_month: 0,
      audio_quality: "standard",
      offline_playlists: 0,
      ai_generations_per_day: 3,
    },
  },
  {
    id: "premium",
    name: "Premium",
    price: 9.99,
    interval: "month",
    features: [
      "Unlimited skips",
      "High-quality audio",
      "No ads",
      "Offline downloads",
      "Advanced AI features",
      "Custom radio stations",
    ],
    limits: {
      skips_per_hour: -1, // unlimited
      downloads_per_month: 10000,
      audio_quality: "high",
      offline_playlists: 50,
      ai_generations_per_day: 50,
    },
  },
  {
    id: "family",
    name: "Family",
    price: 14.99,
    interval: "month",
    features: [
      "Everything in Premium",
      "Up to 6 accounts",
      "Family mix playlists",
      "Parental controls",
      "Shared playlists",
    ],
    limits: {
      skips_per_hour: -1, // unlimited
      downloads_per_month: 10000,
      audio_quality: "lossless",
      offline_playlists: 100,
      ai_generations_per_day: 100,
    },
  },
]

export async function getUserSubscription(userId: string) {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== "PGRST116") {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error getting user subscription:", error)
    return { data: null, error }
  }
}

export async function createSubscription(
  userId: string,
  plan: "free" | "premium" | "family",
  stripeSubscriptionId?: string,
  stripeCustomerId?: string,
) {
  try {
    const currentPeriodStart = new Date()
    const currentPeriodEnd = new Date()
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)

    const { data, error } = await supabase
      .from("subscriptions")
      .insert({
        user_id: userId,
        plan,
        status: "active",
        stripe_subscription_id: stripeSubscriptionId,
        stripe_customer_id: stripeCustomerId,
        current_period_start: currentPeriodStart.toISOString(),
        current_period_end: currentPeriodEnd.toISOString(),
        cancel_at_period_end: false,
      })
      .select()
      .single()

    if (error) throw error

    // Update user profile
    await supabase
      .from("profiles")
      .update({
        subscription_plan: plan,
        subscription_status: "active",
        subscription_expires_at: currentPeriodEnd.toISOString(),
        role: plan === "free" ? "free" : "premium",
      })
      .eq("id", userId)

    // Log the subscription event
    await logGlobalEvent({
      user_id: userId,
      event_type: "subscription",
      action: "subscription_created",
      metadata: { plan, stripe_subscription_id: stripeSubscriptionId },
    })

    return { data, error: null }
  } catch (error) {
    console.error("Error creating subscription:", error)
    return { data: null, error }
  }
}

export async function cancelSubscription(userId: string, cancelAtPeriodEnd = true) {
  try {
    const { data: subscription } = await getUserSubscription(userId)
    if (!subscription) {
      throw new Error("No active subscription found")
    }

    const updateData: any = {
      cancel_at_period_end: cancelAtPeriodEnd,
      updated_at: new Date().toISOString(),
    }

    if (!cancelAtPeriodEnd) {
      updateData.status = "cancelled"
      updateData.cancelled_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from("subscriptions")
      .update(updateData)
      .eq("id", subscription.id)
      .select()
      .single()

    if (error) throw error

    // Update user profile if immediately cancelled
    if (!cancelAtPeriodEnd) {
      await supabase
        .from("profiles")
        .update({
          subscription_plan: "free",
          subscription_status: "cancelled",
          role: "free",
        })
        .eq("id", userId)
    }

    // Log the cancellation event
    await logGlobalEvent({
      user_id: userId,
      event_type: "subscription",
      action: cancelAtPeriodEnd ? "subscription_cancel_scheduled" : "subscription_cancelled",
      metadata: { subscription_id: subscription.id, cancel_at_period_end: cancelAtPeriodEnd },
    })

    return { data, error: null }
  } catch (error) {
    console.error("Error cancelling subscription:", error)
    return { data: null, error }
  }
}

export async function reactivateSubscription(userId: string) {
  try {
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (subError || !subscription) {
      throw new Error("No subscription found")
    }

    const { data, error } = await supabase
      .from("subscriptions")
      .update({
        status: "active",
        cancel_at_period_end: false,
        cancelled_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.id)
      .select()
      .single()

    if (error) throw error

    // Update user profile
    await supabase
      .from("profiles")
      .update({
        subscription_plan: subscription.plan,
        subscription_status: "active",
        role: subscription.plan === "free" ? "free" : "premium",
      })
      .eq("id", userId)

    // Log the reactivation event
    await logGlobalEvent({
      user_id: userId,
      event_type: "subscription",
      action: "subscription_reactivated",
      metadata: { subscription_id: subscription.id },
    })

    return { data, error: null }
  } catch (error) {
    console.error("Error reactivating subscription:", error)
    return { data: null, error }
  }
}

export async function changeSubscriptionPlan(
  userId: string,
  newPlan: "free" | "premium" | "family",
  stripeSubscriptionId?: string,
) {
  try {
    const { data: currentSub } = await getUserSubscription(userId)
    if (!currentSub) {
      throw new Error("No active subscription found")
    }

    // Cancel current subscription
    await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentSub.id)

    // Create new subscription
    const { data, error } = await createSubscription(userId, newPlan, stripeSubscriptionId)

    if (error) throw error

    // Log the plan change event
    await logGlobalEvent({
      user_id: userId,
      event_type: "subscription",
      action: "subscription_plan_changed",
      metadata: {
        old_plan: currentSub.plan,
        new_plan: newPlan,
        old_subscription_id: currentSub.id,
        new_subscription_id: data?.id,
      },
    })

    return { data, error: null }
  } catch (error) {
    console.error("Error changing subscription plan:", error)
    return { data: null, error }
  }
}

export function getPlanLimits(plan: "free" | "premium" | "family") {
  const planData = SUBSCRIPTION_PLANS.find((p) => p.id === plan)
  return planData?.limits || SUBSCRIPTION_PLANS[0].limits
}

export function canPerformAction(
  userPlan: "free" | "premium" | "family",
  action: "skip" | "download" | "ai_generation",
  currentUsage: number,
): boolean {
  const limits = getPlanLimits(userPlan)

  switch (action) {
    case "skip":
      return limits.skips_per_hour === -1 || currentUsage < limits.skips_per_hour
    case "download":
      return limits.downloads_per_month === -1 || currentUsage < limits.downloads_per_month
    case "ai_generation":
      return limits.ai_generations_per_day === -1 || currentUsage < limits.ai_generations_per_day
    default:
      return false
  }
}
