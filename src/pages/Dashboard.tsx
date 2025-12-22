import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentMatches } from "@/components/dashboard/RecentMatches";
import { SkillsChart } from "@/components/dashboard/SkillsChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Users, Briefcase, Zap, FileText } from "lucide-react";

export default function Dashboard() {
  return (
    <AppLayout title="Dashboard" subtitle="Overview of your hiring pipeline">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Candidates"
            value="1,284"
            change={12}
            icon={<Users className="h-6 w-6" />}
            variant="primary"
          />
          <StatCard
            title="Active Jobs"
            value="23"
            change={-3}
            icon={<Briefcase className="h-6 w-6" />}
            variant="accent"
          />
          <StatCard
            title="Matches Made"
            value="847"
            change={24}
            icon={<Zap className="h-6 w-6" />}
            variant="success"
          />
          <StatCard
            title="Resumes Parsed"
            value="2,156"
            change={18}
            icon={<FileText className="h-6 w-6" />}
            variant="default"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentMatches />
          </div>
          <div className="space-y-6">
            <SkillsChart />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
