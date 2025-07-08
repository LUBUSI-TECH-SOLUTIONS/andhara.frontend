import { useEffect, useRef } from "react"
import { Outlet } from "react-router-dom"
import AppSidebar from "@/components/appSidebar"
import SiteHeader from "@/components/siteHeader"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useAuthStore } from "@/app/stores/authStore"

const MainLayout = () => {
  const { setLastActive } = useAuthStore()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isWaitingRef = useRef(false)


  useEffect(() => {
    const handleUserActivity = () => {
      if (!isWaitingRef.current) {
        setLastActive()
        isWaitingRef.current = true
        timeoutRef.current = setTimeout(() => {
          isWaitingRef.current = false
        }, 1000)
      }
    }

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "contextmenu",
    ]

    events.forEach(event =>
      window.addEventListener(event, handleUserActivity)
    )

    return () => {
      events.forEach(event =>
        window.removeEventListener(event, handleUserActivity)
      )
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [setLastActive])
  
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <section
          className="p-5">
          <Outlet />
        </section>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default MainLayout