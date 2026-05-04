import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
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
    icon: (
      <svg
        aria-hidden="true"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="size-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 12v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    title: "Competitions",
    items: [
      { title: "All Competitions", url: "/admin/competitions" },
      { title: "Create Competition", url: "/admin/competitions/create" },
    ],
  },
  {
    title: "Categories",
    items: [{ title: "All Categories", url: "/admin/categories" }],
  },
  {
    title: "Participants",
    items: [{ title: "All Participants", url: "/admin/participants" }],
  },
  {
    title: "Matches",
    items: [{ title: "All Matches", url: "/admin/matches" }],
  },
];

function NavItem({
  item,
  pathname,
}: {
  item: (typeof mainNavItems)[0];
  pathname: string;
}) {
  const [isOpen, setIsOpen] = useState(
    item.url
      ? pathname === item.url
      : item.items?.some((sub) => pathname === sub.url),
  );

  if (item.items) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.title}
          isActive={item.items.some((sub) => pathname === sub.url)}
          onClick={() => setIsOpen(!isOpen)}
        >
          {item.icon}
          <span>{item.title}</span>
          <svg
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={`ml-auto size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </SidebarMenuButton>
        {isOpen && (
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
        )}
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        isActive={pathname === item.url}
      >
        <Link to={item.url ?? "/admin"}>
          {item.icon}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
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
              <SidebarMenuButton menuSize="lg" asChild>
                <Link to="/admin">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <svg
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.803 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.803 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.803 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.803 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.803 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.803 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.803-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.803-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Padel</span>
                    <span className="truncate text-xs text-muted-foreground">
                      Admin Panel
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
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    menuSize="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="size-8">
                      <AvatarImage src="" alt={model.userName} />
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        {model.userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {model.userName}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {model.userEmail}
                      </span>
                    </div>
                    <svg
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="ml-auto size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
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
                        <AvatarImage src="" alt={model.userName} />
                        <AvatarFallback>{model.userInitials}</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {model.userName}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {model.userEmail}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onSignOut}>
                    <svg
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="mr-2 size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
      <div className="flex flex-1 flex-col md:ml-[--sidebar-width] group-data-[state=collapsed]/sidebar-wrapper:md:ml-[--sidebar-width-icon] transition-[margin] duration-200 ease-linear">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-px bg-border" />
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/admin" className="hover:text-foreground">
              Admin
            </Link>
            {pathname !== "/admin" && (
              <>
                <svg
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="size-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span className="text-foreground">
                  {pathname
                    .split("/")
                    .filter(Boolean)
                    .slice(1)
                    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                    .join(" / ")}
                </span>
              </>
            )}
          </nav>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
