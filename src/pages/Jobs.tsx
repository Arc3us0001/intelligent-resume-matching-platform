import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Plus,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Building,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useJobs, useCreateJob, type Job } from "@/hooks/useJobs";
import { useMatches } from "@/hooks/useMatches";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const statusColors = {
  active: "bg-success/10 text-success",
  paused: "bg-warning/10 text-warning",
  closed: "bg-muted text-muted-foreground",
  draft: "bg-secondary text-secondary-foreground",
};

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: jobs, isLoading } = useJobs();
  const { data: matches } = useMatches();
  const createJob = useCreateJob();
  const { toast } = useToast();

  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    required_skills: "",
    experience_min: 0,
    salary_min: 0,
    salary_max: 0,
  });

  const filteredJobs = (jobs || []).filter(
    (j) =>
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedJob = filteredJobs.find((j) => j.id === selectedJobId) || filteredJobs[0];

  const getJobMatches = (jobId: string) => {
    return (matches || []).filter((m) => m.job_id === jobId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleCreateJob = async () => {
    try {
      await createJob.mutateAsync({
        title: newJob.title,
        company: newJob.company,
        location: newJob.location || null,
        description: newJob.description || null,
        required_skills: newJob.required_skills.split(",").map((s) => s.trim()).filter(Boolean),
        experience_min: newJob.experience_min,
        salary_min: newJob.salary_min || null,
        salary_max: newJob.salary_max || null,
        status: "active",
      });
      toast({ title: "Job Created", description: "The job posting has been created." });
      setIsCreateOpen(false);
      setNewJob({
        title: "",
        company: "",
        location: "",
        description: "",
        required_skills: "",
        experience_min: 0,
        salary_min: 0,
        salary_max: 0,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job posting",
        variant: "destructive",
      });
    }
  };

  const getSkillNames = (skills: any[]) => {
    return (skills || []).map((s) => (typeof s === "string" ? s : s.name || s));
  };

  if (isLoading) {
    return (
      <AppLayout title="Job Postings" subtitle="Manage open positions">
        <div className="flex gap-6 h-[calc(100vh-10rem)]">
          <div className="w-[420px] flex flex-col card-elevated">
            <div className="p-4 border-b border-border">
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex-1 p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Job Postings" subtitle="Manage open positions">
      <div className="flex gap-6 h-[calc(100vh-10rem)]">
        {/* Jobs List */}
        <div className="w-[420px] flex flex-col card-elevated">
          <div className="p-4 border-b border-border space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button variant="gradient" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Job Posting</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="text-sm font-medium">Job Title *</label>
                      <Input
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        placeholder="e.g. Senior React Developer"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Company *</label>
                      <Input
                        value={newJob.company}
                        onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                        placeholder="e.g. TechCorp Inc."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <Input
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                        placeholder="e.g. San Francisco, CA or Remote"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Required Skills (comma-separated)</label>
                      <Input
                        value={newJob.required_skills}
                        onChange={(e) => setNewJob({ ...newJob, required_skills: e.target.value })}
                        placeholder="e.g. React, TypeScript, Node.js"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={newJob.description}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        placeholder="Job description..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Min Experience (years)</label>
                        <Input
                          type="number"
                          value={newJob.experience_min}
                          onChange={(e) =>
                            setNewJob({ ...newJob, experience_min: parseInt(e.target.value) || 0 })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Salary Range ($K)</label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Min"
                            value={newJob.salary_min || ""}
                            onChange={(e) =>
                              setNewJob({ ...newJob, salary_min: parseInt(e.target.value) || 0 })
                            }
                          />
                          <Input
                            type="number"
                            placeholder="Max"
                            value={newJob.salary_max || ""}
                            onChange={(e) =>
                              setNewJob({ ...newJob, salary_max: parseInt(e.target.value) || 0 })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="gradient"
                      className="w-full"
                      onClick={handleCreateJob}
                      disabled={!newJob.title || !newJob.company || createJob.isPending}
                    >
                      {createJob.isPending ? "Creating..." : "Create Job"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Badge variant="secondary">{filteredJobs.length} jobs</Badge>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {filteredJobs.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <p className="text-muted-foreground">No jobs found</p>
                  <p className="text-sm text-muted-foreground mt-1">Create a job posting to get started</p>
                </div>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={cn(
                    "w-full p-4 text-left transition-colors hover:bg-secondary/50",
                    selectedJob?.id === job.id && "bg-secondary"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground truncate">{job.title}</h3>
                        <Badge
                          className={cn(
                            "text-xs",
                            statusColors[job.status as keyof typeof statusColors]
                          )}
                        >
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{job.company}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {getJobMatches(job.id).length} matches
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Job Details */}
        <div className="flex-1 card-elevated overflow-y-auto">
          {selectedJob ? (
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-heading text-2xl font-semibold text-foreground">
                      {selectedJob.title}
                    </h2>
                    <Badge className={statusColors[selectedJob.status as keyof typeof statusColors]}>
                      {selectedJob.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span>{selectedJob.company}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-secondary/50 text-center">
                  <MapPin className="h-5 w-5 mx-auto text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">{selectedJob.location || "Not specified"}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50 text-center">
                  <DollarSign className="h-5 w-5 mx-auto text-success mb-2" />
                  <p className="text-xs text-muted-foreground">Salary</p>
                  <p className="text-sm font-medium">
                    {selectedJob.salary_min && selectedJob.salary_max
                      ? `$${selectedJob.salary_min}k - $${selectedJob.salary_max}k`
                      : "Not specified"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50 text-center">
                  <Clock className="h-5 w-5 mx-auto text-accent mb-2" />
                  <p className="text-xs text-muted-foreground">Posted</p>
                  <p className="text-sm font-medium">{formatDate(selectedJob.created_at)}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50 text-center">
                  <Users className="h-5 w-5 mx-auto text-warning mb-2" />
                  <p className="text-xs text-muted-foreground">Matches</p>
                  <p className="text-sm font-medium">{getJobMatches(selectedJob.id).length}</p>
                </div>
              </div>

              {/* Requirements */}
              {getSkillNames(selectedJob.required_skills).length > 0 && (
                <div>
                  <h3 className="font-medium text-foreground mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {getSkillNames(selectedJob.required_skills).map((skill, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedJob.description && (
                <div>
                  <h3 className="font-medium text-foreground mb-3">Job Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{selectedJob.description}</p>
                </div>
              )}

              {/* Matched Candidates Preview */}
              {getJobMatches(selectedJob.id).length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-foreground">Top Matched Candidates</h3>
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {getJobMatches(selectedJob.id)
                      .slice(0, 3)
                      .map((match) => (
                        <div
                          key={match.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-medium text-primary-foreground">
                              {match.candidate?.full_name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "?"}
                            </div>
                            <span className="font-medium text-foreground">
                              {match.candidate?.full_name || "Unknown"}
                            </span>
                          </div>
                          <Badge
                            className={cn(
                              match.match_score >= 90
                                ? "bg-success/10 text-success"
                                : "bg-accent/10 text-accent"
                            )}
                          >
                            {match.match_score}% Match
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button variant="gradient" className="flex-1">
                  View All Matches
                </Button>
                <Button variant="outline" className="flex-1">
                  Edit Job Posting
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Select a job to view details</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
