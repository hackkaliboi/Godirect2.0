
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function AgentSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agent Settings</h1>
        <p className="text-muted-foreground">
          Manage your agent account settings and preferences
        </p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for new inquiries and messages
                </p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive SMS notifications for urgent matters
                </p>
              </div>
              <Switch id="sms-notifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="app-notifications">In-App Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications within the app
                </p>
              </div>
              <Switch id="app-notifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing-emails">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive promotional emails and market updates
                </p>
              </div>
              <Switch id="marketing-emails" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="profile-public">Public Profile</Label>
                <p className="text-sm text-muted-foreground">
                  Make your agent profile visible on the platform
                </p>
              </div>
              <Switch id="profile-public" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="contact-info-visible">Show Contact Information</Label>
                <p className="text-sm text-muted-foreground">
                  Allow users to see your contact information
                </p>
              </div>
              <Switch id="contact-info-visible" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="listing-stats">Share Listing Analytics</Label>
                <p className="text-sm text-muted-foreground">
                  Share your listing performance statistics
                </p>
              </div>
              <Switch id="listing-stats" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Use dark mode for the dashboard interface
                </p>
              </div>
              <Switch id="dark-mode" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compact-view">Compact View</Label>
                <p className="text-sm text-muted-foreground">
                  Show more content with less spacing
                </p>
              </div>
              <Switch id="compact-view" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Agent Bio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="short-bio">Short Bio</Label>
              <Textarea 
                id="short-bio" 
                placeholder="Brief introduction (shown in listings)"
                defaultValue="I'm a dedicated real estate professional with over 10 years of experience in the downtown area."
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="full-bio">Full Bio</Label>
              <Textarea 
                id="full-bio" 
                placeholder="Your complete professional profile"
                defaultValue="With a decade of experience serving clients in the downtown metropolitan area, I specialize in luxury apartments and commercial real estate. I hold certifications in property valuation and negotiation, allowing me to secure the best deals for my clients in any market condition."
                rows={5}
              />
            </div>
            
            <Button className="w-full">Save Bio</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
