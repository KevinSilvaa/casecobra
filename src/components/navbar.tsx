import Link from 'next/link'
import { MaxWidthWrapper } from './max-width-wrapper'
import { cn } from '@/utils/cn'
import { buttonVariants } from './ui/button'
import { ArrowRight } from 'lucide-react'
import { Separator } from './ui/separator'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export async function Navbar() {
  const { getUser } = getKindeServerSession()

  const user = await getUser()

  const isAdmin = user?.email === process.env.ADMIN_EMAIL

  return (
    <nav className="sticky inset-x-0 top-0 z-[100] h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="z-40 flex font-semibold">
            case<span className="text-green-600">cobra</span>
          </Link>

          <div className="flex h-full items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/api/auth/logout"
                  className={cn(
                    buttonVariants({ size: 'sm', variant: 'ghost' }),
                  )}
                >
                  Sign out
                </Link>

                {isAdmin && (
                  <Link
                    href="/dashboard"
                    className={cn(
                      buttonVariants({ size: 'sm', variant: 'ghost' }),
                    )}
                  >
                    Dashboard ✨
                  </Link>
                )}

                <Link
                  href="/configure/upload"
                  className={cn(
                    buttonVariants({
                      size: 'sm',
                      className: 'hidden items-center gap-1 sm:flex',
                    }),
                  )}
                >
                  Create case
                  <ArrowRight className="ml-1.5 size-5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/api/auth/register"
                  className={cn(
                    buttonVariants({ size: 'sm', variant: 'ghost' }),
                  )}
                >
                  Sign up
                </Link>
                <Link
                  href="/api/auth/login"
                  className={cn(
                    buttonVariants({ size: 'sm', variant: 'ghost' }),
                  )}
                >
                  Login
                </Link>

                <Separator className="hidden h-8 w-px sm:block" />

                <Link
                  href="/configure/upload"
                  className={cn(
                    buttonVariants({
                      size: 'sm',
                      className: 'hidden items-center gap-1 sm:flex',
                    }),
                  )}
                >
                  Create case
                  <ArrowRight className="ml-1.5 size-5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}
