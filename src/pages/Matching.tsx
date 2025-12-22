import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MatchScore } from "@/components/dashboard/MatchScore";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  Sparkles,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMatches, useRunMatching, useUpdateMatchStatus } from "@/hooks/useMatches";
import { useJobs } from "@/hooks/useJobs";
import { useToast } from "@/hooks/use-toast";

export default function Matching() {
  const [selectedJob, setSelectedJob] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { data: matches, isLoading } = useMatches();
  const { data: jobs } = useJobs();
  const runMatching = useRunMatching();
  const updateStatus = useUpdateMatchStatus();
  const { toast } = useToast();

  const filteredMatches = (matches || []).filter((m) => {
    if (selectedStatus !== "all" && m.status !== selectedStatus) return false;
    if (selectedJob !== "all" && m.job_id !== selectedJob) return false;
    return true;
  });

  const handleRunMatching = async () => {
    try {
      const result = await runMatching.mutateAsync({});
      toast({
        title: "Matching Complete",
        description: `Created ${result.count} new matches`,
      });
    } catch (error) {
      toast({
        title: "Matching Failed",
        description: error instanceof Error ? error.message : "Failed to run matching",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (matchId: string) => {
    try {
      await updateStatus.mutateAsync({ id: matchId, status: "approved" });
      toast({ title: "Match Approved" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update match", variant: "destructive" });
    }
  };

  const handleReject = async (matchId: string) => {
    try {
      await updateStatus.mutateAsync({ id: matchId, status: "rejected" });
      toast({ title: "Match Rejected" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update match", variant: "destructive" });
    }
  };

  const getSkillNames = (skills: any[]) => {
    return (skills || []).map((s) => (typeof s === "string" ? s : s.name || s));
  };

  if (isLoading) {
    return (
      <AppLayout title="Candidate Matching" subtitle="AI-powered candidate-job matching">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Candidate Matching" subtitle="AI-powered candidate-job matching">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filter by job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {(jobs || []).map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              {filteredMatches.length} matches
            </Badge>
            <Button
              variant="gradient"
              onClick={handleRunMatching}
              disabled={runMatching.isPending}
              className="gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", runMatching.isPending && "animate-spin")} />
              {runMatching.isPending ? "Matching..." : "Run AI Matching"}
            </Button>
          </div>
        </div>

        {/* Matches Grid */}
        <div className="grid gap-4">
          {filteredMatches.map((match, index) => (
            <div
              key={match.id}
              className="card-interactive p-6 animate-slide-up"
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              <div className="flex items-center gap-6">
                {/* Candidate */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-semibold text-primary-foreground">
                      {match.candidate?.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "?"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {match.candidate?.full_name || "Unknown Candidate"}
                      </h3>
                      <p className="text-sm text-muted-foreground">{match.candidate?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Arrow with Score */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <MatchScore score={Number(match.match_score)} size="md" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>

                {/* Job */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                      <span className="text-lg font-semibold text-muted-foreground">
                        {match.job?.company?.[0] || "?"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {match.job?.title || "Unknown Job"}
                      </h3>
                      <p className="text-sm text-muted-foreground">{match.job?.company}</p>
                    </div>
                  </div>
                </div>

                {/* Skills Match */}
                <div className="w-64 hidden lg:block">
                  <div className="flex flex-wrap gap-1.5">
                    {getSkillNames(match.matched_skills)
                      .slice(0, 3)
                      .map((skill, i) => (
                        <Badge key={i} className="bg-success/10 text-success border-0 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {skill}
                        </Badge>
                      ))}
                    {getSkillNames(match.missing_skills)
                      .slice(0, 2)
                      .map((skill, i) => (
                        <Badge key={i} className="bg-destructive/10 text-destructive border-0 text-xs">
                          <XCircle className="h-3 w-3 mr-1" />
                          {skill}
                        </Badge>
                      ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {match.status === "pending" ? (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(match.id)}
                        disabled={updateStatus.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReject(match.id)}
                        disabled={updateStatus.isPending}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  ) : match.status === "approved" ? (
                    <Badge className="bg-success/10 text-success">Approved</Badge>
                  ) : (
                    <Badge className="bg-destructive/10 text-destructive">Rejected</Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMatches.length === 0 && (
          <div className="card-elevated p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
              No matches found
            </h3>
            <p className="text-muted-foreground mb-4">
              Upload resumes and create job postings, then run AI matching
            </p>
            <Button variant="gradient" onClick={handleRunMatching} disabled={runMatching.isPending}>
              <RefreshCw className={cn("h-4 w-4 mr-2", runMatching.isPending && "animate-spin")} />
              Run AI Matching
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
