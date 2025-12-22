import { MatchScore } from "./MatchScore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";

const recentMatches = [
  {
    id: 1,
    candidate: "Sarah Johnson",
    role: "Senior Frontend Developer",
    job: "React Developer - FinTech",
    score: 94,
    location: "San Francisco, CA",
    skills: ["React", "TypeScript", "Node.js"],
  },
  {
    id: 2,
    candidate: "Michael Chen",
    role: "Full Stack Engineer",
    job: "Backend Engineer - AI Startup",
    score: 87,
    location: "New York, NY",
    skills: ["Python", "Django", "PostgreSQL"],
  },
  {
    id: 3,
    candidate: "Emily Davis",
    role: "Product Designer",
    job: "UX Designer - E-commerce",
    score: 72,
    location: "Austin, TX",
    skills: ["Figma", "User Research", "Prototyping"],
  },
  {
    id: 4,
    candidate: "James Wilson",
    role: "Data Scientist",
    job: "ML Engineer - HealthTech",
    score: 68,
    location: "Seattle, WA",
    skills: ["Python", "TensorFlow", "SQL"],
  },
];

export function RecentMatches() {
  return (
    <div className="card-elevated animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">Recent Matches</h2>
          <p className="text-sm text-muted-foreground">Latest candidate-job pairings</p>
        </div>
        <Button variant="ghost" size="sm" className="gap-1">
          View All <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="divide-y divide-border">
        {recentMatches.map((match, index) => (
          <div 
            key={match.id} 
            className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors"
            style={{ animationDelay: `${0.1 * index}s` }}
          >
            <MatchScore score={match.score} size="sm" showLabel={false} />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-foreground truncate">{match.candidate}</h3>
                <span className="text-muted-foreground">→</span>
                <span className="text-sm text-muted-foreground truncate">{match.job}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{match.location}</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1.5">
              {match.skills.slice(0, 2).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {match.skills.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{match.skills.length - 2}
                </Badge>
              )}
            </div>

            <Button variant="ghost" size="sm">
              View
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
