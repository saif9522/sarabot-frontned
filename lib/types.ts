export type SessionStatus = 'disconnected' | 'starting' | 'qr' | 'connected';
export interface SessionState { status: SessionStatus; qr: string | null; lastError: string | null }
export interface Account {
  id: string; label: string; phone: string | null; botEnabled: boolean;
  workingBotId: string | null; offHoursBotId: string | null;
  workDays: string; workStart: string; workEnd: string; timezone: string;
  session: SessionState; workingNow: boolean; _count?: { contacts: number };
}
export type StepType = 'text' | 'image' | 'document' | 'delay';
export interface FlowStep { id?: string; type: StepType; text: string; media: string; fileName: string; delaySeconds: number }
export interface Flow {
  id: string; botId: string; name: string; keywords: string; matchType: 'contains' | 'exact' | 'starts';
  isNoMatch: boolean; enabled: boolean; priority: number; steps: FlowStep[];
}
export interface Bot {
  id: string; name: string; aiEnabled: boolean; instructions: string; knowledge: string;
  companyName: string; location: string; industry: string; assistantName: string; primaryGoal: string;
  supportEmail: string; websiteUrl: string; phoneNumbers: string;
  welcomeMessage: string; fallbackMessage: string; useProducts: boolean; updatedAt: string;
  flows?: Flow[]; _count?: { flows: number; workingFor: number; offHoursFor: number }; aiAvailable?: boolean;
}
export interface Message { id: string; direction: 'in' | 'out'; body: string; sentBy: string; type: 'text' | 'image' | 'document'; media: string; createdAt: string }
export interface Contact {
  id: string; accountId: string; waId: string; name: string | null; botPaused: boolean; needsHuman: boolean; optedOut: boolean;
  tags: string; messageCount: number; firstSeenAt: string; lastMessageAt: string;
  assignedToId?: string | null; assignedTo?: { id: string; name: string } | null;
  account?: { id?: string; label: string; phone: string | null }; lastMessage?: Message | null;
}
export interface Category { id: string; name: string; _count?: { products: number } }
export interface Product {
  id: string; name: string; sku: string | null; price: number | null; currency: string; description: string;
  inStock: boolean; imageUrl: string | null; categoryId: string | null; category?: { id: string; name: string } | null;
}
export type OutMessage =
  | { type: 'text'; text: string }
  | { type: 'image' | 'document'; media: string; caption?: string; fileName?: string }
  | { type: 'delay'; seconds: number };
export interface Decision { messages: OutMessage[]; via: 'flow' | 'ai' | 'nomatch' | 'fallback' | 'ignored' | 'none'; flowName?: string; handoff: boolean; reason?: string }
export interface NumberStats {
  id: string; label: string; phone: string | null; botEnabled: boolean; status: SessionStatus;
  received: number; botReplies: number; humanReplies: number; byFlow: number; byAi: number;
}
export interface Dashboard {
  aiAvailable: boolean;
  range: { from: string; to: string };
  numbers: { total: number; connected: number };
  subscribers: { total: number; newInRange: number };
  needsHuman: number;
  totals: { received: number; botReplies: number; humanReplies: number; byFlow: number; byAi: number };
  perNumber: NumberStats[];
  setup: { bots: number; products: number };
  plan: PlanStatus;
}

export type Role = 'superadmin' | 'owner' | 'admin' | 'agent';
export interface PlanStatus {
  active: boolean; reason: 'none' | 'expired' | 'used_up' | 'suspended' | null; planName: string | null;
  chatLimit: number | null; chatsUsed: number; chatsLeft: number | null; numbersLimit: number; agentsLimit: number;
  startsAt: string | null; endsAt: string | null; daysLeft: number | null;
  upcoming: { planName: string; startsAt: string; endsAt: string } | null;
}
export interface Me {
  user: { id: string; name: string; email: string; role: Role; effectiveRole: Role; workspaceId: string | null; seeUnassigned: boolean; actingAs: boolean };
  workspace: { id: string; name: string; autoAssign: boolean } | null;
  plan: PlanStatus | null;
}
export interface Plan {
  id: string; name: string; description: string; chatLimit: number | null; durationDays: number; price: number; currency: string;
  numbersLimit: number; agentsLimit: number; active?: boolean; trialForSignup?: boolean; sortOrder?: number; _count?: { subscriptions: number };
}
export interface Subscription {
  id: string; planName: string; chatLimit: number | null; chatsUsed: number; startsAt: string; endsAt: string; status: string;
  amountPaid: number; currency: string; note?: string; activatedBy?: string; numbersLimit?: number; agentsLimit?: number;
}
export interface TeamUser {
  id: string; name: string; email: string; mobile: string; role: Role; active: boolean; seeUnassigned: boolean;
  createdAt: string; lastLoginAt: string | null; _count?: { assigned: number };
}
export interface Customer {
  id: string; name: string; status: 'active' | 'suspended'; notes: string; createdAt: string; autoAssign: boolean;
  users: Array<{ id: string; name: string; email: string; mobile: string; lastLoginAt: string | null; role?: Role; active?: boolean; seeUnassigned?: boolean; createdAt?: string; _count?: { assigned: number } }>;
  _count?: { accounts: number; users: number; bots?: number; products?: number };
  plan: PlanStatus;
}
export interface Payment {
  id: string; workspaceId: string; planName: string; amount: number; currency: string; status: 'created' | 'paid' | 'failed';
  razorpayOrderId: string; razorpayPaymentId: string | null; subscriptionId?: string | null; paidBy: string; createdAt: string; paidAt: string | null;
  workspace?: { id: string; name: string };
}
export interface PlatformUser {
  id: string; name: string; email: string; mobile: string; role: Role; active: boolean; seeUnassigned: boolean;
  createdAt: string; lastLoginAt: string | null; workspace: { id: string; name: string; status: string } | null; _count: { assigned: number };
}
export interface PlatformSetting { key: string; label: string; secret: boolean; source: 'dashboard' | 'env' | 'unset'; value: string }
export interface CustomerDetail extends Customer {
  subscriptions: Subscription[];
  payments: Payment[];
  stats: { subscribers: number; messages: number; botReplies: number };
  accounts: Array<{ id: string; label: string; phone: string | null; status: SessionStatus }>;
}
export interface AdminOverview {
  customers: number; suspended: number; paying: number; withoutPlan: number; activePlans: number;
  people: { owners: number; admins: number; agents: number };
  numbers: { total: number; connected: number };
  subscribers: number;
  today: { received: number; botReplies: number; payments: number };
  revenueThisMonth: Array<{ currency: string; amount: number }>;
  expiringSoon: Array<{ workspaceId: string; name: string; planName: string; endsAt: string }>;
}
