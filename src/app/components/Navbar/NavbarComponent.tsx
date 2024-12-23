"use client";
import { Button, AvatarIcon, Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar } from "@nextui-org/react";

import routes from "./routes";
import { usePathname, useRouter } from "next/navigation";

export default function NavbarComponent() {

    const pathname = usePathname();
    const router = useRouter();

    function handleRoute(href: string, _: any) {
        router.push(href)
    }

    return (
        <Navbar>
            <NavbarBrand>
                <p className="font-bold text-inherit">LOGO</p>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {routes.map((route) => (
                    <NavbarItem key={route.href}>
                        <Button disableRipple onPress={(_) => handleRoute(route.href, _)} color={`${pathname === route.href ? "primary" : "primary"}`}
                            size="sm"
                            className={` font-semibold ${pathname === route.href ? "text-white" : "text-secondary/70"}`}
                            variant={`${pathname === route.href ? "solid" : "flat"}`}
                            href={route.href}>
                            {route.label}
                        </Button>
                    </NavbarItem>
                ))}
            </NavbarContent>

            <NavbarContent as="div" justify="end">
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Avatar
                            isBordered
                            as="button"
                            className="transition-transform"
                            color="default"
                            size="sm"
                            icon={<AvatarIcon />}
                            classNames={
                                {
                                    base: "bg-white",
                                    icon: "text-black/20",
                                }
                            }
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="profile" className="h-14 gap-2">
                            <p className="font-semibold">Signed in as</p>
                            <p className="font-semibold">zoey@example.com</p>
                        </DropdownItem>
                        <DropdownItem key="settings">My Settings</DropdownItem>
                        <DropdownItem key="team_settings">Team Settings</DropdownItem>
                        <DropdownItem key="analytics">Analytics</DropdownItem>
                        <DropdownItem key="system">System</DropdownItem>
                        <DropdownItem key="configurations">Configurations</DropdownItem>
                        <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                        <DropdownItem key="logout" color="danger">
                            Log Out
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </Navbar>
    );
}