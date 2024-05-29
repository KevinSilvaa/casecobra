import { MaxWidthWrapper } from '@/components/max-width-wrapper'

import { Steps } from './_components/steps'

export default function ConfigureLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MaxWidthWrapper className="flex flex-1 flex-col">
      <Steps />
      {children}
    </MaxWidthWrapper>
  )
}
