"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { useEffect, useRef, useState, useCallback } from "react"
import { Play, Pause, VolumeX, Volume2, Mic, MicOff, X, Settings } from "lucide-react"

interface VoiceControlModalProps {
  isOpen?: boolean
  onClose?: () => void
}

// Types for Speech Recognition
interface ISpeechRecognition {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onstart: ((this: ISpeechRecognition, ev: Event) => any) | null
  onend: ((this: ISpeechRecognition, ev: Event) => any) | null
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionResult) => any) | null
  onresult: ((this: ISpeechRecognition, ev: ISpeechRecognition) => any) | null
  onsoundstart: ((this: ISpeechRecognition, ev: Event) => any) | null
}

const VoiceControlModal = ({ isOpen = false, onClose }: VoiceControlModalProps) => {
  const [wakeWord, setWakeWord] = useState("hey buddy")
  const [transcript, setTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [wakeActive, setWakeActive] = useState(false)
  const [listening, setListening] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [speaking, setSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0)

  const wakeActiveRef = useRef(false)
  const listeningRef = useRef(false)
  const wakeRef = useRef<ISpeechRecognition | null>(null)
  const cmdRef = useRef<ISpeechRecognition | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Initialize speech synthesis voices
  const loadVoices = useCallback(() => {
    if ('speechSynthesis' in window) {
      const availableVoices = speechSynthesis.getVoices()
      setVoices(availableVoices)
      // Try to find a Spanish voice first, then English
      const spanishVoice = availableVoices.findIndex(voice => voice.lang.includes('es'))
      const englishVoice = availableVoices.findIndex(voice => voice.lang.includes('en'))
      setSelectedVoiceIndex(spanishVoice >= 0 ? spanishVoice : englishVoice >= 0 ? englishVoice : 0)
    }
  }, [])

  useEffect(() => {
    // Check browser support
    const speechRecognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    const speechSynthesisSupported = 'speechSynthesis' in window
    setIsSupported(speechRecognitionSupported && speechSynthesisSupported)

    if (speechSynthesisSupported) {
      loadVoices()
      // Load voices when they become available
      speechSynthesis.onvoiceschanged = loadVoices
    }

    return () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.onvoiceschanged = null
      }
    }
  }, [loadVoices])

  const showToast = (title: string, description: string, type: 'success' | 'error' = 'success') => {
    console.log(`${type.toUpperCase()}: ${title} - ${description}`)
  }

  const onResultWake = useCallback((result: SpeechRecognitionResult) => {
    wakeActiveRef.current = false
    setWakeActive(false)
    showToast("Palabra de activación detectada", "Escuchando comando...", "success")
    startListening()
  }, [])

  const onResultCmd = useCallback((result: SpeechRecognitionResult) => {
    const transcript = result[0].transcript
    const confidence = result[0].confidence
    setTranscript(transcript)
    setConfidence(confidence)
    setListening(false)
    processCommand(transcript)
  }, [])

  const processCommand = (command: string) => {
    const lowerCommand = command.toLowerCase()
    console.log("Comando procesado:", lowerCommand)
    
    // Here you can add command processing logic
    if (lowerCommand.includes('reproducir') || lowerCommand.includes('play')) {
      speak("Reproduciendo música")
    } else if (lowerCommand.includes('parar') || lowerCommand.includes('stop')) {
      speak("Música pausada")
    } else if (lowerCommand.includes('volumen')) {
      speak("Ajustando volumen")
    } else {
      speak("Comando recibido: " + command)
    }
  }

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported')
      return
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.volume = volume
    utterance.rate = 0.9
    utterance.pitch = 1

    if (voices.length > 0 && voices[selectedVoiceIndex]) {
      utterance.voice = voices[selectedVoiceIndex]
    }

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    utteranceRef.current = utterance
    speechSynthesis.speak(utterance)
  }, [volume, voices, selectedVoiceIndex])

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
    setSpeaking(false)
  }, [])

  useEffect(() => {
    if (!isSupported || !isOpen) return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    // Wake word recognition setup
    try {
      wakeRef.current = new SpeechRecognition() as ISpeechRecognition
      wakeRef.current.continuous = true
      wakeRef.current.interimResults = false
      wakeRef.current.maxAlternatives = 1
      wakeRef.current.lang = "es-ES"

      wakeRef.current.onsoundstart = () => {
        wakeActiveRef.current = true
        setWakeActive(true)
      }

      wakeRef.current.onresult = (event: any) => {
        const result = event.results[event.results.length - 1][0]
        if (result.transcript.toLowerCase().includes(wakeWord.toLowerCase())) {
          wakeRef.current?.stop()
          onResultWake(result)
        }
      }

      wakeRef.current.onend = () => {
        wakeActiveRef.current = false
        setWakeActive(false)
        if (isOpen && !listeningRef.current) {
          // Restart wake word detection after a short delay
          setTimeout(startWakeWord, 1000)
        }
      }

      wakeRef.current.onerror = (event: SpeechRecognitionResult) => {
        console.log("Wake word error:", event)
        wakeActiveRef.current = false
        setWakeActive(false)
      }

      // Command recognition setup
      cmdRef.current = new SpeechRecognition() as ISpeechRecognition
      cmdRef.current.continuous = false
      cmdRef.current.interimResults = false
      cmdRef.current.maxAlternatives = 1
      cmdRef.current.lang = "es-ES"

      cmdRef.current.onstart = () => {
        listeningRef.current = true
        setListening(true)
      }

      cmdRef.current.onresult = (event: any) => {
        const result = event.results[event.results.length - 1][0]
        cmdRef.current?.stop()
        onResultCmd(result)
      }

      cmdRef.current.onend = () => {
        listeningRef.current = false
        setListening(false)
        // Restart wake word detection
        setTimeout(startWakeWord, 1000)
      }

      cmdRef.current.onerror = (event: SpeechRecognitionResult) => {
        listeningRef.current = false
        setListening(false)
        console.log("Command error:", event)
      }

      startWakeWord()
    } catch (error) {
      console.error("Error setting up speech recognition:", error)
      setIsSupported(false)
    }

    return () => {
      try {
        wakeRef.current?.stop()
        cmdRef.current?.stop()
        speechSynthesis.cancel()
      } catch (error) {
        console.error("Error during cleanup:", error)
      }
    }
  }, [isOpen, wakeWord, onResultWake, onResultCmd, isSupported])

  const startWakeWord = useCallback(() => {
    if (!wakeRef.current || wakeActiveRef.current || listeningRef.current || !isOpen) return
    
    try {
      wakeRef.current.start()
    } catch (err: any) {
      if (!String(err).includes("already started")) {
        console.error("Error starting wake word recognition:", err)
      }
    }
  }, [isOpen])

  const startListening = useCallback(() => {
    if (!cmdRef.current || listeningRef.current) return
    
    setTranscript("")
    setConfidence(0)
    
    try {
      cmdRef.current.start()
    } catch (err: any) {
      if (!String(err).includes("already started")) {
        console.error("Error starting command recognition:", err)
      }
    }
  }, [])

  const handleSpeak = () => {
    if (speaking) {
      stopSpeaking()
    } else {
      speak(transcript || "No hay texto que reproducir")
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
  }

  const handleClose = () => {
    try {
      wakeRef.current?.stop()
      cmdRef.current?.stop()
      stopSpeaking()
    } catch (error) {
      console.error("Error during modal close:", error)
    }
    onClose?.()
  }

  if (!isSupported) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-white">
              Control de Voz
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-4 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MicOff className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Compatible</h3>
            <p className="text-gray-400 mb-4">
              Tu navegador no soporta reconocimiento de voz o síntesis de voz.
            </p>
            <p className="text-sm text-gray-500">
              Prueba con Chrome, Edge o Safari en versiones recientes.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-white">
            Control de Voz
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          {/* Status Indicators */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Palabra de activación:</span>
                <span className="text-sm text-gray-400">"{wakeWord}"</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${wakeActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                <span className="text-xs text-gray-400">
                  {wakeActive ? 'Detectando...' : 'En espera'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {listening ? <Mic className="w-4 h-4 text-green-500" /> : <MicOff className="w-4 h-4 text-gray-400" />}
                <span className="text-sm font-medium">
                  {listening ? 'Escuchando...' : 'Esperando'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${listening ? 'bg-blue-500 animate-pulse' : 'bg-gray-500'}`} />
                <span className="text-xs text-gray-400">
                  {listening ? 'Comando activo' : 'Comando inactivo'}
                </span>
              </div>
            </div>
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Último comando:</span>
              <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-sm text-white mb-2">{transcript}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    Confianza: {Math.round(confidence * 100)}%
                  </span>
                  <div className={`px-2 py-1 rounded text-xs ${confidence > 0.7 ? 'bg-green-500/20 text-green-400' : confidence > 0.5 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                    {confidence > 0.7 ? 'Alta' : confidence > 0.5 ? 'Media' : 'Baja'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Voice Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Síntesis de voz:</span>
              <Button
                variant={speaking ? "secondary" : "default"}
                size="sm"
                onClick={handleSpeak}
                disabled={!transcript}
                className="flex items-center space-x-2"
              >
                {speaking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{speaking ? 'Parar' : 'Reproducir'}</span>
              </Button>
            </div>

            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Volumen:</span>
                <span className="text-sm text-gray-400">{Math.round(volume * 100)}%</span>
              </div>
              <div className="flex items-center space-x-3">
                <VolumeX className="w-4 h-4 text-gray-400" />
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  min={0}
                  step={0.1}
                  className="flex-1"
                />
                <Volume2 className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Voice Selection */}
            {voices.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-medium">Voz:</span>
                <select
                  value={selectedVoiceIndex}
                  onChange={(e) => setSelectedVoiceIndex(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {voices.map((voice, index) => (
                    <option key={index} value={index}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Manual Controls */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={startListening}
              disabled={listening}
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              <Mic className="w-4 h-4 mr-2" />
              Escuchar comando
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={startWakeWord}
              disabled={wakeActive}
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              <Settings className="w-4 h-4 mr-2" />
              Reiniciar detección
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-xs text-gray-400 p-3 bg-gray-800 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 gap-2">
              <p>• Di <strong>"{wakeWord}"</strong> para activar</p>
              <p>• Luego da tu comando (ej: "reproducir música", "parar")</p>
              <p>• Los comandos se procesarán automáticamente</p>
              <p>• Usa los controles manuales si hay problemas</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default VoiceControlModal
