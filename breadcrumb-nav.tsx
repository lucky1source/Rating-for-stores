"use client"

import { ChevronRight, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  const router = useRouter()

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-1 hover:bg-transparent"
        onClick={() => router.push("/dashboard")}
      >
        <Home className="h-4 w-4" />
      </Button>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 hover:bg-transparent text-muted-foreground hover:text-foreground"
              onClick={() => router.push(item.href!)}
            >
              {item.label}
            </Button>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
