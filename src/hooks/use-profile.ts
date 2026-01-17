"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Profile } from "@/types/database.types"

export function useProfile(initialProfile?: Profile | null) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile || null)
  const [isLoading, setIsLoading] = useState(!initialProfile)
  const [error, setError] = useState<string | null>(null)
  const profileIdRef = useRef<string | null>(initialProfile?.id || null)

  useEffect(() => {
    const supabase = createClient()

    async function fetchProfile() {
      if (initialProfile) {
        // If we have initial profile, we might still want to refresh it or just rely on it.
        // But for subscription we need the ID.
        // If initialProfile is provided, we can skip initial fetch IF we trust it.
        // But `initialProfile` prop might change? No, usually passed from server once.
        return
      }
      
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setIsLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error
        setProfile(data)
        profileIdRef.current = data?.id ?? null
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()

    // Subscribe to profile changes
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          if (payload.new && profileIdRef.current && (payload.new as Profile).id === profileIdRef.current) {
            setProfile(payload.new as Profile)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const refetch = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (data) setProfile(data)
    }
    setIsLoading(false)
  }

  return { profile, isLoading, error, refetch }
}
