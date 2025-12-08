'use client'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface MobileActionMenuProps {
  children: React.ReactNode
  className?: string
}

export function MobileActionMenu({ children, className }: MobileActionMenuProps) {
  const isMobile = useIsMobile()
  
  if (!isMobile) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-6 w-6 p-0 hover:bg-muted ${className}`}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// 重新导出 DropdownMenuItem 和 DropdownMenuSeparator 以便在菜单中使用
export { DropdownMenuItem as MobileMenuItem, DropdownMenuSeparator as MobileSeparator } from "@/components/ui/dropdown-menu"
