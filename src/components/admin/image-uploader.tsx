'use client'

import * as React from 'react'
import Image from 'next/image'
import { Upload, Link2, FolderOpen, X, Loader2, Plus, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { convertImageUrl } from '@/lib/image-utils'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  label?: string
  maxImages?: number
}

export function ImageUploader({ images, onChange, label = 'Imágenes', maxImages = 20 }: ImageUploaderProps) {
  const [urlInput, setUrlInput] = React.useState('')
  const [folderInput, setFolderInput] = React.useState('')
  const [uploading, setUploading] = React.useState(false)
  const [loadingFolder, setLoadingFolder] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const addImage = (url: string) => {
    if (images.length >= maxImages) {
      toast.error(`Máximo ${maxImages} imágenes`)
      return
    }
    if (url.trim()) {
      onChange([...images, url.trim()])
    }
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const newImages: string[] = []
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} no es una imagen`)
          continue
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} es muy grande (máx 10MB)`)
          continue
        }
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (data.success) {
          newImages.push(data.url)
        } else {
          toast.error(`Error subiendo ${file.name}`)
        }
      }
      if (newImages.length > 0) {
        onChange([...images, ...newImages])
        toast.success(`${newImages.length} imagen(es) subida(s)`)
      }
    } catch {
      toast.error('Error al subir archivos')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleUrlAdd = () => {
    if (urlInput.trim()) {
      addImage(urlInput.trim())
      setUrlInput('')
      toast.success('Imagen añadida')
    }
  }

  const handleFolderLoad = async () => {
    if (!folderInput.trim()) return
    setLoadingFolder(true)
    try {
      const res = await fetch('/api/gdrive-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderUrl: folderInput.trim() }),
      })
      const data = await res.json()
      if (data.success && data.images.length > 0) {
        const remaining = maxImages - images.length
        const toAdd = data.images.slice(0, remaining)
        onChange([...images, ...toAdd])
        toast.success(`${toAdd.length} imagen(es) cargada(s) de Google Drive`, {
          description: data.images.length > remaining ? `Solo se cargaron ${remaining} de ${data.images.length} (límite)` : undefined,
        })
        setFolderInput('')
      } else {
        toast.error(data.error || 'No se encontraron imágenes en la carpeta')
      }
    } catch {
      toast.error('Error al cargar imágenes de Google Drive')
    } finally {
      setLoadingFolder(false)
    }
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold flex items-center gap-1.5">
        <ImageIcon className="h-3.5 w-3.5 text-gold" />
        {label} ({images.length}/{maxImages})
      </Label>

      {/* Upload buttons row */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* File upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
          className="flex-1 h-10"
        >
          {uploading ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Subiendo...</>
          ) : (
            <><Upload className="h-4 w-4 mr-2" /> Subir archivos</>
          )}
        </Button>

        {/* URL add */}
        <div className="flex flex-1 gap-1">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlAdd())}
            placeholder="Pegar URL de imagen"
            className="h-10"
            disabled={images.length >= maxImages}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleUrlAdd}
            disabled={!urlInput.trim() || images.length >= maxImages}
            className="h-10 px-3 shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Google Drive folder */}
      <div className="flex gap-1">
        <div className="relative flex-1">
          <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={folderInput}
            onChange={(e) => setFolderInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleFolderLoad())}
            placeholder="Link de carpeta de Google Drive (pública)"
            className="pl-9 h-10"
            disabled={loadingFolder || images.length >= maxImages}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleFolderLoad}
          disabled={!folderInput.trim() || loadingFolder || images.length >= maxImages}
          className="h-10 px-3 shrink-0"
        >
          {loadingFolder ? <Loader2 className="h-4 w-4 animate-spin" /> : <><FolderOpen className="h-4 w-4 mr-1.5" /> Cargar</>}
        </Button>
      </div>

      {/* Image preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((img, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
              <img
                src={convertImageUrl(img)}
                alt={`Imagen ${i + 1}`}
                className="object-cover w-full h-full"
                onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=IMG&size=120&background=0f2438&color=c9a227' }}
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
              <span className="absolute bottom-1 left-1 text-[9px] font-medium bg-black/60 text-white px-1.5 py-0.5 rounded">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px] text-muted-foreground">
        Sube archivos, pega URLs, o carga una carpeta de Google Drive pública.
      </p>
    </div>
  )
}
