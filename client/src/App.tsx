import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import OfflineIndicator from "./components/OfflineIndicator";
import Home from "./pages/Home";
import Session from "./pages/Session";
import EditWorkout from "./pages/EditWorkout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/session/:type" component={Session} />
      <Route path="/edit/:type" component={EditWorkout} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <OfflineIndicator />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
