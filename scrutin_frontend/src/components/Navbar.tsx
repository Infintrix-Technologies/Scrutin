import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Link, NavLink } from "react-router-dom";
import { MenuIcon } from "./Icons";
import Logo from "./Logo";

const navitems = [
  {
    title: "Assessments",
    href: "/assessments",
  },
  {
    title: "Candidates",
    href: "/candidates",
  },
  {
    title: "Admin Reports",
    href: "/admin_reports",
  },
  {
    title: "Job Applicants",
    href: "/applicants",
  },
  {
    title: "Jobs",
    href: "/jobs",
  },
];
export default function Navbar() {

  return (
    <>
    <header className="flex bg-[#f4f4f8] justify-between h-16 border-b-4  w-full shrink-0 items-center px-4 md:px-6 sticky top-0 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Link to="/">
            <Logo />
          </Link>
          <div className="grid gap-2 py-6">
           

            {navitems?.map((item, index) => {
              // const isActive = activePath === item.href;
            return (
              <NavLink
              
              key={index}
              to={item.href}
              
              className={`flex w-full items-center py-2 text-lg font-semibold`}
              >
              {item?.title}
            </NavLink>
            );
          })}
          </div>
        </SheetContent>
      </Sheet>
      <Link to="/" className="mr-6 hidden lg:flex">
        <Logo />
      </Link>
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          {navitems?.map((item, index) => {
            return (
              <NavigationMenuLink asChild key={index}>
                <NavLink
                  to={item.href}
                  className={`group inline-flex h-9 w-max items-center justify-center rounded-md  px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50`}
                >
                  {item?.title}
                </NavLink>
              </NavigationMenuLink>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
    <hr />
    </>
  );
}
