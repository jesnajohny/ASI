"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { ListItem } from "@/components/ui/list-item";

export function Header() {
  const [activeSolution, setActiveSolution] = useState("hr-employee");

  const navItems = [
    { name: "Industries", href: "#platform-section" },
    { name: "Contact Us", href: "#customers-section" },
  ];

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const targetId = href.substring(1); // Remove '#' from href
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const hrAutomationItems = [
    { title: "Performance Analytics", href: "#" },
    { title: "Talent Acquisition", href: "#" },
    { title: "Employee Engagement", href: "#" },
    { title: "Compliance Monitoring", href: "#" },
    { title: "Workforce Insights", href: "#" },
  ];

  return (
    <header className="w-full py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-foreground text-xl font-semibold">Mates</span>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-3 gap-4 p-4 md:w-[600px] lg:w-[700px]">
                      {/* Left Column for Titles */}
                      <div className="col-span-1 flex flex-col space-y-2">
                        <div
                          onMouseEnter={() => setActiveSolution("hr-employee")}
                          className={`p-3 rounded-md cursor-pointer text-left ${
                            activeSolution === "hr-employee"
                              ? "bg-accent"
                              : "hover:bg-accent/50"
                          }`}
                        >
                          <p className="font-semibold text-foreground">
                            HR AI Employee
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Hire a dedicated AI agent for your HR needs.
                          </p>
                        </div>
                        <div
                          onMouseEnter={() =>
                            setActiveSolution("hr-automation")
                          }
                          className={`p-3 rounded-md cursor-pointer text-left ${
                            activeSolution === "hr-automation"
                              ? "bg-accent"
                              : "hover:bg-accent/50"
                          }`}
                        >
                          <p className="font-semibold text-foreground">
                            HR AI Automation
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Automate your people and operations.
                          </p>
                        </div>
                      </div>

                      {/* Right Column for Content */}
                      <div className="col-span-2 p-4 rounded-md bg-muted/30 text-left">
                        {activeSolution === "hr-employee" && (
                          <div>
                            <p className="font-bold text-lg mb-2">
                              Hire HR AI Employee
                            </p>
                            <ul className="list-none m-0 p-0">
                              <ListItem
                                href="#solutions-section"
                                title="Dedicated HR Agent"
                                onClick={(e) =>
                                  handleScroll(e, "#solutions-section")
                                }
                              >
                                Automate HR processes with a dedicated AI agent
                                that handles everything from onboarding to
                                compliance.
                              </ListItem>
                            </ul>
                          </div>
                        )}
                        {activeSolution === "hr-automation" && (
                          <div>
                            <p className="font-bold text-lg mb-2">
                              Performance Analytics & More
                            </p>
                            <ul className="space-y-2 list-none m-0 p-0">
                              {hrAutomationItems.map((item) => (
                                <li key={item.title}>
                                  <NavigationMenuLink asChild>
                                    <a
                                      href={item.href}
                                      className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                    >
                                      <div className="text-sm font-medium leading-none">
                                        {item.title}
                                      </div>
                                    </a>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                className="text-muted-foreground hover:text-foreground px-4 py-2 rounded-full font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:block text-muted-foreground hover:text-foreground px-4 py-2 rounded-full font-medium transition-colors">
            Login
          </Link>
          <Link href="/signup" className="hidden md:block">
            <Button className="bg-primary-gradient text-primary-foreground hover:opacity-90 transition-opacity px-6 py-2 rounded-full font-medium shadow-sm">
              Hire an AI Employee
            </Button>
          </Link>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-7 w-7" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="bg-background border-t border-border text-foreground"
            >
              <SheetHeader>
                <SheetTitle className="text-left text-xl font-semibold text-foreground">
                  Navigation
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                <Link
                  href="#solutions-section"
                  onClick={(e) => handleScroll(e, "#solutions-section")}
                  className="text-muted-foreground hover:text-foreground justify-start text-lg py-2"
                >
                  Solutions
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleScroll(e, item.href)}
                    className="text-muted-foreground hover:text-foreground justify-start text-lg py-2"
                  >
                    {item.name}
                  </Link>
                ))}
                <Link href="/login" className="text-muted-foreground hover:text-foreground justify-start text-lg py-2">
                  Login
                </Link>
                <Link href="/signup" className="w-full mt-4">
                  <Button className="bg-primary-gradient text-primary-foreground hover:opacity-90 transition-opacity w-full px-6 py-2 rounded-full font-medium shadow-sm">
                    Hire an AI Employee
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}