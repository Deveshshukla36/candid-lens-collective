
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PhotoProvider } from "@/context/PhotoContext";
import { UserProvider } from "@/context/UserContext";
import Index from "./pages/Index";
import Trending from "./pages/Trending";
import Profile from "./pages/Profile";
import Groups from "./pages/Groups";
import Global from "./pages/Global";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <PhotoProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/global" element={<Global />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PhotoProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
