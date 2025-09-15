import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Youtube, MessageCircle, HelpCircle, Plus, Menu, X } from "lucide-react";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { PromoBar } from "@/components/PromoBar";
import { Sidebar } from "@/components/Sidebar";

interface LayoutProps {
  children: ReactNode;
  type?: "citizen" | "admin";
}

export const Layout = ({ children, type = "citizen" }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      {/* PromoBar */}
      <PromoBar />
      
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar type={type} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-background border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button - only show on mobile */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>

            {/* Right side items */}
            <div className="flex items-center space-x-4">
              {/* Social Icons */}
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Youtube className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <MessageCircle className="w-5 h-5" />
              </Button>

              {/* Help Dropdown */}
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <HelpCircle className="w-5 h-5" />
              </Button>

              {/* Upgrade Button */}
              <Button variant="outline" size="sm" className="hidden md:flex">
                Upgrade
              </Button>

              {/* Create Button */}
              <Button 
                asChild
                className="bg-openart-blue hover:bg-openart-blue-alt text-white hidden md:flex"
                size="sm"
              >
                <Link to="/report" className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create</span>
                </Link>
              </Button>

              {/* Profile Dropdown */}
              <ProfileDropdown type={type} />
            </div>
          </header>

          {/* Mobile Nav Overlay */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-card border-b border-border absolute top-16 left-0 w-full z-30 animate-in fade-in slide-in-from-top-4">
              <nav className="flex flex-col px-4 py-4 space-y-2">
                <Link
                  to="/"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg font-medium hover:bg-muted text-foreground transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Home</span>
                </Link>
                <Link
                  to="/report"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg font-medium hover:bg-muted text-foreground transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Report</span>
                </Link>
              </nav>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>

      <footer className="bg-muted/30 border-t mt-auto px-6 py-4">
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; 2024 CivicReport System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};