'use client'

import Link from 'next/link'
import { Button } from '@/components/ui'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-2">Страница не найдена</h2>
          <p className="text-muted-foreground">
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              На главную
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
        </div>
      </div>
    </div>
  )
}

