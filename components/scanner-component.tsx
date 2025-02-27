"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Camera, ImageIcon, Check, X } from "lucide-react"
import { scanMedicine } from "@/app/actions"
import { useFormState } from "react-dom"

interface ScannerComponentProps {
  onScanComplete?: (result: any) => void
}

export default function ScannerComponent({ onScanComplete }: ScannerComponentProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<{ category: number; method: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useCamera, setUseCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const initialState = {
    success: false,
    data: null,
    error: null,
  }

  const [state, formAction] = useFormState(scanMedicine, initialState)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setResult(null)
      setError(null)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleScan = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await scanMedicine(null, formData)
      if (result.success && result.data) {
        setResult(result.data)
        if (onScanComplete) {
          onScanComplete(result.data)
        }
      } else {
        throw new Error(result.error || "Failed to process image")
      }
    } catch (err: any) {
      setError(err.message || "Failed to process the image. Please try again.")
      console.error("Error scanning medicine:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const startCamera = async () => {
    setUseCamera(true)
    setFile(null)
    setPreview(null)
    setResult(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Could not access camera. Please check permissions.")
      setUseCamera(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setUseCamera(false)
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        canvas.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], "captured-image.jpg", { type: "image/jpeg" })
            setFile(capturedFile)
            setPreview(canvas.toDataURL("image/jpeg"))
            stopCamera()
          }
        }, "image/jpeg")
      }
    }
  }

  const resetScan = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append("image", file)
    handleScan(formData)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Medicine Scanner</CardTitle>
        <CardDescription>
          Take a photo or upload an image of your medicine to get disposal recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form ref={formRef} onSubmit={handleSubmit}>
          {useCamera ? (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg border border-gray-200"
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <Button onClick={captureImage} className="bg-green-500 hover:bg-green-600">
                  <Camera className="mr-2 h-4 w-4" /> Capture
                </Button>
              </div>
            </div>
          ) : (
            <>
              {preview ? (
                <div className="relative">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Medicine preview"
                    className="w-full rounded-lg border border-gray-200"
                    style={{ maxHeight: "400px", objectFit: "contain" }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 bg-white"
                    onClick={resetScan}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="bg-gray-100 p-4 rounded-full">
                      <ImageIcon className="h-8 w-8 text-gray-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Upload medicine image</h3>
                      <p className="text-sm text-gray-500">Drag and drop or click to browse</p>
                    </div>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="medicine-image"
                    />
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" /> Browse
                      </Button>
                      <Button type="button" variant="outline" onClick={startCamera}>
                        <Camera className="mr-2 h-4 w-4" /> Camera
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {error && <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">{error}</div>}

          {result && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                {result.method === "Recycle" && <Recycle className="h-8 w-8 text-green-500" />}
                {result.method === "Pharmacy Drop-Off" && <Package className="h-8 w-8 text-amber-500" />}
                {result.method === "Hazardous Waste" && <AlertTriangle className="h-8 w-8 text-red-500" />}
                <h3 className="text-xl font-semibold text-green-800">{result.method}</h3>
              </div>
              <p className="text-green-700">
                {result.method === "Recycle" && "This medicine container can be recycled with your regular recycling."}
                {result.method === "Pharmacy Drop-Off" &&
                  "Please return this medicine to your local pharmacy for safe disposal."}
                {result.method === "Hazardous Waste" &&
                  "This medicine requires special handling. Take it to a hazardous waste facility."}
              </p>
            </div>
          )}

          {file && !result && !useCamera && (
            <Button type="submit" className="bg-green-500 hover:bg-green-600 w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" /> Analyze Medicine
                </>
              )}
            </Button>
          )}
        </form>

        {useCamera && (
          <Button variant="outline" onClick={stopCamera}>
            Cancel
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

import { Recycle, Package, AlertTriangle } from "lucide-react"

