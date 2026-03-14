import {
  Calendar,
  ChartNoAxesColumn,
  House,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-6 rounded-t-[20px] border border-border bg-background px-6 py-4">
      <Button variant="ghost" size="icon-lg" className="text-foreground">
        <House className="size-6" />
      </Button>

      <Button variant="ghost" size="icon-lg" className="text-muted-foreground">
        <Calendar className="size-6" />
      </Button>

      <Button
        size="icon-lg"
        className="size-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Sparkles className="size-6" />
      </Button>

      <Button variant="ghost" size="icon-lg" className="text-muted-foreground">
        <ChartNoAxesColumn className="size-6" />
      </Button>

      <Button variant="ghost" size="icon-lg" className="text-muted-foreground">
        <UserRound className="size-6" />
      </Button>
    </nav>
  );
}
