'use client'

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

type PaginationProps = {
  pageIndex: number
  perPage: number
  totalCount: number
  onPageChange: (pageIndex: number) => void
}

export function Pagination({
  pageIndex,
  perPage,
  totalCount,
  onPageChange,
}: PaginationProps) {
  const pages = Math.ceil(totalCount / perPage) || 1

  return (
    <div className="mt-auto flex items-center justify-between">
      <span className="text-xs text-muted-foreground sm:text-sm">
        Total de {totalCount} item(s)
      </span>

      <div className="flex items-center gap-6 lg:gap-8">
        <div className="text-xs font-medium sm:text-sm">
          Página {pageIndex + 1} de {pages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onPageChange(0)}
            variant="outline"
            className="size-8 p-0"
            disabled={pageIndex === 0}
          >
            <ChevronsLeft className="size-4" />
            <span className="sr-only">Primeira página</span>
          </Button>
          <Button
            onClick={() => onPageChange(pageIndex - 1)}
            variant="outline"
            className="size-8 p-0"
            disabled={pageIndex === 0}
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Página anterior</span>
          </Button>
          <Button
            onClick={() => onPageChange(pageIndex + 1)}
            variant="outline"
            className="size-8 p-0"
            disabled={pages <= pageIndex + 1}
          >
            <ChevronRight className="size-4" />
            <span className="sr-only">Próxima página</span>
          </Button>
          <Button
            onClick={() => onPageChange(pages - 1)}
            variant="outline"
            className="size-8 p-0"
            disabled={pages <= pageIndex + 1}
          >
            <ChevronsRight className="size-4" />
            <span className="sr-only">Última página</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

Pagination.Skeleton = function PaginationSkeleton() {
  return (
    <div className="mt-auto flex items-center justify-between">
      <Skeleton className="h-8 w-[60px] sm:h-5 sm:w-32" />

      <div className="flex items-center gap-6 lg:gap-8">
        <div>
          <Skeleton className="h-8 w-12 sm:h-5 sm:w-24" />
        </div>

        <div className="flex items-center gap-2">
          <Button disabled variant="outline" className="size-8 p-0">
            <ChevronsLeft className="size-4" />
            <span className="sr-only">Primeira página</span>
          </Button>
          <Button disabled variant="outline" className="size-8 p-0">
            <ChevronLeft className="size-4" />
            <span className="sr-only">Página anterior</span>
          </Button>
          <Button disabled variant="outline" className="size-8 p-0">
            <ChevronRight className="size-4" />
            <span className="sr-only">Próxima página</span>
          </Button>
          <Button disabled variant="outline" className="size-8 p-0">
            <ChevronsRight className="size-4" />
            <span className="sr-only">Última página</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
