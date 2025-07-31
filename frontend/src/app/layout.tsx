'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthProvider } from '@/components/AuthProvider' // Import your AuthProvider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // Import React Query

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Create QueryClient instance
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }))

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getSession()
      console.log('🔐 Supabase Session:', data?.session)

      if (error) {
        console.error('❌ Error fetching session:', error.message)
      }
    }

    checkSession()
  }, [])

  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}