import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@padel/ui";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  Building2,
  CalendarDays,
  ChevronDown,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  MapPin,
  Medal,
  Search,
  Settings,
  Trophy,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import type { AdminPageViewModel } from "./admin-view-model.js";

interface AdminSidebarProps {
  model: AdminPageViewModel;
  children: React.ReactNode;
  onSignOut: () => Promise<void>;
}

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Tournaments",
    icon: Trophy,
    items: [
      { title: "All Tournaments", url: "/admin/tournaments" },
      { title: "Create Tournament", url: "/admin/tournaments/create" },
      { title: "Brackets", url: "/admin/tournaments/brackets" },
      { title: "Results", url: "/admin/tournaments/results" },
    ],
  },
  {
    title: "Categories",
    icon: FolderKanban,
    items: [
      { title: "All Categories", url: "/admin/categories" },
      { title: "Create Category", url: "/admin/categories/create" },
    ],
  },
  {
    title: "Players",
    icon: Users,
    items: [
      { title: "All Players", url: "/admin/players" },
      { title: "Register Player", url: "/admin/players/register" },
      { title: "Rankings", url: "/admin/players/rankings" },
    ],
  },
  {
    title: "Teams",
    icon: UserPlus,
    items: [
      { title: "All Teams", url: "/admin/teams" },
      { title: "Create Team", url: "/admin/teams/create" },
    ],
  },
  {
    title: "Courts",
    icon: MapPin,
    items: [
      { title: "All Courts", url: "/admin/courts" },
      { title: "Add Court", url: "/admin/courts/create" },
      { title: "Reservations", url: "/admin/courts/reservations" },
    ],
  },
  {
    title: "Schedule",
    url: "/admin/schedule",
    icon: CalendarDays,
  },
];

const secondaryNavItems = [
  {
    title: "Club Settings",
    url: "/admin/settings",
    icon: Building2,
  },
  {
    title: "Account",
    url: "/admin/account",
    icon: Settings,
  },
];

function NavItem({
  item,
  pathname,
}: {
  item: (typeof mainNavItems)[0];
  pathname: string;
}) {
  const isActive = item.url
    ? pathname === item.url
    : item.items?.some((sub) => pathname === sub.url);

  if (item.items) {
    return (
      <Collapsible asChild defaultOpen={isActive} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title} isActive={isActive}>
              {item.icon && <item.icon className="size-4" />}
              <span>{item.title}</span>
              <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === subItem.url}
                  >
                    <Link to={subItem.url}>{subItem.title}</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
        <Link to={item.url ?? "/admin"}>
          {item.icon && <item.icon className="size-4" />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function AdminHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tournaments, players..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          <Badge className="absolute -right-1 -top-1 size-5 items-center justify-center rounded-full p-0 text-xs">
            3
          </Badge>
        </Button>
      </div>
    </header>
  );
}

export function AdminLayout({ model, children, onSignOut }: AdminSidebarProps) {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/admin";

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="sidebar">
        <SidebarHeader className="border-b border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link to="/admin">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Medal className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">PadelHub</span>
                    <span className="truncate text-xs text-muted-foreground">
                      Club Admin
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNavItems.map((item) => (
                  <NavItem key={item.title} item={item} pathname={pathname} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {secondaryNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.url}
                    >
                      <Link to={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="size-8">
                      <AvatarImage src="/avatars/admin.jpg" alt="Admin" />
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">John Doe</span>
                      <span className="truncate text-xs text-muted-foreground">
                        Club Administrator
                      </span>
                    </div>
                    <ChevronDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="top"
                  align="start"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="size-8">
                        <AvatarImage src="/avatars/admin.jpg" alt="Admin" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">John Doe</span>
                        <span className="truncate text-xs text-muted-foreground">
                          john@padelclub.com
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/admin/account">
                      <Settings className="mr-2 size-4" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/">
                      <LogOut className="mr-2 size-4" />
                      Sign Out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <AdminHeader />
      </SidebarInset>
    </SidebarProvider>
  );
}
