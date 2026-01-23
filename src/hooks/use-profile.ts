"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Profile } from "@/types/database.types"

// Custom event name for profile refresh
export const PROFILE_REFRESH_EVENT = 'profile:refresh'

export function useProfile(initialProfile?: Profile | null) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile || null)
  const [isLoading, setIsLoading] = useState(!initialProfile)
  const [error, setError] = useState<string | null>(null)
  const profileIdRef = useRef<string | null>(initialProfile?.id || null)

  const fetchProfile = useCallback(async () => {
    const supabase = createClient()
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
  }, [])

  useEffect(() => {
    const supabase = createClient()

    // Initial fetch if no initialProfile provided
    if (!initialProfile) {
      fetchProfile()
    }

    // Subscribe to profile changes via Supabase Realtime
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

    // Listen for custom profile refresh events (triggered by notifications)
    const handleProfileRefresh = () => {
      fetchProfile()
    }
    window.addEventListener(PROFILE_REFRESH_EVENT, handleProfileRefresh)

    return () => {
      supabase.removeChannel(channel)
      window.removeEventListener(PROFILE_REFRESH_EVENT, handleProfileRefresh)
    }
  }, [initialProfile, fetchProfile])

  const refetch = useCallback(async () => {
    setIsLoading(true)
    await fetchProfile()
  }, [fetchProfile])

  return { profile, isLoading, error, refetch }
}

// Helper function to trigger profile refresh from anywhere
export function triggerProfileRefresh() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PROFILE_REFRESH_EVENT))
  }
}
