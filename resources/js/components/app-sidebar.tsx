import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    UserPlus,
    RefreshCw,
    Trophy,
    FileText,
    Globe
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const riderNavItems: NavItem[] = [
    {
        title: 'Rider Registration',
        href: '/rider/registration',
        icon: UserPlus,
    },
    {
        title: 'Rider Renewal',
        href: '/rider/renewal',
        icon: RefreshCw,
    },
];

const competitionNavItems: NavItem[] = [
    {
        title: 'Show Jumping Entry',
        href: '/jumping/entry',
        icon: Trophy,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'UAEERF Website',
        href: 'https://www.emiratesequestrian.ae',
        icon: Globe,
    },
    {
        title: 'Documentation',
        href: '#',
        icon: FileText,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />

                <SidebarGroup className="px-2 py-0 mt-4">
                    <SidebarGroupLabel>Rider Services</SidebarGroupLabel>
                    <NavMain items={riderNavItems} />
                </SidebarGroup>

                <SidebarGroup className="px-2 py-0 mt-4">
                    <SidebarGroupLabel>Competitions</SidebarGroupLabel>
                    <NavMain items={competitionNavItems} />
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
