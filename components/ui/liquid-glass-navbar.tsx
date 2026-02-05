import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./navigation-menu";

interface NavbarItem {
    title: string
    href: string
}

export default function LiquidGlassNavbar() {

    const navbarItems: NavbarItem[] = [
        { title: "Home", href: "#" },
        { title: "Projects", href: "#" },
        { title: "About", href: "#" },
        { title: "Contact", href: "#" },
    ]

    return (
        <div className="absolute inset-x-0 top-0 z-[9999] pointer-events-none flex justify-start px-4 pt-6">

            <div className="pointer-events-auto">
            
                <NavigationMenu>
                    <NavigationMenuList className="flex gap-3">
                        {
                            navbarItems.map((item) => (
                                <NavigationMenuItem key={item.title}>
                                    <NavigationMenuLink className="
                                        glass-card !border-0 dark text-foreground 
                                        cursor-pointer px-4 rounded-full
                                        transition duration-200 hover:scale-110
                                    ">
                                        {item.title}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))
                        }
                    </NavigationMenuList>
                </NavigationMenu>

            </div>
        </div>
    )

}