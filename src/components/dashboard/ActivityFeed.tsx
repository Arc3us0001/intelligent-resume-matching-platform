import { FileText, Briefcase, Zap, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "upload",
    message: "New resume uploaded: Sarah Johnson",
    time: "2 min ago",
    icon: FileText,
  },
  {
    id: 2,
    type: "job",
    message: "Job posted: Senior React Developer",
    time: "15 min ago",
    icon: Briefcase,
  },
  {
    id: 3,
    type: "match",
    message: "92% match found for ML Engineer role",
    time: "1 hour ago",
    icon: Zap,
  },
  {
    id: 4,
    type: "candidate",
    message: "Candidate shortlisted: Michael Chen",
    time: "2 hours ago",
    icon: UserPlus,
  },
  {
    id: 5,
    type: "upload",
    message: "Batch upload complete: 12 resumes",
    time: "3 hours ago",
    icon: FileText,
  },
];

const iconStyles = {
  upload: "bg-primary/10 text-primary",
  job: "bg-accent/10 text-accent",
  match: "bg-success/10 text-success",
  candidate: "bg-warning/10 text-warning",
};

export function ActivityFeed() {
  return (
    <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
      <div className="mb-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Activity Feed</h2>
        <p className="text-sm text-muted-foreground">Recent platform activity</p>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
              iconStyles[activity.type as keyof typeof iconStyles]
            )}>
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{activity.message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
