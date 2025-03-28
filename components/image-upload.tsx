"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, X } from "lucide-react"

export function ImageUpload() {
  const [images, setImages] = useState<string[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      setImages([...images, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = [...images]
    updatedImages.splice(index, 1)
    setImages(updatedImages)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Card key={index} className="relative overflow-hidden aspect-square">
            <img
              src={image || "/placeholder.svg"}
              alt={`Uploaded image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 rounded-full"
              onClick={() => removeImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </Card>
        ))}

        <Card className="flex items-center justify-center aspect-square border-dashed cursor-pointer hover:bg-muted/50 transition-colors">
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">Upload</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
          </label>
        </Card>
      </div>

      {images.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {images.length} image{images.length !== 1 ? "s" : ""} uploaded
        </p>
      )}
    </div>
  )
}

