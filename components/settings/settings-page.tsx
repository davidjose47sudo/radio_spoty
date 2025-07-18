"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  X,
  Bell,
  Shield,
  Mic,
  Volume2,
  Monitor,
  Smartphone,
  Laptop,
  Crown,
  CreditCard,
  Download,
  Moon,
  Sun,
  Palette,
} from "lucide-react"

interface SettingsPageProps {
  user: any
  onClose: () => void
  onUpdateSettings: (settings: any) => void
  isAuraEnabled: boolean
  onToggleAura: (enabled: boolean) => void
}

export function SettingsPage({ user, onClose, onUpdateSettings, isAuraEnabled, onToggleAura }: SettingsPageProps) {
  const [settings, setSettings] = useState({
    // General Settings
    theme: "dark",
    language: "en",
    autoPlay: true,
    crossfade: true,

    // Audio Settings
    audioQuality: user?.plan === "premium" ? "high" : "normal",
    volumeNormalization: true,
    bassBoost: false,

    // Notifications
    pushNotifications: true,
    emailNotifications: true,
    newMusicNotifications: true,
    jamInvitations: true,
    friendActivity: false,

    // Privacy
    showActivity: true,
    allowFriendRequests: true,
    showListeningHistory: false,

    // Voice Assistant
    auraEnabled: isAuraEnabled,
    wakeWord: "Hey Aura",
    voiceLanguage: "en-US",
    voiceSensitivity: 75,
  })

  const devices = [
    {
      id: 1,
      name: "MacBook Pro",
      type: "laptop",
      location: "New York, USA",
      lastActive: "Active now",
      current: true,
    },
    {
      id: 2,
      name: "iPhone 15 Pro",
      type: "smartphone",
      location: "New York, USA",
      lastActive: "2 hours ago",
      current: false,
    },
    {
      id: 3,
      name: "Chrome Browser",
      type: "desktop",
      location: "New York, USA",
      lastActive: "1 day ago",
      current: false,
    },
  ]

  const paymentHistory = [
    {
      id: 1,
      date: "2024-01-15",
      amount: "$9.99",
      plan: "Premium Monthly",
      status: "paid",
      method: "•••• 4242",
    },
    {
      id: 2,
      date: "2023-12-15",
      amount: "$9.99",
      plan: "Premium Monthly",
      status: "paid",
      method: "•••• 4242",
    },
    {
      id: 3,
      date: "2023-11-15",
      amount: "$9.99",
      plan: "Premium Monthly",
      status: "paid",
      method: "•••• 4242",
    },
    {
      id: 4,
      date: "2023-10-15",
      amount: "$9.99",
      plan: "Premium Monthly",
      status: "paid",
      method: "•••• 4242",
    },
  ]

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)

    if (key === "auraEnabled") {
      onToggleAura(value)
    }

    onUpdateSettings(newSettings)
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "laptop":
        return <Laptop className="w-5 h-5" />
      case "smartphone":
        return <Smartphone className="w-5 h-5" />
      case "desktop":
        return <Monitor className="w-5 h-5" />
      default:
        return <Monitor className="w-5 h-5" />
    }
  }

  const signOutDevice = (deviceId: number) => {
    // Handle device sign out
    console.log("Sign out device:", deviceId)
  }

  const signOutAllDevices = () => {
    // Handle sign out all devices
    console.log("Sign out all devices")
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">Settings</CardTitle>
                <p className="text-gray-400">Manage your account and preferences</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-gray-800">
              <TabsTrigger value="general" className="text-white">
                General
              </TabsTrigger>
              <TabsTrigger value="audio" className="text-white">
                Audio
              </TabsTrigger>
              <TabsTrigger value="notifications" className="text-white">
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="text-white">
                Privacy
              </TabsTrigger>
              <TabsTrigger value="voice" className="text-white">
                Voice
              </TabsTrigger>
              <TabsTrigger value="devices" className="text-white">
                Devices
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 mt-6">
              {/* Theme Settings */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Theme</p>
                      <p className="text-gray-400 text-sm">Choose your preferred theme</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant={settings.theme === "dark" ? "default" : "outline"}
                        size="sm"
                        className={settings.theme === "dark" ? "bg-green-500 text-black" : "border-gray-600 text-white"}
                        onClick={() => handleSettingChange("theme", "dark")}
                      >
                        <Moon className="w-4 h-4 mr-1" />
                        Dark
                      </Button>
                      <Button
                        variant={settings.theme === "light" ? "default" : "outline"}
                        size="sm"
                        className={
                          settings.theme === "light" ? "bg-green-500 text-black" : "border-gray-600 text-white"
                        }
                        onClick={() => handleSettingChange("theme", "light")}
                      >
                        <Sun className="w-4 h-4 mr-1" />
                        Light
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Language</p>
                      <p className="text-gray-400 text-sm">Select your preferred language</p>
                    </div>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange("language", e.target.value)}
                      className="bg-gray-700 border border-gray-600 text-white rounded px-3 py-1"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Playback Settings */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Playback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Auto-play</p>
                      <p className="text-gray-400 text-sm">Automatically play similar music when your music ends</p>
                    </div>
                    <Switch
                      checked={settings.autoPlay}
                      onCheckedChange={(checked) => handleSettingChange("autoPlay", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Crossfade</p>
                      <p className="text-gray-400 text-sm">Seamless transitions between songs</p>
                    </div>
                    <Switch
                      checked={settings.crossfade}
                      onCheckedChange={(checked) => handleSettingChange("crossfade", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audio" className="space-y-6 mt-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Volume2 className="w-5 h-5 mr-2" />
                    Audio Quality
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Streaming Quality</p>
                      <p className="text-gray-400 text-sm">Higher quality uses more data</p>
                    </div>
                    <select
                      value={settings.audioQuality}
                      onChange={(e) => handleSettingChange("audioQuality", e.target.value)}
                      className="bg-gray-700 border border-gray-600 text-white rounded px-3 py-1"
                      disabled={user?.plan !== "premium"}
                    >
                      <option value="low">Low (96 kbps)</option>
                      <option value="normal">Normal (160 kbps)</option>
                      <option value="high">High (320 kbps)</option>
                      <option value="lossless">Lossless (FLAC)</option>
                    </select>
                  </div>

                  {user?.plan !== "premium" && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                      <p className="text-yellow-300 text-sm">
                        <Crown className="w-4 h-4 inline mr-1" />
                        High quality audio is available with Premium
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Volume Normalization</p>
                      <p className="text-gray-400 text-sm">Keep volume levels consistent</p>
                    </div>
                    <Switch
                      checked={settings.volumeNormalization}
                      onCheckedChange={(checked) => handleSettingChange("volumeNormalization", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Bass Boost</p>
                      <p className="text-gray-400 text-sm">Enhance low frequencies</p>
                    </div>
                    <Switch
                      checked={settings.bassBoost}
                      onCheckedChange={(checked) => handleSettingChange("bassBoost", checked)}
                      disabled={user?.plan !== "premium"}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 mt-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Push Notifications</p>
                      <p className="text-gray-400 text-sm">Receive notifications on this device</p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Email Notifications</p>
                      <p className="text-gray-400 text-sm">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                    />
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">New Music Releases</p>
                      <p className="text-gray-400 text-sm">
                        Get notified about new releases from your favorite artists
                      </p>
                    </div>
                    <Switch
                      checked={settings.newMusicNotifications}
                      onCheckedChange={(checked) => handleSettingChange("newMusicNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Jam Invitations</p>
                      <p className="text-gray-400 text-sm">Get notified when friends invite you to jams</p>
                    </div>
                    <Switch
                      checked={settings.jamInvitations}
                      onCheckedChange={(checked) => handleSettingChange("jamInvitations", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Friend Activity</p>
                      <p className="text-gray-400 text-sm">Get notified about your friends' listening activity</p>
                    </div>
                    <Switch
                      checked={settings.friendActivity}
                      onCheckedChange={(checked) => handleSettingChange("friendActivity", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6 mt-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Show Activity</p>
                      <p className="text-gray-400 text-sm">Let friends see what you're listening to</p>
                    </div>
                    <Switch
                      checked={settings.showActivity}
                      onCheckedChange={(checked) => handleSettingChange("showActivity", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Allow Friend Requests</p>
                      <p className="text-gray-400 text-sm">Let others send you friend requests</p>
                    </div>
                    <Switch
                      checked={settings.allowFriendRequests}
                      onCheckedChange={(checked) => handleSettingChange("allowFriendRequests", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Show Listening History</p>
                      <p className="text-gray-400 text-sm">Make your listening history visible to friends</p>
                    </div>
                    <Switch
                      checked={settings.showListeningHistory}
                      onCheckedChange={(checked) => handleSettingChange("showListeningHistory", checked)}
                    />
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download My Data
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-red-600 text-red-400 hover:bg-red-600/20 bg-transparent"
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="voice" className="space-y-6 mt-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Mic className="w-5 h-5 mr-2" />
                    Voice Assistant Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Enable Aura</p>
                      <p className="text-gray-400 text-sm">Turn on voice control with "Hey Aura"</p>
                    </div>
                    <Switch
                      checked={settings.auraEnabled}
                      onCheckedChange={(checked) => handleSettingChange("auraEnabled", checked)}
                    />
                  </div>

                  {settings.auraEnabled && (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Wake Word</p>
                          <p className="text-gray-400 text-sm">Phrase to activate voice control</p>
                        </div>
                        <Input
                          value={settings.wakeWord}
                          onChange={(e) => handleSettingChange("wakeWord", e.target.value)}
                          className="w-32 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Voice Language</p>
                          <p className="text-gray-400 text-sm">Language for voice recognition</p>
                        </div>
                        <select
                          value={settings.voiceLanguage}
                          onChange={(e) => handleSettingChange("voiceLanguage", e.target.value)}
                          className="bg-gray-700 border border-gray-600 text-white rounded px-3 py-1"
                        >
                          <option value="en-US">English (US)</option>
                          <option value="en-GB">English (UK)</option>
                          <option value="es-ES">Spanish</option>
                          <option value="fr-FR">French</option>
                          <option value="de-DE">German</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-white font-medium">Voice Sensitivity</p>
                            <p className="text-gray-400 text-sm">How sensitive the wake word detection is</p>
                          </div>
                          <span className="text-white text-sm">{settings.voiceSensitivity}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={settings.voiceSensitivity}
                          onChange={(e) => handleSettingChange("voiceSensitivity", Number.parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                        />
                      </div>
                    </>
                  )}

                  {user?.plan !== "premium" && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                      <p className="text-yellow-300 text-sm">
                        <Crown className="w-4 h-4 inline mr-1" />
                        Advanced voice features are available with Premium
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="devices" className="space-y-6 mt-6">
              {/* Active Devices */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <Monitor className="w-5 h-5 mr-2" />
                      Active Devices
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-400 hover:bg-red-600/20 bg-transparent"
                      onClick={signOutAllDevices}
                    >
                      Sign Out All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {devices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                          {getDeviceIcon(device.type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-white font-medium">{device.name}</p>
                            {device.current && (
                              <Badge className="bg-green-500/20 text-green-300 text-xs">Current</Badge>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">{device.location}</p>
                          <p className="text-gray-400 text-xs">{device.lastActive}</p>
                        </div>
                      </div>
                      {!device.current && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => signOutDevice(device.id)}
                        >
                          Sign Out
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Payment History */}
              {user?.plan === "premium" && (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Payment History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {paymentHistory.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                        >
                          <div>
                            <p className="text-white font-medium">{payment.plan}</p>
                            <p className="text-gray-400 text-sm">
                              {payment.date} • {payment.method}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-medium">{payment.amount}</p>
                            <Badge className="bg-green-500/20 text-green-300 text-xs">{payment.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4 border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Invoice History
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Logout Section */}
              <Card className="bg-red-500/10 border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Account Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-red-600 text-red-400 hover:bg-red-600/20 bg-transparent"
                    onClick={() => {
                      if (confirm("Are you sure you want to log out?")) {
                        onClose()
                        // Trigger logout through parent component
                        window.dispatchEvent(new CustomEvent("logout"))
                      }
                    }}
                  >
                    Log Out
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-600 text-red-400 hover:bg-red-600/20 bg-transparent"
                  >
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
