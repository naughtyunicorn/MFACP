# MFA Card Platform UI Design Guide

## Page-by-Page Design Concepts

### 1. Landing Page

#### Hero Section
```
┌─────────────────────────────────────────────────────────────┐
│ Navigation (64px height)                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Logo | Features | Pricing | Docs | Sign In | Get Started │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Hero Content (100vh min)                                     │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ │  Never Get Locked Out Again                             │ │
│ │  Premium multi-device authentication                     │ │
│ │                                                         │ │
│ │  [Get Started Free] [Watch Demo]                        │ │
│ │                                                         │ │
│ │  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │ │
│ │  │ Passkey │  │ NFC Card│  │ Recovery│                 │ │
│ │  │ Icon    │  │ Icon    │  │ Codes   │                 │ │
│ │  └─────────┘  └─────────┘  └─────────┘                 │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Design Elements:**
- **Background**: Neutral-50 with subtle gradient
- **Headline**: text-5xl, font-bold, primary-900
- **Subtitle**: text-xl, primary-600
- **CTA Buttons**: Primary (accent-600) and Outline variants
- **Feature Icons**: 64px circular containers with accent-100 backgrounds
- **Visual**: Abstract security pattern in background (10% opacity)

#### Features Grid
```
┌─────────────────────────────────────────────────────────────┐
│ Features Section                                             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                        │
│ │ Icon    │ │ Icon    │ │ Icon    │                        │
│ │ Title   │ │ Title   │ │ Title   │                        │
│ │ Description │ Description │ Description                 │
│ └─────────┘ └─────────┘ └─────────┘                        │
│                                                             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                        │
│ │ Icon    │ │ Icon    │ │ Icon    │                        │
│ │ Title   │ │ Title   │ │ Title   │                        │
│ │ Description │ Description │ Description                 │
│ └─────────┘ └─────────┘ └─────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

**Card Design:**
- **Background**: neutral-0
- **Border**: neutral-200
- **Shadow**: shadow-card
- **Padding**: p-6
- **Icon**: 48px, accent-100 background, accent-600 color
- **Title**: text-h3, primary-900
- **Description**: text-body, primary-600

#### Trust Section
```
┌─────────────────────────────────────────────────────────────┐
│ Trusted by Security-Conscious Teams                          │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│ │ Logo 1  │ │ Logo 2  │ │ Logo 3  │ │ Logo 4  │            │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘            │
│                                                             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                        │
│ │ 10M+    │ │ 99.9%   │ │ 24/7    │                        │
│ │ Accounts │ Uptime   │ Support  │                        │
│ └─────────┘ └─────────┘ └─────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### 2. Login Page

#### Centered Authentication Panel
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    ┌─────────────────────────┐             │
│                    │ Logo                    │             │
│                    └─────────────────────────┘             │
│                                                             │
│                    Welcome Back                           │
│                    Sign in to your secure account          │
│                                                             │
│                    ┌─────────────────────────┐             │
│                    │ [ Use Passkey ]         │             │
│                    │ Primary Button          │             │
│                    └─────────────────────────┘             │
│                                                             │
│                    ── or ──                                │
│                                                             │
│                    [ Use NFC Card ]                        │
│                    Secondary Button                        │
│                                                             │
│                    [ Use Recovery Code ]                   │
│                    Secondary Button                        │
│                                                             │
│                    Don't have an account? [Sign up]        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Design Specifications:**
- **Container**: 480px max-width, centered
- **Logo**: 40px height
- **Title**: text-h3, primary-900
- **Subtitle**: text-body, primary-600
- **Primary Button**: Full width, large size
- **Secondary Buttons**: Full width, outline variant
- **Divider**: text-neutral-400, with horizontal lines
- **Link**: accent-600, hover:accent-700

#### Passkey Authentication Flow
```
┌─────────────────────────────────────────────────────────────┐
│                    Use Your Passkey                         │
│                    Touch your security device to continue   │
│                                                             │
│                    ┌─────────────────────────┐             │
│                    │    Fingerprint Icon     │             │
│                    │                         │             │
│                    │    Waiting for device   │             │
│                    │    [Cancel]             │             │
│                    └─────────────────────────┘             │
│                                                             │
│                    ┌─────────────────────────┐             │
│                    │ ✓ Authentication       │             │
│                    │   Successful           │             │
│                    │   [Continue]           │             │
│                    └─────────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

