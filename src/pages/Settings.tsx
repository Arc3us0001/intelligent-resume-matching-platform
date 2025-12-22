import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Key,
  Building
} from "lucide-react";

export default function Settings() {
  return (
    <AppLayout title="Settings" subtitle="Manage your account and preferences">
      <div className="max-w-3xl space-y-8">
        {/* Profile Section */}
        <section className="card-elevated p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">Profile</h2>
              <p className="text-sm text-muted-foreground">Manage your personal information</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john.doe@company.com" />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button variant="gradient">Save Changes</Button>
          </div>
        </section>

        {/* Company Section */}
        <section className="card-elevated p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">Company</h2>
              <p className="text-sm text-muted-foreground">Your organization settings</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" defaultValue="TechCorp Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" type="url" defaultValue="https://techcorp.com" />
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="card-elevated p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">Notifications</h2>
              <p className="text-sm text-muted-foreground">Configure your notification preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">New candidate matches</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when AI finds matching candidates
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Resume parsing complete</p>
                <p className="text-sm text-muted-foreground">
                  Notifications when resumes are processed
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Weekly reports</p>
                <p className="text-sm text-muted-foreground">
                  Receive weekly hiring pipeline summaries
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </section>

        {/* API Access Section */}
        <section className="card-elevated p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">API Access</h2>
              <p className="text-sm text-muted-foreground">Manage API keys and integrations</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">API Key</p>
                  <p className="text-sm text-muted-foreground font-mono mt-1">
                    sk-****************************abcd
                  </p>
                </div>
                <Button variant="outline" size="sm">Regenerate</Button>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">
                Use your API key to integrate ResuMatch with your existing ATS or HR systems.
                <a href="#" className="text-primary ml-1 hover:underline">View API docs →</a>
              </p>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="card-elevated p-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">Security</h2>
              <p className="text-sm text-muted-foreground">Protect your account</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Two-factor authentication</p>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Change password</p>
                <p className="text-sm text-muted-foreground">
                  Last changed 30 days ago
                </p>
              </div>
              <Button variant="outline" size="sm">Update</Button>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
