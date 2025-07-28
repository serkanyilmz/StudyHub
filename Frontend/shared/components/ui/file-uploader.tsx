"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, File, X, CheckCircle } from "lucide-react"

interface FileWithProgress {
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
}

export function FileUploader() {
  const [files, setFiles] = useState<FileWithProgress[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      status: "uploading" as const,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate upload progress
    newFiles.forEach((fileWithProgress) => {
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.file === fileWithProgress.file) {
              const newProgress = Math.min(f.progress + 10, 100)
              return {
                ...f,
                progress: newProgress,
                status: newProgress === 100 ? "completed" : "uploading",
              }
            }
            return f
          }),
        )
      }, 200)

      setTimeout(() => clearInterval(interval), 2000)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: true,
  })

  const removeFile = (fileToRemove: File) => {
    setFiles((prev) => prev.filter((f) => f.file !== fileToRemove))
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">Drop the PDF files here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">Drag and drop PDF files here, or click to select files</p>
                <p className="text-sm text-gray-500">Supports multiple PDF files up to 10MB each</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Uploading Files</h3>
            <div className="space-y-3">
              {files.map((fileWithProgress, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <File className="h-5 w-5 text-red-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{fileWithProgress.file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={fileWithProgress.progress} className="h-2 flex-1" />
                      <span className="text-xs text-gray-500">{fileWithProgress.progress}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {fileWithProgress.status === "completed" && <CheckCircle className="h-5 w-5 text-green-600" />}
                    <Button size="sm" variant="ghost" onClick={() => removeFile(fileWithProgress.file)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
