"use client";

import { AppConfig } from "@/app/core/config";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  IconBlocks,
  IconCalendarClock,
  IconCash,
  IconChevronDown,
  IconDashboard,
  IconDeviceLaptop,
  IconFolder,
  IconPin,
  IconReceipt2,
  IconUserCog,
  IconUsersGroup,
  type Icon,
} from "@tabler/icons-react";
import clsx from "clsx";
import {
  ArrowDownIcon as BanknoteArrowDown,
  CalendarX2,
  HandCoins,
  Wallet
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, useEffect, useState } from "react";

type NavItem =
  | {
      type: "item";
      title: string;
      url: string;
      icon?: Icon;
    }
  | {
      type: "group";
      group: string;
      icon?: Icon;
      items: {
        title: string;
        url: string;
        icon?: Icon;
      }[];
    };

const navItems: NavItem[] = [
  {
    type: "item",
    title: "Dashboard",
    url: "/adminspace",
    icon: IconDashboard,
  },
  {
    type: "item",
    title: "Client",
    url: "/adminspace/clients",
    icon: IconUserCog,
  },
  {
    type: "group",
    group: "Projects",
    icon: IconFolder,
    items: [
      {
        title: "Projects",
        url: "/adminspace/projects",
        icon: IconDeviceLaptop,
      },
      {
        title: "Milestones",
        url: "/adminspace/projects/milestones",
        icon: IconPin,
      },
    ],
  },
  {
    type: "group",
    group: "Human Resources",
    icon: IconUsersGroup,
    items: [
      {
        title: "Departments",
        url: "/adminspace/human-resources/department",
        icon: IconBlocks,
      },
      {
        title: "Employees",
        url: "/adminspace/human-resources/employees",
        icon: IconUsersGroup,
      },
      {
        title: "Attendance",
        url: "/adminspace/human-resources/attendance",
        icon: IconCalendarClock,
      },
      {
        title: "Leave Requests",
        url: "/adminspace/human-resources/leave-requests",
        icon: CalendarX2 as Icon,
      },
    ],
  },
  {
    type: "group",
    group: "Finance",
    icon: IconCash,
    items: [
      {
        title: "Payroll",
        url: "/adminspace/finance/payroll",
        icon: Wallet as Icon,
      },
      {
        title: "Loan Requests",
        url: "/adminspace/finance/loan-requests",
        icon: HandCoins as Icon,
      },
      {
        title: "Expenses",
        url: "/adminspace/finance/expenses",
        icon: BanknoteArrowDown as Icon,
      },
    ],
  },
];

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  // Add this useEffect after the state declaration
  useEffect(() => {
    // Find which groups contain the current pathname
    const groupsToOpen: string[] = [];

    navItems.forEach((item) => {
      if (item.type === "group") {
        const hasActiveItem = item.items.some(
          (subItem) => pathname === subItem.url
        );
        if (hasActiveItem) {
          groupsToOpen.push(item.group);
        }
      }
    });

    setOpenGroups(groupsToOpen);
  }, [pathname]);

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const isActive = (url: string) => pathname === url;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-0"
            >
              <Link href="/adminspace">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={20}
                  height={20}
                  className="h-8 w-auto"
                />
                <span className="text-base font-semibold">
                  {AppConfig.appName}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupContent className="flex flex-col gap-1">
          <SidebarMenu>
            {navItems.map((item) => {
              if (item.type === "item") {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      asChild
                      className={clsx(
                        "flex items-center gap-2",
                        isActive(item.url) &&
                          "bg-muted text-primary font-medium"
                      )}
                    >
                      <Link href={item.url}>
                        {item.icon && <item.icon className="w-4 h-4" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }

              const isOpen = openGroups.includes(item.group);

              return (
                <div key={item.group}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => toggleGroup(item.group)}
                      className="flex items-center justify-between gap-2 font-semibold pr-2"
                    >
                      <div className="flex items-center gap-2">
                        {item.icon && <item.icon className="w-4 h-4" />}
                        <span>{item.group}</span>
                      </div>
                      <IconChevronDown
                        className={clsx(
                          "w-4 h-4 transition-transform duration-300 ease-in-out",
                          isOpen ? "rotate-180" : "rotate-0"
                        )}
                      />
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Replace the existing group items rendering with this animated version */}
                  <div
                    className={clsx(
                      "pl-3 overflow-hidden transition-all duration-300 ease-in-out",
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="py-1">
                      {item.items.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton
                            tooltip={subItem.title}
                            asChild
                            className={clsx(
                              "flex items-center gap-2 transition-colors duration-200",
                              isActive(subItem.url) &&
                                "bg-muted text-primary font-medium"
                            )}
                          >
                            <Link href={subItem.url}>
                              {subItem.icon && (
                                <subItem.icon className="w-4 h-4" />
                              )}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter>
        {session && session.user ? (
          <NavUser
            user={{
              name: session.user.name || "",
              email: session.user.email || "",
              avatar: session.user.image || "",
            }}
          />
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}
