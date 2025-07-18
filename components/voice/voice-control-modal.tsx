"use client"

import { Button } from "@/components/ui/button"
import { useDisclosure, Text, Flex, Box, CircularProgress } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { useSpeechSynthesis } from "react-speech-kit"
import { MdPlayArrow, MdPause } from "react-icons/md"
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa"
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useToast } from "@chakra-ui/react"

const VoiceControlModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [wakeWord, setWakeWord] = useState("hey buddy")
  const [transcript, setTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [wakeActive, setWakeActive] = useState(false)
  const wakeActiveRef = useRef(false)
  const listeningRef = useRef(false) // evita dobles start()
  const [volume, setVolume] = useState(0.5)
  const [speaking, setSpeaking] = useState(false)
  const toast = useToast()

  const wakeRef = useRef<any>(null)
  const cmdRef = useRef<any>(null)

  const { speak, cancel, speaking: isCurrentlySpeaking } = useSpeechSynthesis()

  const onResultWake = (result: any) => {
    wakeActiveRef.current = false
    setWakeActive(false)
    toast({
      title: "Wake word detected",
      description: "I'm listening...",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
    startListening()
  }

  const onResultCmd = (result: any) => {
    setTranscript(result.transcript)
    setConfidence(result.confidence)
    console.log("Confidence", result.confidence)
    console.log("Transcript", result.transcript)
  }

  useEffect(() => {
    wakeRef.current = new (window as any).SpeechRecognition()
    wakeRef.current.continuous = true
    wakeRef.current.interimResults = false
    wakeRef.current.maxAlternatives = 1
    wakeRef.current.lang = "en-US"
    wakeRef.current.onsoundstart = () => {
      wakeActiveRef.current = true
      setWakeActive(true)
    }
    wakeRef.current.onresult = (event: any) => {
      const result = event.results[event.results.length - 1][0]
      if (result.transcript.toLowerCase().includes(wakeWord.toLowerCase())) {
        wakeRef.current.stop()
        onResultWake(result)
      }
    }
    wakeRef.current.onend = () => {
      wakeActiveRef.current = false
      setWakeActive(false)
      startWakeWord()
    }
    wakeRef.current.onerror = (event: any) => {
      console.log("Wake error", event)
    }

    cmdRef.current = new (window as any).SpeechRecognition()
    cmdRef.current.continuous = false
    cmdRef.current.interimResults = false
    cmdRef.current.maxAlternatives = 1
    cmdRef.current.lang = "en-US"
    cmdRef.current.onstart = () => {
      listeningRef.current = true
    }
    cmdRef.current.onresult = (event: any) => {
      const result = event.results[event.results.length - 1][0]
      cmdRef.current.stop()
      onResultCmd(result)
    }
    cmdRef.current.onend = () => {
      listeningRef.current = false
    }
    cmdRef.current.onerror = (event: any) => {
      listeningRef.current = false
      console.log("Cmd error", event)
    }

    startWakeWord()

    return () => {
      wakeRef.current.stop()
      cmdRef.current.stop()
    }
  }, [])

  const startWakeWord = () => {
    if (!wakeRef.current || wakeActiveRef.current || listeningRef.current) return
    try {
      wakeRef.current.start()
    } catch (err: any) {
      if (!String(err).includes("already started")) console.error(err)
    }
  }

  const startListening = () => {
    if (!cmdRef.current || listeningRef.current) return
    setTranscript("")
    setConfidence(0)
    try {
      cmdRef.current.start()
    } catch (err: any) {
      // Ignoramos el error si ya estaba iniciado
      if (!String(err).includes("already started")) console.error(err)
    }
  }

  const handleSpeak = () => {
    if (isCurrentlySpeaking) {
      cancel()
      setSpeaking(false)
    } else {
      setSpeaking(true)
      speak({ text: transcript, volume: volume })
    }
  }

  useEffect(() => {
    if (!isCurrentlySpeaking) {
      setSpeaking(false)
    }
  }, [isCurrentlySpeaking])

  return (
    <>
      <Button onClick={onOpen}>Voice Control</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Voice Control</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Wake word: {wakeWord}</Text>
            <Text>Transcript: {transcript}</Text>
            <Text>Confidence: {confidence}</Text>
            <Flex alignItems="center">
              <Button
                leftIcon={speaking ? <MdPause /> : <MdPlayArrow />}
                colorScheme="blue"
                onClick={handleSpeak}
                mr={2}
              >
                {speaking ? "Pause" : "Speak"}
              </Button>
              <Text mr={2}>Volume:</Text>
              <Button onClick={() => setVolume(Math.max(0, volume - 0.1))} isDisabled={volume <= 0}>
                <FaVolumeMute />
              </Button>
              <Box width="100px" mx={2}>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={volume}
                  onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
                />
              </Box>
              <Button onClick={() => setVolume(Math.min(1, volume + 0.1))} isDisabled={volume >= 1}>
                <FaVolumeUp />
              </Button>
            </Flex>
            <Flex mt={4} align="center">
              <Text mr={2}>Wake Word Active:</Text>
              {wakeActive ? (
                <CircularProgress value={100} size="20px" isIndeterminate color="green.400" />
              ) : (
                <CircularProgress value={0} size="20px" color="red.400" />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default VoiceControlModal
