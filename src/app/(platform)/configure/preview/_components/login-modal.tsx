import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs'
import Image from 'next/image'
import type { Dispatch, SetStateAction } from 'react'

import { buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/utils/cn'

type LoginModalProps = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export function LoginModal({ isOpen, setIsOpen }: LoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogPortal>
        <DialogContent className="absolute">
          <DialogHeader>
            <div className="relative mx-auto mb-2 size-24">
              <Image
                src="/snake-1.png"
                alt="Snake Image"
                fill
                sizes="100%"
                className="object-contain"
              />
            </div>

            <DialogTitle className="text-center text-3xl font-bold tracking-tight text-gray-900">
              Log in to continue
            </DialogTitle>

            <DialogDescription className="py-2 text-center text-base">
              <span className="font-medium text-zinc-900">
                Your configuration was saved!
              </span>{' '}
              Please login or create an account to complete your purchase.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
            <LoginLink className={cn(buttonVariants({ variant: 'outline' }))}>
              Login
            </LoginLink>
            <RegisterLink
              className={cn(buttonVariants({ variant: 'default' }))}
            >
              Sign up
            </RegisterLink>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
