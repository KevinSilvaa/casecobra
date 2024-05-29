'use client'

import { Image, Loader2, MousePointerSquareDashed } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import Dropzone, { FileRejection } from 'react-dropzone'
import { toast } from 'sonner'

import { Progress } from '@/components/ui/progress'
import { useUploadThing } from '@/lib/uploadthing'
import { cn } from '@/utils/cn'

export default function UploadPage() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const router = useRouter()

  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: ([data]) => {
      const configId = data.serverData.configId
      startTransition(() => {
        router.push(`/configure/design?id=${configId}`)
      })
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress)
    },
  })

  function onDropAccepted(acceptedFiles: File[]) {
    startUpload(acceptedFiles, { configId: undefined })

    setIsDragOver(false)
  }

  function onDropRejected(rejectedFiles: FileRejection[]) {
    const [file] = rejectedFiles

    setIsDragOver(false)

    toast.error(`${file.file.type} type is not supported.`, {
      description: 'Please choose a PNG, JPG or JPEG image instead.',
    })
  }

  const [isPending, startTransition] = useTransition()

  return (
    <div
      className={cn(
        'relative my-16 flex size-full flex-1 flex-col items-center justify-center rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl',
        {
          'bg-blue-900/10 ring-blue-900/25': isDragOver,
        },
      )}
    >
      <div className="relative flex w-full flex-1 flex-col items-center justify-center">
        <Dropzone
          accept={{
            'image/png': ['.png'],
            'image/jpeg': ['.jpeg'],
            'image/jpg': ['.jpg'],
          }}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
          onDropAccepted={onDropAccepted}
          onDropRejected={onDropRejected}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              className="flex size-full flex-1 flex-col items-center justify-center"
              {...getRootProps()}
            >
              <input {...getInputProps()} />

              {isDragOver ? (
                <MousePointerSquareDashed className="mb-2 size-6 text-zinc-500" />
              ) : isUploading || isPending ? (
                <Loader2 className="mb-2 size-6 animate-spin text-zinc-500" />
              ) : (
                // eslint-disable-next-line jsx-a11y/alt-text
                <Image className="mb-2 size-6 text-zinc-500" />
              )}

              <div className="mb-2 flex flex-col justify-center text-sm text-zinc-700">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <p>Uploading...</p>
                    <Progress
                      value={uploadProgress}
                      className="mt-2 h-2 w-40 bg-gray-300"
                    />
                  </div>
                ) : isPending ? (
                  <div className="flex flex-col items-center">
                    <p>Redirecting, please wait...</p>
                  </div>
                ) : isDragOver ? (
                  <p>
                    <span className="font-semibold">Drop file</span> to upload
                  </p>
                ) : (
                  <p>
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                )}
              </div>

              {!isPending && (
                <p className="text-xs text-zinc-500">PNG, JPG, JPEG</p>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  )
}
