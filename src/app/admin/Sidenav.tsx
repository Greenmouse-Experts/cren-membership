import { useEffect, useState, type ComponentType } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  GalleryHorizontalEnd,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  Megaphone,
  Repeat,
  ReceiptText,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

import { NavLink, useNavigate } from "@/lib/router-compat";
import logo from "../image/logo.png";
import logoMark from "../image/logo-mark.png";
import type { AdminProfile } from "@/types/api";
import { cn } from "@/lib/utils";
import {
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
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type NavLeaf = {
  label: string;
  to: string;
  icon: ComponentType<{ className?: string }>;
  exact?: boolean;
};

type NavGroup = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  children: { label: string; to: string }[];
};

type NavSection = {
  label: string;
  items: (NavLeaf | NavGroup)[];
};

const isGroup = (item: NavLeaf | NavGroup): item is NavGroup => "children" in item;

const sections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", to: "/admin", icon: LayoutDashboard, exact: true },
      { label: "Members", to: "/admin/member", icon: Users },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        label: "Subscriptions",
        icon: Repeat,
        children: [
          { label: "Plans", to: "/admin/subscription/list" },
          { label: "Banks", to: "/admin/subscription/bank" },
        ],
      },
      {
        label: "Dues",
        icon: ReceiptText,
        children: [
          { label: "Banks", to: "/admin/dues/bank" },
          { label: "Categories", to: "/admin/dues/category" },
          { label: "Dues list", to: "/admin/dues/list" },
        ],
      },
      {
        label: "Payments",
        icon: Wallet,
        children: [
          { label: "Dues", to: "/admin/payments/dues" },
          { label: "Subscriptions", to: "/admin/payments/subscrition" },
        ],
      },
    ],
  },
  {
    label: "Engagement",
    items: [
      { label: "Announcements", to: "/admin/announcements", icon: Megaphone },
      { label: "Notifications", to: "/admin/notify", icon: Bell },
      { label: "Messages", to: "/admin/messages", icon: MessagesSquare },
      { label: "Gallery", to: "/admin/gallery", icon: GalleryHorizontalEnd },
    ],
  },
  {
    label: "System",
    items: [{ label: "Settings", to: "/admin/settings", icon: Settings }],
  },
];

const isPathActive = (pathname: string, to: string, exact = false) => {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (to === "/admin") return clean === "/admin";
  return exact ? clean === to : clean === to || clean.startsWith(`${to}/`);
};

const initials = (profile?: AdminProfile) => {
  const first = profile?.first_name?.[0] ?? "";
  const last = profile?.last_name?.[0] ?? "";
  const value = `${first}${last}`.trim();
  if (value) return value.toUpperCase();
  const fallback = profile?.username || profile?.email || "AD";
  return fallback.slice(0, 2).toUpperCase();
};

export const Sidenav = ({ profile }: { profile?: AdminProfile | undefined }) => {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { state, isMobile, setOpenMobile } = useSidebar();
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const closeMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    profile?.username ||
    "Super Admin";
  const displayEmail = profile?.email || "Administrator";

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b">
        <NavLink to="/admin" onClick={closeMobile} className="flex items-center gap-2 px-1 py-1">
          {state === "collapsed" ? (
            <img src={logoMark} alt="Council For Renewable Energy Nigeria" className="h-8 w-auto" />
          ) : (
            <img src={logo} alt="Council For Renewable Energy Nigeria" className="h-9 w-auto" />
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) =>
                  isGroup(item) ? (
                    <CollapsibleNav
                      key={item.label}
                      group={item}
                      pathname={pathname}
                      onNavigate={closeMobile}
                    />
                  ) : (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        asChild
                        isActive={isPathActive(pathname, item.to, item.exact)}
                        tooltip={item.label}
                      >
                        <NavLink to={item.to} onClick={closeMobile}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ),
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
          <Avatar className="h-9 w-9 border">
            {profile?.avatar ? <AvatarImage src={profile.avatar} alt={displayName} /> : null}
            <AvatarFallback className="text-xs font-semibold">{initials(profile)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium text-sidebar-foreground">{displayName}</p>
            <p className="truncate text-xs text-muted-foreground">{displayEmail}</p>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              onClick={() => setLogoutOpen(true)}
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out of the admin portal?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to manage members, dues, and payments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
};

function CollapsibleNav({
  group,
  pathname,
  onNavigate,
}: {
  group: NavGroup;
  pathname: string;
  onNavigate: () => void;
}) {
  const active = group.children.some((child) => isPathActive(pathname, child.to));
  const [open, setOpen] = useState(active);

  useEffect(() => {
    if (active) setOpen(true);
  }, [active]);

  return (
    <Collapsible open={open} onOpenChange={setOpen} asChild>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton isActive={active} className="justify-between">
            <span className="flex items-center gap-2">
              <group.icon className="h-4 w-4" />
              <span>{group.label}</span>
            </span>
            <ChevronRight
              className={cn(
                "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                open && "rotate-90",
              )}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {group.children.map((child) => (
              <SidebarMenuSubItem key={child.to}>
                <SidebarMenuSubButton
                  asChild
                  isActive={isPathActive(pathname, child.to)}
                  className="cursor-pointer"
                >
                  <NavLink to={child.to} onClick={onNavigate}>
                    <span>{child.label}</span>
                  </NavLink>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export default Sidenav;
