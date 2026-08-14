import { SidebarContextProvider } from "./_Sidebar/SidebarContextProvider";
import Sidebar from "./_Sidebar/Sidebar";

export default function Layout({
   children,
}: Readonly<{ children: React.ReactNode }>) {
   return (
      <SidebarContextProvider>
         <Sidebar>{children}</Sidebar>
      </SidebarContextProvider>
   );
}
