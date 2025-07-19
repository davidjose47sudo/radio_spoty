"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause, LayoutGrid, ImageIcon, Home, User, Search, SkipForward, SkipBack } from "lucide-react"

interface FloatingControlPanelProps {
  isPlaying: boolean
  onTogglePlay: () => void
  onShowGrid: () => void
  onShowGallery: () => void
  onShowHome: () => void
  onShowProfile: () => void
  onShowSearch: () => void
  onNext: () => void
  onPrevious: () => void
  className?: string
}

export function FloatingControlPanel({
  isPlaying,
  onTogglePlay,
  onShowGrid,
  onShowGallery,
  onShowHome,
  onShowProfile,
  onShowSearch,
  onNext,
  onPrevious,
  className = "",
}: FloatingControlPanelProps) {
  return (
    <div className={`fixed right-6 top-1/2 -translate-y-1/2 z-50 ${className}`}>
      <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-full p-3 shadow-2xl">
        <div className="flex flex-col space-y-3">
          {/* Play/Pause */}
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 text-white hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
            onClick={onTogglePlay}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>

          {/* Previous */}
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
            onClick={onPrevious}
          >
            <SkipBack className="w-5 h-5" />
          </Button>

          {/* Next */}
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
            onClick={onNext}
          >
            <SkipForward className="w-5 h-5" />
          </Button>

          {/* Grid/Apps */}
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
            onClick={onShowGrid}
          >
            <LayoutGrid className="w-5 h-5" />
          </Button>

          {/* Gallery/Images */}
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
            onClick={onShowGallery}
          >
            <ImageIcon className="w-5 h-5" />
          </Button>

          {/* Home */}
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
            onClick={onShowHome}
          >
            <Home className="w-5 h-5" />
          </Button>

          {/* Profile */}
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
            onClick={onShowProfile}
          >
            <User className="w-5 h-5" />
          </Button>

          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
            onClick={onShowSearch}
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
