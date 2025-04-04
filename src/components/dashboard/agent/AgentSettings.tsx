
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

export default function AgentSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and notification settings
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive email notifications for important events</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Client Inquiries</p>
                <p className="text-sm text-muted-foreground">Be notified immediately when clients contact you</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Showing Appointments</p>
                <p className="text-sm text-muted-foreground">Get reminders about upcoming property showings</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Offer Updates</p>
                <p className="text-sm text-muted-foreground">Be notified when offers are submitted or updated</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Market Reports</p>
                <p className="text-sm text-muted-foreground">Receive weekly market trend updates</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Calendar Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="availability">Default Daily Availability</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-time" className="text-xs text-muted-foreground">Start Time</Label>
                  <Select defaultValue="9">
                    <SelectTrigger id="start-time">
                      <SelectValue placeholder="Start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(12)].map((_, i) => (
                        <SelectItem key={i} value={`${i + 8}`}>{i + 8}:00 AM</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="end-time" className="text-xs text-muted-foreground">End Time</Label>
                  <Select defaultValue="17">
                    <SelectTrigger id="end-time">
                      <SelectValue placeholder="End time" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(8)].map((_, i) => (
                        <SelectItem key={i} value={`${i + 12}`}>{i + 12}:00 PM</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="calendar-sync">Calendar Synchronization</Label>
              <Select defaultValue="google">
                <SelectTrigger>
                  <SelectValue placeholder="Select calendar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google Calendar</SelectItem>
                  <SelectItem value="outlook">Microsoft Outlook</SelectItem>
                  <SelectItem value="apple">Apple Calendar</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="buffer-time">Buffer Time Between Appointments</Label>
            <Select defaultValue="15">
              <SelectTrigger>
                <SelectValue placeholder="Select buffer time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No buffer</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Communication Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-signature">Email Signature</Label>
            <Textarea 
              id="email-signature" 
              rows={4}
              placeholder="Create your email signature..."
              defaultValue="Sarah Johnson\nLicensed Real Estate Agent\nHomePulse Realty\n(555) 123-4567 | sarah.j@homepulse.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="auto-responder">Auto-Responder Message</Label>
            <Textarea 
              id="auto-responder" 
              rows={3}
              placeholder="Message for when you're unavailable..."
              defaultValue="Thank you for your message. I'll respond within 24 hours. For urgent matters, please call my office at (555) 123-4567."
            />
          </div>
          
          <div className="pt-4">
            <Button>Save Communication Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
