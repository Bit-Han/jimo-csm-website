import type {
  AdminUserListRow,
  PermissionMatrixRow,
  RoleSummaryCard,
} from "@/lib/types/admin/users-roles";

// TODO (integration stage):
// db.query.adminUsers.findMany({ orderBy: [desc(adminUsers.createdAt)] })
export const mockAdminUsers: AdminUserListRow[] = [
  {
    id: "user-tolu",
    fullName: "Tolu Adebayo",
    email: "tolu@jimo.ng",
    role: "super-admin",
    roleLabel: "Super Admin",
    status: "active",
    permissionSummary: "All modules",
    lastActive: "2 min ago",
  },
  {
    id: "user-amara",
    fullName: "Amara Okafor",
    email: "amara@jimo.ng",
    role: "website-manager",
    roleLabel: "Website Manager",
    status: "active",
    permissionSummary: "Projects, Pages, Media",
    lastActive: "1 hr ago",
  },
  {
    id: "user-emeka",
    fullName: "Emeka Achidi",
    email: "emeka@jimo.ng",
    role: "content-seo",
    roleLabel: "Content / SEO",
    status: "active",
    permissionSummary: "Content, SEO Centre",
    lastActive: "3 hrs ago",
  },
  {
    id: "user-fumi",
    fullName: "Fumi Okafor",
    email: "fumi@jimo.ng",
    role: "sales-crm",
    roleLabel: "Sales / CRM",
    status: "active",
    permissionSummary: "Leads, Enquiries",
    lastActive: "15 min ago",
  },
  {
    id: "user-ibrahim",
    fullName: "Ibrahim Musa",
    email: "ibrahim@jimo.ng",
    role: "website-manager",
    roleLabel: "Website Manager",
    status: "inactive",
    permissionSummary: "Projects, Pages",
    lastActive: "2 weeks ago",
  },
];

export const mockRoleSummaryCards: RoleSummaryCard[] = [
  {
    role: "super-admin",
    label: "Super Admin",
    count: 2,
    description: "Full access to all modules.",
    colorClass: "bg-violet-50 border-violet-200",
    textClass: "text-violet-700",
  },
  {
    role: "website-manager",
    label: "Website Manager",
    count: 4,
    description: "Projects, pages, media and forms.",
    colorClass: "bg-blue-50 border-blue-200",
    textClass: "text-blue-700",
  },
  {
    role: "content-seo",
    label: "Content / SEO",
    count: 5,
    description: "Content, SEO and insights.",
    colorClass: "bg-emerald-50 border-emerald-200",
    textClass: "text-emerald-700",
  },
  {
    role: "sales-crm",
    label: "Sales / CRM",
    count: 6,
    description: "Leads and communications.",
    colorClass: "bg-amber-50 border-amber-200",
    textClass: "text-amber-700",
  },
  {
    role: "marketing-admin",
    label: "Marketing Admin",
    count: 3,
    description: "Campaigns and assets.",
    colorClass: "bg-pink-50 border-pink-200",
    textClass: "text-pink-700",
  },
];

export const mockPermissionMatrix: PermissionMatrixRow[] = [
  {
    permission: "edit-pricing",
    label: "Edit Pricing",
    values: {
      "super-admin": "yes",
      "website-manager": "yes",
      "content-seo": "no",
      "sales-crm": "partial",
      "marketing-admin": "no",
    },
  },
  {
    permission: "publish-brochure",
    label: "Publish Brochure",
    values: {
      "super-admin": "yes",
      "website-manager": "yes",
      "content-seo": "yes",
      "sales-crm": "yes",
      "marketing-admin": "yes",
    },
  },
  {
    permission: "view-leads",
    label: "View Leads",
    values: {
      "super-admin": "yes",
      "website-manager": "yes",
      "content-seo": "no",
      "sales-crm": "yes",
      "marketing-admin": "no",
    },
  },
  {
    permission: "edit-seo",
    label: "Edit SEO",
    values: {
      "super-admin": "yes",
      "website-manager": "yes",
      "content-seo": "yes",
      "sales-crm": "no",
      "marketing-admin": "partial",
    },
  },
  {
    permission: "change-integrations",
    label: "Change Integrations",
    values: {
      "super-admin": "yes",
      "website-manager": "partial",
      "content-seo": "no",
      "sales-crm": "no",
      "marketing-admin": "no",
    },
  },
];