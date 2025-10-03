import AdminSidebar from '../admin/AdminSidebar';
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminSidebarExample() {
  return (
    <SidebarProvider>
      <div className="h-screen w-full dark">
        <AdminSidebar />
      </div>
    </SidebarProvider>
  );
}