### 3. Registration/Onboarding Flow

#### Step 1: Account Creation
```
┌─────────────────────────────────────────────────────────────┐
│                    Create Your Account                      │
│                    Step 1 of 4                               │
│                                                             │
│                    ┌─────────────────────────┐             │
│                    │ Email Address           │             │
│                    │ [email@example.com]     │             │
│                    └─────────────────────────┘             │
│                                                             │
│                    ┌─────────────────────────┐             │
│                    │ Password                │             │
│                    │ ••••••••••••••••        │             │
│                    └─────────────────────────┘             │
│                                                             │
│                    ┌─────────────────────────┐             │
│                    │ Confirm Password        │             │
│                    │ ••••••••••••••••        │             │
│                    └─────────────────────────┘             │
│                                                             │
│                    [Continue] → [Sign in instead]          │
└─────────────────────────────────────────────────────────────┘
```

#### Step 2: Passkey Enrollment
```
┌─────────────────────────────────────────────────────────────┐
│                    Add a Passkey                            │
│                    Step 2 of 4                               │
│                                                             │
│                    ┌─────────────────────────┐             │
│                    │    Key Icon             │             │
│                    │                         │             │
│                    │    Passkeys are the      │             │
│                    │    most secure way to   │             │
│                    │    sign in. They use    │             │
│                    │    your device's built- │             │
│                    │    in security.         │             │
│                    │                         │             │
│                    │    [Create Passkey]     │             │
│                    │    [Skip for now]       │             │
│                    └─────────────────────────┘             │
│                                                             │
│                    ← Back [Continue] →                      │
└─────────────────────────────────────────────────────────────┘
```

#### Step 3: Backup Method
```
┌─────────────────────────────────────────────────────────────┐
│                    Add a Backup Method                      │
│                    Step 3 of 4                               │
│                                                             │
│                    ┌─────────────────────────┐             │
│                    │    NFC Card             │             │
│                    │    Physical security key │             │
│                    │    [Add Card]           │             │
│                    └─────────────────────────┘             │
│                                                             │
│                    ┌─────────────────────────┐             │
│                    │    Recovery Codes       │             │
│                    │    One-time backup codes │             │
│                    │    [Generate Codes]     │             │
│                    └─────────────────────────┘             │
│                                                             │
│                    ┌─────────────────────────┐             │
│                    │    TOTP App             │             │
│                    │    Authenticator app    │             │
│                    │    [Set up TOTP]       │             │
│                    └─────────────────────────┘             │
│                                                             │
│                    ← Back [Continue] →                      │
└─────────────────────────────────────────────────────────────┘
```

#### Step 4: Completion
```
┌─────────────────────────────────────────────────────────────┐
│                    You're All Set!                          │
│                    Your account is now protected            │
│                                                             │
│                    ┌─────────────────────────┐             │
│                    │    ✓ Shield Icon        │             │
│                    │                         │             │
│                    │    Account Protection    │             │
│                    │    Score: 85/100         │             │
│                    │                         │             │
│                    │    • 1 Passkey           │             │
│                    │    • 1 Backup Method    │             │
│                    │    • Recovery Ready     │             │
│                    └─────────────────────────┘             │
│                                                             │
│                    [Go to Dashboard]                        │
│                    [Add More Security]                      │
└─────────────────────────────────────────────────────────────┘
```

### 4. Security Dashboard

#### Main Dashboard Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Header (64px)                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Logo | Dashboard | Devices | ... | [User] [Sign out]    │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────┐ Main Content                                    │
│ │ Sidebar │                                                 │
│ │ (256px) │ ┌─────────────────────────────────────────┐   │
│ │         │ │ Security Overview                        │   │
│ │ • Overview│ │ ┌─────────┐ ┌─────────┐ ┌─────────┐    │   │
│ │ • Auths  │ │ │ 85%     │ │ 3       │ │ 1       │    │   │
│ │ • Devices│ │ │Score    │ │Devices  │ │Active   │    │   │
│ │ • Events │ │ └─────────┘ └─────────┘ └─────────┘    │   │
│ │ • Recovery│ │                                         │   │
│ │ • Settings│ │ [Add Security Method]                    │   │
│ │         │ │                                         │   │
│ │         │ └─────────────────────────────────────────┘   │
│ │         │                                                 │
│ │         │ ┌─────────────────────────────────────────┐   │
│ │         │ │ Recent Activity                         │   │
│ │         │ │ • Successful login via passkey          │   │
│ │         │ │ • NFC card enrolled                      │   │
│ │         │ │ • Failed login attempt                   │   │
│ │         │ │ [View all activity]                     │   │
│ │         │ └─────────────────────────────────────────┘   │
│ └─────────┘                                                 │
└─────────────────────────────────────────────────────────────┘
```

#### Security Score Card
```jsx
<Card variant="security" securityStatus="protected">
  <CardContent>
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-h4">Account Protection</h3>
        <p className="text-body-sm text-muted-foreground">
          Your account is well protected
        </p>
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold text-success-600">85%</div>
        <Badge status="protected">Protected</Badge>
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <div className="flex justify-between text-sm">
        <span>Security Score</span>
        <span className="font-medium">85/100</span>
      </div>
      <div className="h-2 bg-neutral-200 rounded-full">
        <div className="h-2 bg-success-600 rounded-full" style={{width: '85%'}} />
      </div>
    </div>
  </CardContent>
</Card>
```

### 5. Devices Page

#### Device Inventory
```
┌─────────────────────────────────────────────────────────────┐
│ Trusted Devices                                             │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ┌─────┐ MacBook Pro                                     │ │
│ │ │ Icon│ Currently active • Last seen 2 hours ago      │ │
│ │ └─────┘ ┌─────────────────────────────────────────┐   │ │
│ │         │ [This Device] [Remove] [View Details]   │   │
│ │         └─────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ┌─────┐ iPhone 14 Pro                                   │ │
│ │ │ Icon│ Trusted • Last seen 1 day ago                  │ │
│ │ └─────┘ ┌─────────────────────────────────────────┐   │ │
│ │         │ [Revoke Access] [View Details]           │   │
│ │         └─────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [Add New Device] [Lost This Device?]                       │
└─────────────────────────────────────────────────────────────┘
```

#### Device Card Component
```jsx
<Card className="p-6">
  <div className="flex items-start gap-4">
    <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
      <DeviceIcon className="w-6 h-6 text-accent-600" />
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-h4">{device.name}</h3>
          <p className="text-body-sm text-muted-foreground">
            {device.platform} • {device.lastSeen}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {device.current && <Badge status="protected">Current</Badge>}
          {device.trusted && <Badge status="protected">Trusted</Badge>}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="secondary" size="sm">View Details</Button>
        {!device.current && (
          <Button variant="outline" size="sm">Revoke Access</Button>
        )}
      </div>
    </div>
  </div>
</Card>
```

### 6. Authenticators Page

#### Authenticator Grid
```
┌─────────────────────────────────────────────────────────────┐
│ Your Authentication Methods                                 │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ┌─────┐ MacBook Pro Touch ID                            │ │
│ │ │ Key │ Primary method • Last used 2 hours ago         │ │
│ │ └─────┘ ┌─────────────────────────────────────────┐   │ │
│ │         │ [Rename] [Remove] [Test]                   │   │
│ │         └─────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ┌─────┐ NFC Security Card                               │ │
│ │ │ Card│ Backup method • Last used 1 day ago            │ │
│ │ └─────┘ ┌─────────────────────────────────────────┐   │ │
│ │         │ [Rename] [Remove] [Test]                   │   │
│ │         └─────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [Add New Authenticator]                                    │
└─────────────────────────────────────────────────────────────┘
```

### 7. Recovery Codes Page

#### Code Generation Flow
```
┌─────────────────────────────────────────────────────────────┐
│ Recovery Codes                                             │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ⚠️  Important: Save these codes securely                 │ │
│ │                                                         │ │
│ │ Each code can be used only once. Store them in a       │ │
│ │ safe place where you can access them when needed.       │ │
│ │                                                         │ │
│ │ ┌─────────────────────────────────────────┐           │ │
│ │ │ ABCD-1234-EFGH-5678                      │           │ │
│ │ │ IJKL-9012-MNOP-3456                      │           │ │
│ │ │ QRST-7890-UVWX-1234                      │           │ │
│ │ │ YZAB-5678-CDEF-9012                      │           │ │
│ │ │ GHIJ-3456-KLMN-7890                      │           │ │
│ │ └─────────────────────────────────────────┘           │ │
│ │                                                         │ │
│ │ [Download PDF] [Print] [Copy to Clipboard]             │ │
│ │                                                         │ │
│ │ [I've saved my codes] [Generate new codes]             │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 8. Security Events Page

#### Event Timeline
```
┌─────────────────────────────────────────────────────────────┐
│ Security Activity                                          │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Filter: [All Events ▼] [Date Range ▼] [Search]         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ✓ Login Successful                                       │ │
│ │   Via passkey • MacBook Pro • 2 hours ago              │ │
│ │   IP: 192.168.1.100 • Location: San Francisco, CA      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ⚠️  Failed Login Attempt                                 │ │
│ │   Invalid password • Unknown device • 3 days ago       │ │
│ │   IP: 185.220.101.10 • Location: Unknown               │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ + Authenticator Added                                    │ │
│ │   NFC Security Card • Mobile App • 1 day ago           │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 9. Account Recovery Page

#### Recovery Options
```
┌─────────────────────────────────────────────────────────────┐
│ Account Recovery                                           │
│                                                             │
│ Choose a recovery method to regain access to your account: │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ┌─────┐ Use NFC Card                                     │ │
│ │ │ Card│ Tap your security card to a device              │ │
│ │ └─────┘ ┌─────────────────────────────────────────┐   │ │
│ │         │ [Start NFC Scan]                             │   │
│ │         └─────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ┌─────┐ Use Recovery Code                               │ │
│ │ │ Code│ Enter one of your backup codes                  │ │
│ │ └─────┘ ┌─────────────────────────────────────────┐   │ │
│ │         │ [Enter Code]                                │   │
│ │         └─────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ⏰ Request Delayed Recovery                              │ │
│ │   Start a secure recovery process (24-48 hour delay)   │ │
│ │   ┌─────────────────────────────────────────┐         │ │
│ │   │ [Start Recovery Process]                │         │ │
│ │   └─────────────────────────────────────────┘         │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 10. Settings Page

#### Account Settings
```
┌─────────────────────────────────────────────────────────────┐
│ Account Settings                                           │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Profile Information                                      │ │
│ │ ┌─────────────────────────────────────────┐           │ │
│ │ │ Name                 │ [John Doe]       │           │ │
│ │ │ Email                │ [john@example.com]│           │ │
│ │ │ ┌─────────────────────────────────────────┐       │ │
│ │ │ │ [Save Changes]                            │       │ │
│ │ │ └─────────────────────────────────────────┘       │ │
│ │ └─────────────────────────────────────────┘           │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Session Management                                       │ │
│ │ ┌─────────────────────────────────────────┐           │ │
│ │ │ ✓ MacBook Pro • Current • 2 hours ago   │           │ │
│ │ │ ✓ iPhone 14 Pro • Trusted • 1 day ago   │           │ │
│ │ │ ┌─────────────────────────────────────────┐       │ │
│ │ │ │ [Sign Out All Devices]                  │       │ │
│ │ │ └─────────────────────────────────────────┘       │ │
│ │ └─────────────────────────────────────────┘           │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ⚠️  Danger Zone                                           │ │
│ │   Destructive actions that cannot be undone             │ │
│ │   ┌─────────────────────────────────────────┐         │ │
│ │   │ [Delete Account]                          │         │ │
│ │   └─────────────────────────────────────────┘         │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Mobile UX Guidance

### NFC Scan Screen
```
┌─────────────────────────────────┐
│ ← NFC Card Scan          [✕]    │
├─────────────────────────────────┤
│                                 │
│         Hold your card          │
│         near the device         │
│                                 │
│    ┌─────────────────────┐     │
│    │                     │     │
│    │         NFC         │     │
│    │                     │     │
│    └─────────────────────┘     │
│                                 │
│      Waiting for card...        │
│                                 │
│      [Cancel]                   │
└─────────────────────────────────┘
```

### Card Enrollment Flow
```
┌─────────────────────────────────┐
│ ← Add Security Card      [✕]    │
├─────────────────────────────────┤
│                                 │
│    ┌─────────────────────┐     │
│    │    Card Icon        │     │
│    │                     │     │
│    │   NFC Security      │     │
│    │   Cards provide     │     │
│    │   physical backup    │     │
│    │   for your account. │     │
│    │                     │     │
│    │   [Start Scan]       │     │
│    │   [Learn More]       │     │
│    └─────────────────────┘     │
└─────────────────────────────────┘
```

## Component Implementation Examples

### Security Status Card
```jsx
<Card variant="security" securityStatus="protected" className="p-6">
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="text-h4">Account Security</h3>
      <p className="text-body-sm text-muted-foreground">Your account is protected</p>
    </div>
    <Shield className="w-8 h-8 text-success-600" />
  </div>
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <span className="text-sm">Security Score</span>
      <Badge status="protected">85/100</Badge>
    </div>
    <div className="h-2 bg-neutral-200 rounded-full">
      <div className="h-2 bg-success-600 rounded-full" style={{width: '85%'}} />
    </div>
    <div className="pt-2 space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <CheckCircle className="w-4 h-4 text-success-600" />
        <span>3 authenticators active</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <CheckCircle className="w-4 h-4 text-success-600" />
        <span>Recovery codes available</span>
      </div>
    </div>
  </div>
</Card>
```

### Authenticator Card
```jsx
<Card className="p-6 hover:shadow-elevated transition-shadow">
  <div className="flex items-start gap-4">
    <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
      <Key className="w-6 h-6 text-accent-600" />
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-h4">{authenticator.name}</h3>
        <Badge status="protected">Active</Badge>
      </div>
      <p className="text-body-sm text-muted-foreground mb-4">
        {authenticator.type} • Last used {authenticator.lastUsed}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">Test</Button>
        <Button variant="ghost" size="sm">Rename</Button>
        <Button variant="ghost" size="sm" className="text-error-600">Remove</Button>
      </div>
    </div>
  </div>
</Card>
```

### Security Event Row
```jsx
<div className="flex items-start gap-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors">
  <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center flex-shrink-0">
    <CheckCircle className="w-4 h-4 text-success-600" />
  </div>
  <div className="flex-1 min-w-0">
    <div className="flex items-center justify-between mb-1">
      <h4 className="text-sm font-medium">{event.title}</h4>
      <Badge variant="neutral" size="sm">{event.risk}</Badge>
    </div>
    <p className="text-sm text-muted-foreground mb-1">{event.description}</p>
    <p className="text-xs text-muted-foreground">
      {event.device} • {event.location} • {event.time}
    </p>
  </div>
</div>
```

This comprehensive design system provides a premium, trustworthy interface that communicates security and sophistication while maintaining excellent usability for both consumer and enterprise users.
