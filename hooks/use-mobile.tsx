"use client"

import { useEffect, useState } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    // Helper function to check if the width is mobile
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Check on mount
    checkIsMobile()
    
    // Add resize listener
    window.addEventListener("resize", checkIsMobile)
    
    // Clean up
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])
  
  return isMobile
}
