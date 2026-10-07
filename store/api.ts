import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Account, AdminOverview, Bot, Category, Contact, Customer, CustomerDetail, Dashboard, Decision, Flow, Me, Message, Payment, Plan, PlanStatus, PlatformSetting, PlatformUser, Product, Subscription, TeamUser } from '@/lib/types';
import { API_URL } from '@/lib/format';

const raw = fetchBaseQuery({ baseUrl: API_URL, credentials: 'include' });
/** Sends the session cookie; a 401 anywhere except /auth/me sends the browser to the login page. */
const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, apiCtx, extra) => {
  const res = await raw(args, apiCtx, extra);
  const url = typeof args === 'string' ? args : args.url;
  if (res.error?.status === 401 && url !== 'auth/me' && typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
    window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
  }
  return res;
};

/** Error message from the API (Nest returns { message: string | string[] }). */
export function errorText(e: unknown, fallback = 'Something went wrong. Try again.'): string {
  const m = (e as { data?: { message?: string | string[] } })?.data?.message;
  return Array.isArray(m) ? m.join(' ') : m || fallback;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Me', 'Users', 'Payments', 'Settings', 'Admin', 'Plans', 'Customers', 'Customer', 'Team', 'Billing', 'Dashboard', 'Accounts', 'Bots', 'Bot', 'Chats', 'Thread', 'Subscribers', 'Products', 'Categories'],
  endpoints: (b) => ({
    me: b.query<Me, void>({ query: () => 'auth/me', providesTags: ['Me'] }),
    login: b.mutation<{ ok: true; role: string }, { email: string; password: string }>({ query: (body) => ({ url: 'auth/login', method: 'POST', body }) }),
    otpRequest: b.mutation<{ ok: true; message: string }, { email: string }>({ query: (body) => ({ url: 'auth/otp/request', method: 'POST', body }) }),
    otpVerify: b.mutation<{ ok: true; role: string }, { email: string; code: string }>({ query: (body) => ({ url: 'auth/otp/verify', method: 'POST', body }) }),
    signupInfo: b.query<{ open: boolean; trial: { name: string; chatLimit: number | null; durationDays: number } | null; emailConfigured: boolean }, void>({ query: () => 'auth/signup-info' }),
    signup: b.mutation<{ ok: true; role: string; trial: boolean }, { businessName: string; name: string; email: string; mobile?: string; password: string }>({
      query: (body) => ({ url: 'auth/signup', method: 'POST', body }),
    }),
    forgot: b.mutation<{ ok: true; message: string }, { email: string }>({ query: (body) => ({ url: 'auth/forgot', method: 'POST', body }) }),
    resetCheck: b.query<{ valid: boolean; email: string | null }, string>({ query: (token) => ({ url: 'auth/reset-check', params: { token } }) }),
    resetWithToken: b.mutation<{ ok: true }, { token: string; password: string }>({ query: (body) => ({ url: 'auth/reset', method: 'POST', body }) }),
    logout: b.mutation<unknown, void>({ query: () => ({ url: 'auth/logout', method: 'POST' }) }),
    changePassword: b.mutation<unknown, { current: string; next: string }>({ query: (body) => ({ url: 'auth/password', method: 'POST', body }) }),

    // Super Admin
    adminOverview: b.query<AdminOverview, void>({ query: () => 'admin/overview', providesTags: ['Admin'] }),
    adminPlans: b.query<Plan[], void>({ query: () => 'admin/plans', providesTags: ['Plans'] }),
    savePlan: b.mutation<Plan, Omit<Plan, 'id' | '_count'> & { id?: string }>({
      query: ({ id, ...body }) => ({ url: id ? `admin/plans/${id}` : 'admin/plans', method: id ? 'PATCH' : 'POST', body }),
      invalidatesTags: ['Plans', 'Admin'],
    }),
    deletePlan: b.mutation<unknown, string>({ query: (id) => ({ url: `admin/plans/${id}`, method: 'DELETE' }), invalidatesTags: ['Plans', 'Admin'] }),
    customers: b.query<Customer[], void>({ query: () => 'admin/customers', providesTags: ['Customers'] }),
    customer: b.query<CustomerDetail, string>({ query: (id) => `admin/customers/${id}`, providesTags: (_r, _e, id) => [{ type: 'Customer', id }] }),
    addCustomer: b.mutation<{ id: string }, { businessName: string; ownerName: string; ownerEmail: string; ownerMobile?: string; password: string; notes?: string }>({
      query: (body) => ({ url: 'admin/customers', method: 'POST', body }), invalidatesTags: ['Customers', 'Admin'],
    }),
    updateCustomer: b.mutation<unknown, { id: string; name?: string; status?: 'active' | 'suspended'; notes?: string }>({
      query: ({ id, ...body }) => ({ url: `admin/customers/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_r, _e, { id }) => ['Customers', 'Admin', { type: 'Customer', id }],
    }),
    deleteCustomer: b.mutation<unknown, string>({ query: (id) => ({ url: `admin/customers/${id}`, method: 'DELETE' }), invalidatesTags: ['Customers', 'Admin'] }),
    addOwner: b.mutation<unknown, { id: string; name: string; email: string; password: string }>({
      query: ({ id, ...body }) => ({ url: `admin/customers/${id}/owner`, method: 'POST', body }),
      invalidatesTags: (_r, _e, { id }) => ['Customers', { type: 'Customer', id }],
    }),
    resetPassword: b.mutation<unknown, { userId: string; password: string }>({
      query: ({ userId, password }) => ({ url: `admin/users/${userId}/password`, method: 'POST', body: { password } }),
    }),
    activatePlan: b.mutation<Subscription, { id: string; planId: string; start: 'now' | 'after'; durationDays?: number; amountPaid?: number; note?: string }>({
      query: ({ id, ...body }) => ({ url: `admin/customers/${id}/subscriptions`, method: 'POST', body }),
      invalidatesTags: (_r, _e, { id }) => ['Customers', 'Admin', { type: 'Customer', id }],
    }),
    subAction: b.mutation<unknown, { customerId: string; subId: string; action: 'cancel' | 'extend' | 'add-chats'; days?: number; chats?: number }>({
      query: ({ subId, action, days, chats }) => ({ url: `admin/subscriptions/${subId}/${action}`, method: 'POST', body: { days, chats } }),
      invalidatesTags: (_r, _e, { customerId }) => ['Customers', 'Admin', { type: 'Customer', id: customerId }],
    }),
    platformUsers: b.query<PlatformUser[], { q?: string; role?: string; status?: string }>({ query: (params) => ({ url: 'admin/users', params }), providesTags: ['Users'] }),
    updateUser: b.mutation<unknown, { id: string; active?: boolean; role?: string; name?: string; mobile?: string; email?: string }>({
      query: ({ id, ...body }) => ({ url: `admin/users/${id}`, method: 'PATCH', body }), invalidatesTags: ['Users', 'Customer', 'Customers', 'Admin'],
    }),
    deleteUser: b.mutation<unknown, string>({ query: (id) => ({ url: `admin/users/${id}`, method: 'DELETE' }), invalidatesTags: ['Users', 'Customer', 'Customers', 'Admin'] }),
    adminPayments: b.query<Payment[], { status?: string }>({ query: (params) => ({ url: 'admin/payments', params }), providesTags: ['Payments'] }),
    activatePayment: b.mutation<{ ok: true; planName: string; startsAt: string; endsAt: string }, { id: string; razorpayPaymentId?: string }>({
      query: ({ id, ...body }) => ({ url: `admin/payments/${id}/activate`, method: 'POST', body }), invalidatesTags: ['Payments', 'Customers', 'Customer', 'Admin'],
    }),
    platformSettings: b.query<PlatformSetting[], void>({ query: () => 'admin/settings', providesTags: ['Settings'] }),
    savePlatformSettings: b.mutation<PlatformSetting[], Record<string, string>>({ query: (body) => ({ url: 'admin/settings', method: 'PATCH', body }), invalidatesTags: ['Settings', 'Bots', 'Dashboard'] }),
    actAs: b.mutation<unknown, string>({ query: (id) => ({ url: `admin/act-as/${id}`, method: 'POST' }) }),
    exitActAs: b.mutation<unknown, void>({ query: () => ({ url: 'admin/act-as-exit', method: 'POST' }) }),

    // Customer workspace: team and billing
    agents: b.query<{ users: TeamUser[]; autoAssign: boolean; agentsLimit: number; agentsUsed: number }, void>({ query: () => 'agents', providesTags: ['Team'] }),
    saveAgent: b.mutation<TeamUser, Partial<TeamUser> & { password?: string }>({
      query: ({ id, ...body }) => ({ url: id ? `agents/${id}` : 'agents', method: id ? 'PATCH' : 'POST', body }),
      invalidatesTags: ['Team', 'Chats'],
    }),
    deleteAgent: b.mutation<unknown, string>({ query: (id) => ({ url: `agents/${id}`, method: 'DELETE' }), invalidatesTags: ['Team', 'Chats'] }),
    teamSettings: b.mutation<unknown, { autoAssign: boolean }>({ query: (body) => ({ url: 'agents', method: 'PATCH', body }), invalidatesTags: ['Team', 'Me'] }),
    team: b.query<Array<{ id: string; name: string; role: string }>, void>({ query: () => 'team', providesTags: ['Team'] }),
    billing: b.query<{ status: PlanStatus; history: Subscription[]; numbersUsed: number; agentsUsed: number; trial: { planId: string; planName: string; durationDays: number; chatLimit: number | null; available: boolean; alreadyUsed: boolean } | null }, void>({ query: () => 'billing', providesTags: ['Billing'] }),
    startTrial: b.mutation<{ ok: true; planName: string; endsAt: string }, void>({ query: () => ({ url: 'billing/trial', method: 'POST' }), invalidatesTags: ['Billing', 'Me', 'Dashboard'] }),
    publicPlans: b.query<Plan[], void>({ query: () => 'plans' }),
    paymentOptions: b.query<{ enabled: boolean; keyId: string | null; plans: Plan[]; prefill: { name: string; email: string }; business: string; current: { planId: string | null; planName: string; endsAt: string; price: number } | null }, void>({ query: () => 'payments/options', providesTags: ['Billing'] }),
    paymentFailed: b.mutation<unknown, string>({ query: (orderId) => ({ url: 'payments/failed', method: 'POST', body: { orderId } }), invalidatesTags: ['Payments'] }),
    createOrder: b.mutation<{ orderId: string; amount: number; currency: string; keyId: string; planName: string }, string>({ query: (planId) => ({ url: 'payments/order', method: 'POST', body: { planId } }) }),
    verifyPayment: b.mutation<{ ok: true; planName: string | null; startsAt: string | null; endsAt: string | null; startsNow: boolean }, { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }>({
      query: (body) => ({ url: 'payments/verify', method: 'POST', body }), invalidatesTags: ['Billing', 'Me', 'Dashboard', 'Payments'],
    }),
    myPayments: b.query<Payment[], void>({ query: () => 'payments', providesTags: ['Payments'] }),

    dashboard: b.query<Dashboard, { from?: string; to?: string }>({ query: (params) => ({ url: 'dashboard', params }), providesTags: ['Dashboard'] }),

    accounts: b.query<Account[], void>({ query: () => 'accounts', providesTags: ['Accounts'] }),
    addAccount: b.mutation<Account, { label: string }>({ query: (body) => ({ url: 'accounts', method: 'POST', body }), invalidatesTags: ['Accounts', 'Dashboard'] }),
    linkAccount: b.mutation<Account, string>({ query: (id) => ({ url: `accounts/${id}/link`, method: 'POST' }), invalidatesTags: ['Accounts'] }),
    unlinkAccount: b.mutation<Account, string>({ query: (id) => ({ url: `accounts/${id}/unlink`, method: 'POST' }), invalidatesTags: ['Accounts', 'Dashboard'] }),
    updateAccount: b.mutation<Account, Partial<Account> & { id: string }>({
      query: ({ id, session: _s, workingNow: _w, _count: _c, phone: _p, ...body }) => ({ url: `accounts/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Accounts'],
    }),
    deleteAccount: b.mutation<unknown, string>({ query: (id) => ({ url: `accounts/${id}`, method: 'DELETE' }), invalidatesTags: ['Accounts', 'Dashboard', 'Chats', 'Subscribers'] }),

    bots: b.query<{ aiAvailable: boolean; bots: Bot[] }, void>({ query: () => 'bots', providesTags: ['Bots'] }),
    bot: b.query<Bot, string>({ query: (id) => `bots/${id}`, providesTags: (_r, _e, id) => [{ type: 'Bot', id }] }),
    addBot: b.mutation<Bot, { name: string }>({ query: (body) => ({ url: 'bots', method: 'POST', body }), invalidatesTags: ['Bots', 'Dashboard'] }),
    updateBot: b.mutation<Bot, Partial<Bot> & { id: string }>({
      query: ({ id, flows: _f, _count: _c, aiAvailable: _a, updatedAt: _u, ...body }) => ({ url: `bots/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_r, _e, { id }) => ['Bots', { type: 'Bot', id }],
    }),
    deleteBot: b.mutation<unknown, string>({ query: (id) => ({ url: `bots/${id}`, method: 'DELETE' }), invalidatesTags: ['Bots', 'Accounts', 'Dashboard'] }),
    saveFlow: b.mutation<Flow, Omit<Flow, 'id'> & { id?: string }>({
      query: ({ id, botId, ...body }) => ({
        url: id ? `bots/${botId}/flows/${id}` : `bots/${botId}/flows`, method: id ? 'PUT' : 'POST',
        body: { ...body, steps: body.steps.map(({ type, text, media, fileName, delaySeconds }) => ({ type, text, media, fileName, delaySeconds })) },
      }),
      invalidatesTags: (_r, _e, { botId }) => [{ type: 'Bot', id: botId }, 'Bots'],
    }),
    toggleFlow: b.mutation<unknown, { botId: string; id: string; enabled: boolean }>({
      query: ({ botId, id, enabled }) => ({ url: `bots/${botId}/flows/${id}`, method: 'PATCH', body: { enabled } }),
      invalidatesTags: (_r, _e, { botId }) => [{ type: 'Bot', id: botId }],
    }),
    duplicateFlow: b.mutation<Flow, { botId: string; id: string }>({
      query: ({ botId, id }) => ({ url: `bots/${botId}/flows/${id}/duplicate`, method: 'POST' }),
      invalidatesTags: (_r, _e, { botId }) => [{ type: 'Bot', id: botId }, 'Bots'],
    }),
    deleteFlow: b.mutation<unknown, { botId: string; id: string }>({
      query: ({ botId, id }) => ({ url: `bots/${botId}/flows/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, { botId }) => [{ type: 'Bot', id: botId }, 'Bots'],
    }),
    upload: b.mutation<{ media: string; kind: 'image' | 'document'; fileName: string; size: number }, File>({
      query: (file) => {
        const body = new FormData();
        body.append('file', file);
        return { url: 'uploads', method: 'POST', body };
      },
    }),
    testBot: b.mutation<Decision, { id: string; message: string; history: Array<{ direction: 'in' | 'out'; body: string }> }>({
      query: ({ id, ...body }) => ({ url: `bots/${id}/test`, method: 'POST', body }),
    }),

    chats: b.query<Contact[], { accountId?: string; filter?: string }>({ query: (params) => ({ url: 'chats', params }), providesTags: ['Chats'] }),
    thread: b.query<{ contact: Contact; messages: Message[] }, string>({ query: (id) => `chats/${id}`, providesTags: (_r, _e, id) => [{ type: 'Thread', id }] }),
    sendMessage: b.mutation<Message, { id: string; text: string }>({
      query: ({ id, text }) => ({ url: `chats/${id}/send`, method: 'POST', body: { text } }),
      // Like WhatsApp: the bubble appears instantly, then is replaced by the saved message.
      async onQueryStarted({ id, text }, { dispatch, queryFulfilled }) {
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const temp: Message = { id: tempId, direction: 'out', body: text, sentBy: 'human', type: 'text', media: '', createdAt: new Date().toISOString(), pending: true };
        dispatch(api.util.updateQueryData('thread', id, (d) => { d.messages.push(temp); }));
        try {
          const { data: saved } = await queryFulfilled;
          dispatch(api.util.updateQueryData('thread', id, (d) => {
            d.messages = d.messages.filter((m) => m.id !== tempId);
            if (!d.messages.some((m) => m.id === saved.id)) d.messages.push(saved);
            d.contact.botPaused = true;
            d.contact.needsHuman = false;
          }));
        } catch {
          dispatch(api.util.updateQueryData('thread', id, (d) => { d.messages = d.messages.filter((m) => m.id !== tempId); }));
        }
      },
      invalidatesTags: ['Chats'],
    }),
    updateContact: b.mutation<Contact, { id: string; botPaused?: boolean; optedOut?: boolean; needsHuman?: boolean; tags?: string; assignedToId?: string | null }>({
      query: ({ id, ...body }) => ({ url: `contacts/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Thread', id }, 'Chats', 'Subscribers', 'Dashboard'],
    }),
    subscribers: b.query<Contact[], { q?: string; accountId?: string }>({ query: (params) => ({ url: 'subscribers', params }), providesTags: ['Subscribers'] }),

    categories: b.query<Category[], void>({ query: () => 'categories', providesTags: ['Categories'] }),
    addCategory: b.mutation<Category, { name: string }>({ query: (body) => ({ url: 'categories', method: 'POST', body }), invalidatesTags: ['Categories'] }),
    deleteCategory: b.mutation<unknown, string>({ query: (id) => ({ url: `categories/${id}`, method: 'DELETE' }), invalidatesTags: ['Categories', 'Products'] }),
    products: b.query<Product[], { q?: string; categoryId?: string }>({ query: (params) => ({ url: 'products', params }), providesTags: ['Products'] }),
    saveProduct: b.mutation<Product, Partial<Product>>({
      query: ({ id, category: _c, ...body }) => ({ url: id ? `products/${id}` : 'products', method: id ? 'PATCH' : 'POST', body }),
      invalidatesTags: ['Products', 'Categories', 'Dashboard'],
    }),
    deleteProduct: b.mutation<unknown, string>({ query: (id) => ({ url: `products/${id}`, method: 'DELETE' }), invalidatesTags: ['Products', 'Categories', 'Dashboard'] }),
  }),
});

export const {
  useMeQuery, useLoginMutation, useLogoutMutation, useChangePasswordMutation,
  useOtpRequestMutation, useOtpVerifyMutation,
  useSignupInfoQuery, useSignupMutation, useForgotMutation, useResetCheckQuery, useResetWithTokenMutation,
  useAdminOverviewQuery, useAdminPlansQuery, useSavePlanMutation, useDeletePlanMutation, useCustomersQuery, useCustomerQuery,
  useAddCustomerMutation, useUpdateCustomerMutation, useDeleteCustomerMutation, useAddOwnerMutation, useResetPasswordMutation,
  useActivatePlanMutation, useSubActionMutation, useActAsMutation, useExitActAsMutation,
  usePlatformUsersQuery, useUpdateUserMutation, useDeleteUserMutation, useAdminPaymentsQuery, usePlatformSettingsQuery, useSavePlatformSettingsMutation,
  usePaymentOptionsQuery, useStartTrialMutation, useActivatePaymentMutation, useCreateOrderMutation, useVerifyPaymentMutation, usePaymentFailedMutation, useMyPaymentsQuery,
  useAgentsQuery, useSaveAgentMutation, useDeleteAgentMutation, useTeamSettingsMutation, useTeamQuery, useBillingQuery, usePublicPlansQuery,
  useDashboardQuery, useAccountsQuery, useAddAccountMutation, useLinkAccountMutation, useUnlinkAccountMutation, useUpdateAccountMutation, useDeleteAccountMutation,
  useBotsQuery, useBotQuery, useAddBotMutation, useUpdateBotMutation, useDeleteBotMutation, useSaveFlowMutation, useToggleFlowMutation, useDuplicateFlowMutation, useDeleteFlowMutation, useUploadMutation, useTestBotMutation,
  useChatsQuery, useThreadQuery, useSendMessageMutation, useUpdateContactMutation, useSubscribersQuery,
  useCategoriesQuery, useAddCategoryMutation, useDeleteCategoryMutation, useProductsQuery, useSaveProductMutation, useDeleteProductMutation,
} = api;
