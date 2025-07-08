import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/app/stores/authStore";

import { House, LogOut, Store, Users } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu } from "@/components/ui/sidebar";
import NavMain from "@/components/navMain";
import { Button } from "@/components/ui/button";

const data = [
  {
    title: "Dashboard",
    icon: House,
    url: "/dashboard"
  },
  {
    title: "Clientes",
    icon: Users,
    url: "/clientes"
  },
  {
    title: "Productos",
    icon: Store,
    url: "/productos"
  }
]
const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { logout, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    if (!isAuthenticated) {
      navigate("/login")
    }
  }

  return (
    <Sidebar  
      collapsible="offcanvas"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <Link to={"/"}>
            <img src="./img/logo-negative.svg" alt="Andhara logo" className="h-10 w-10" />
          </Link>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data} />
      </SidebarContent>
      <SidebarFooter>
        <Button 
          variant="ghost" 
          className="flex text-primary" 
          onClick={handleLogout}>
          Salir
          <LogOut className="text-primary" />
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar