import { supabase } from "./supabase"
import { logGlobalEvent } from "./events"

export interface UploadProgress {
  percentage: number
  bytesUploaded: number
  totalBytes: number
}

export interface UploadResult {
  success: boolean
  file_url?: string
  compressed_url?: string
  error?: string
}

export async function uploadAudioFile(
  file: File,
  onProgress?: (progress: UploadProgress) => void,
): Promise<UploadResult> {
  try {
    // Validate file type
    const allowedTypes = ["audio/mpeg", "audio/mp4", "audio/wav", "audio/ogg"]
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only MP3, MP4, WAV, and OGG files are allowed.")
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error("File size too large. Maximum size is 50MB.")
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `audio/${fileName}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from("audio-files").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage.from("audio-files").getPublicUrl(filePath)

    // Simulate compression (in real app, you'd use a service like FFmpeg)
    const compressedPath = `compressed/${fileName}`

    // Log the upload event
    await logGlobalEvent({
      event_type: "upload",
      action: "audio_file_uploaded",
      resource_type: "audio_file",
      resource_id: data.path,
      metadata: {
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        upload_path: filePath,
      },
    })

    return {
      success: true,
      file_url: urlData.publicUrl,
      compressed_url: urlData.publicUrl, // In real app, this would be the compressed version
    }
  } catch (error) {
    console.error("Upload error:", error)

    // Log the error event
    await logGlobalEvent({
      event_type: "upload",
      action: "audio_file_upload_failed",
      metadata: {
        file_name: file.name,
        file_size: file.size,
        error: error instanceof Error ? error.message : "Unknown error",
      },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}

export async function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement("audio")
    const url = URL.createObjectURL(file)

    audio.addEventListener("loadedmetadata", () => {
      URL.revokeObjectURL(url)
      resolve(audio.duration)
    })

    audio.addEventListener("error", () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load audio metadata"))
    })

    audio.src = url
  })
}

export async function uploadImage(
  file: File,
  folder: "avatars" | "covers" | "artists" = "covers",
): Promise<UploadResult> {
  try {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF files are allowed.")
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error("File size too large. Maximum size is 5MB.")
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from("images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage.from("images").getPublicUrl(filePath)

    // Log the upload event
    await logGlobalEvent({
      event_type: "upload",
      action: "image_uploaded",
      resource_type: "image",
      resource_id: data.path,
      metadata: {
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        folder,
        upload_path: filePath,
      },
    })

    return {
      success: true,
      file_url: urlData.publicUrl,
    }
  } catch (error) {
    console.error("Image upload error:", error)

    // Log the error event
    await logGlobalEvent({
      event_type: "upload",
      action: "image_upload_failed",
      metadata: {
        file_name: file.name,
        file_size: file.size,
        folder,
        error: error instanceof Error ? error.message : "Unknown error",
      },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}

export async function deleteFile(filePath: string, bucket: "audio-files" | "images"): Promise<boolean> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath])

    if (error) throw error

    // Log the deletion event
    await logGlobalEvent({
      event_type: "admin",
      action: "file_deleted",
      resource_type: "file",
      resource_id: filePath,
      metadata: {
        bucket,
        file_path: filePath,
      },
    })

    return true
  } catch (error) {
    console.error("Delete file error:", error)

    // Log the error event
    await logGlobalEvent({
      event_type: "admin",
      action: "file_deletion_failed",
      metadata: {
        bucket,
        file_path: filePath,
        error: error instanceof Error ? error.message : "Unknown error",
      },
    })

    return false
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || ""
}

export function isAudioFile(file: File): boolean {
  const audioTypes = ["audio/mpeg", "audio/mp4", "audio/wav", "audio/ogg"]
  return audioTypes.includes(file.type)
}

export function isImageFile(file: File): boolean {
  const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  return imageTypes.includes(file.type)
}
