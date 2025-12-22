import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MatchScore } from "@/components/dashboard/MatchScore";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCandidates, type Candidate } from "@/hooks/useCandidates";

export default function Candidates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const { data: candidates, isLoading } = useCandidates();

  const filteredCandidates = (candidates || []).filter(
    (c) =>
      c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.summary || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skills.some((s: any) =>
        (typeof s === "string" ? s : s.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const selectedCandidate = filteredCandidates.find((c) => c.id === selectedCandidateId) || filteredCandidates[0];

  const getSkillNames = (skills: any[]) => {
    return skills.map((s) => (typeof s === "string" ? s : s.name || "Unknown"));
  };

  const getEducationString = (education: any[]) => {
    if (!education || education.length === 0) return "Not specified";
    const first = education[0];
    return `${first.degree || ""} ${first.institution ? "at " + first.institution : ""}`.trim() || "Not specified";
  };

  if (isLoading) {
    return (
      <AppLayout title="Candidates" subtitle="View and manage parsed resumes">
        <div className="flex gap-6 h-[calc(100vh-10rem)]">
          <div className="w-96 flex flex-col card-elevated">
            <div className="p-4 border-b border-border">
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex-1 p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
          <div className="flex-1 card-elevated p-6">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (filteredCandidates.length === 0) {
    return (
      <AppLayout title="Candidates" subtitle="View and manage parsed resumes">
        <div className="flex gap-6 h-[calc(100vh-10rem)]">
          <div className="w-96 flex flex-col card-elevated">
            <div className="p-4 border-b border-border space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search candidates or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <p className="text-muted-foreground">No candidates found</p>
                <p className="text-sm text-muted-foreground mt-1">Upload resumes to get started</p>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Candidates" subtitle="View and manage parsed resumes">
      <div className="flex gap-6 h-[calc(100vh-10rem)]">
        {/* Candidates List */}
        <div className="w-96 flex flex-col card-elevated">
          <div className="p-4 border-b border-border space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search candidates or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-3 w-3" /> Filters
              </Button>
              <Badge variant="secondary">{filteredCandidates.length} candidates</Badge>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {filteredCandidates.map((candidate) => (
              <button
                key={candidate.id}
                onClick={() => setSelectedCandidateId(candidate.id)}
                className={cn(
                  "w-full p-4 text-left transition-colors hover:bg-secondary/50",
                  selectedCandidate?.id === candidate.id && "bg-secondary"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-medium text-primary-foreground">
                    {candidate.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium text-foreground truncate">
                        {candidate.full_name}
                      </h3>
                      <MatchScore score={85} size="sm" showLabel={false} />
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {candidate.experience_years} years experience
                    </p>
                    {candidate.location && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {candidate.location}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Candidate Details */}
        <div className="flex-1 card-elevated overflow-y-auto">
          {selectedCandidate && (
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-xl font-semibold text-primary-foreground">
                    {selectedCandidate.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">
                      {selectedCandidate.full_name}
                    </h2>
                    <p className="text-muted-foreground">
                      {selectedCandidate.experience_years} years experience
                    </p>
                    <Badge className="mt-2 bg-primary/10 text-primary">Active</Badge>
                  </div>
                </div>
                <MatchScore score={85} size="lg" />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{selectedCandidate.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">
                      {selectedCandidate.phone || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium">
                      {selectedCandidate.location || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Experience & Education */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-4 w-4 text-accent" />
                    <h3 className="font-medium text-foreground">Experience</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedCandidate.experience_years} years of professional experience
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-4 w-4 text-accent" />
                    <h3 className="font-medium text-foreground">Education</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getEducationString(selectedCandidate.education)}
                  </p>
                </div>
              </div>

              {/* Summary */}
              {selectedCandidate.summary && (
                <div>
                  <h3 className="font-medium text-foreground mb-2">Summary</h3>
                  <p className="text-sm text-muted-foreground">{selectedCandidate.summary}</p>
                </div>
              )}

              {/* Skills */}
              <div>
                <h3 className="font-medium text-foreground mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {getSkillNames(selectedCandidate.skills).map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button variant="gradient" className="flex-1">
                  Schedule Interview
                </Button>
                {selectedCandidate.resume_url && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open(selectedCandidate.resume_url!, "_blank")}
                  >
                    View Full Resume
                  </Button>
                )}
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
