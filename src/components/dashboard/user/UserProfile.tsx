
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Lock, 
  BellRing, 
  CreditCard, 
  Shield, 
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Sample user data
const userData = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "(555) 123-4567",
  address: "123 Main St, Anytown, State, 12345",
  bio: "Real estate enthusiast with a focus on residential properties. Looking for my next investment opportunity.",
  avatar: "/placeholder.svg",
  dateJoined: "2022-05-15",
  lastActive: "2023-06-20",
  notifications: {
    email: true,
    sms: false,
    propertyUpdates: true,
    marketReports: true,
    newsletter: false
  }
};

const UserProfile = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(userData);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    }, 1000);
  };
  
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      });
    }, 1000);
  };
  
  const handleNotificationChange = (key: string, value: boolean) => {
    setUser({
      ...user,
      notifications: {
        ...user.notifications,
        [key]: value
      }
    });
  };
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <BellRing className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="w-4 h-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          {/* Profile Tab */}
          <TabsContent value="profile">
            <form onSubmit={handleProfileUpdate}>
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" type="button">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Avatar
                        </Button>
                        <Button variant="outline" type="button" className="text-destructive">
                          Remove
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue={user.phone} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" defaultValue={user.address} />
                      </div>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        placeholder="Tell us about yourself"
                        className="min-h-[100px]"
                        defaultValue={user.bio}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="reset">Reset</Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">Member since</p>
                      </div>
                      <p className="font-medium">
                        {new Date(user.dateJoined).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">Account type</p>
                      </div>
                      <Badge>Standard</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">Last active</p>
                      </div>
                      <p className="font-medium">
                        {new Date(user.lastActive).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{user.email}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{user.phone}</p>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm">{user.address}</p>
                    </div>
                    
                    <div className="pt-2">
                      <Button variant="outline" className="w-full">
                        <Shield className="mr-2 h-4 w-4" />
                        Verify Contact Info
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </form>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="password-form" onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input 
                        id="currentPassword" 
                        type="password" 
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword" 
                        type="password" 
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        required
                      />
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button 
                    form="password-form" 
                    type="submit" 
                    disabled={saving || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                    className="w-full"
                  >
                    {saving ? "Updating..." : "Update Password"}
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>
                      Add an extra layer of security to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p>Text Message (SMS)</p>
                        <p className="text-sm text-muted-foreground">Use your phone as a second factor</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <Shield className="mr-2 h-4 w-4" />
                      Setup Authenticator App
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Security Log</CardTitle>
                    <CardDescription>
                      Recent security-related activity on your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-b pb-2">
                        <p className="text-sm">Password changed</p>
                        <p className="text-xs text-muted-foreground">2023-05-20 15:32:24</p>
                      </div>
                      <div className="border-b pb-2">
                        <p className="text-sm">Login from new device</p>
                        <p className="text-xs text-muted-foreground">2023-05-18 09:41:37</p>
                      </div>
                      <div>
                        <p className="text-sm">Email address verified</p>
                        <p className="text-xs text-muted-foreground">2023-05-15 11:24:09</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Full Security Log
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Contact Methods</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={user.notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                    </div>
                    <Switch 
                      id="sms-notifications" 
                      checked={user.notifications.sms}
                      onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Notification Types</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="property-updates">Property Updates</Label>
                      <p className="text-sm text-muted-foreground">New properties matching your criteria</p>
                    </div>
                    <Switch 
                      id="property-updates" 
                      checked={user.notifications.propertyUpdates}
                      onCheckedChange={(checked) => handleNotificationChange('propertyUpdates', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="market-reports">Market Reports</Label>
                      <p className="text-sm text-muted-foreground">Monthly reports on market trends</p>
                    </div>
                    <Switch 
                      id="market-reports" 
                      checked={user.notifications.marketReports}
                      onCheckedChange={(checked) => handleNotificationChange('marketReports', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newsletter">Newsletter</Label>
                      <p className="text-sm text-muted-foreground">Weekly newsletter with tips and insights</p>
                    </div>
                    <Switch 
                      id="newsletter" 
                      checked={user.notifications.newsletter}
                      onCheckedChange={(checked) => handleNotificationChange('newsletter', checked)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save Notification Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>
                  Manage your subscription and payment methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Standard Plan</h3>
                      <p className="text-sm text-muted-foreground">Basic features for property listings</p>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-2xl font-bold">$0.00</p>
                    <p className="text-sm text-muted-foreground">Free Plan</p>
                  </div>
                  <div className="mt-4">
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center">
                        <CheckIcon className="mr-2" /> Up to 5 property listings
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="mr-2" /> Basic analytics
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="mr-2" /> Email support
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Upgrade Your Plan</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Premium Plan</CardTitle>
                        <CardDescription>Enhanced features for serious sellers</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">$19.99</p>
                        <p className="text-sm text-muted-foreground">per month</p>
                        <ul className="text-sm space-y-1 mt-4">
                          <li className="flex items-center">
                            <CheckIcon className="mr-2" /> Up to 20 property listings
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="mr-2" /> Advanced analytics
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="mr-2" /> Priority support
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="mr-2" /> Featured listings
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Upgrade to Premium</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Professional Plan</CardTitle>
                        <CardDescription>For real estate professionals</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">$49.99</p>
                        <p className="text-sm text-muted-foreground">per month</p>
                        <ul className="text-sm space-y-1 mt-4">
                          <li className="flex items-center">
                            <CheckIcon className="mr-2" /> Unlimited property listings
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="mr-2" /> Advanced marketing tools
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="mr-2" /> 24/7 support
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="mr-2" /> Custom branding
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Upgrade to Professional</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

const CheckIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 text-primary ${className}`}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
};

export default UserProfile;
