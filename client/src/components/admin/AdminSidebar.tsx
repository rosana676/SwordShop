import { Users, ShoppingBag, Shield, Flag, MessageSquare, Settings, LayoutDashboard, LogOut } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Sword } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard, testId: "dashboard" },
  { title: "Usuários", url: "/admin/users", icon: Users, testId: "users" },
  { title: "Vendedores", url: "/admin/sellers", icon: Shield, testId: "sellers" },
  { title: "Produtos", url: "/admin/products", icon: ShoppingBag, testId: "products" },
  { title: "Denúncias", url: "/admin/reports", icon: Flag, testId: "reports" },
  { title: "Suporte", url: "/admin/support", icon: MessageSquare, testId: "support" },
  { title: "Configurações", url: "/admin/settings", icon: Settings, testId: "settings" },
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  
  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Sword className="w-6 h-6 text-primary" />
          <div>
            <p className="font-heading font-bold text-lg" data-testid="text-sidebar-title">Sword Shop</p>
            <p className="text-xs text-muted-foreground" data-testid="text-sidebar-subtitle">Administração</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild data-testid={`button-nav-${item.testId}`}>
                    <a href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} data-testid="button-logout">
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
