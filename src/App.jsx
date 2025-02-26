

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { navItems } from "./nav-items";
import { Button } from "@/components/ui/button";
import ChatBot from "./components/ChatBot/ChatBot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40">
          <div className="container flex h-14 max-w-screen-2xl items-center">
            {navItems.map(({ to, title, icon }) => (
              <Link key={to} to={to}>
                <Button variant="ghost" className="flex items-center space-x-2">
                  {icon}
                  <span>{title}</span>
                </Button>
              </Link>
            ))}
          </div>
        </nav>
        <Routes>
          {navItems.map(({ to, page }) => (
            <Route key={to} path={to} element={page} />
          ))}
        </Routes>
        <ChatBot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
