import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import VehicleDetail from "./pages/VehicleDetail";
import Admin from "./pages/Admin";

function Routes() {
  return <Switch><Route path="/" component={Home} /><Route path="/vehicle/:slug" component={VehicleDetail} /><Route path="/admin" component={Admin} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router hook={useHashLocation}><Routes /></Router></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
