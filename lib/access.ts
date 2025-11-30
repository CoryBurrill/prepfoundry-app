// lib/access.ts
import "server-only";

import { ensureUserContext } from "@/lib/ensureUserContext";
import { featureGate } from "@/lib/feature-gate";

const BETA_MODE = true; // flip to false when you want everything public

type PageKey = "dashboard" | "inventory" | "recipes" | "planner" | "grocery";

type PageAccessConfig = {
  viewFeature: string;
  interactiveFeature?: string;
};

const PAGE_FEATURES: Record<PageKey, PageAccessConfig> = {
  dashboard: {
    viewFeature: "beta_public_dashboard",
    interactiveFeature: "beta_private_extras",
  },
  inventory: {
    viewFeature: "beta_public_inventory",
    interactiveFeature: "beta_private_extras",
  },
  recipes: {
    viewFeature: "beta_public_recipes",
    interactiveFeature: "beta_private_extras",
  },
  planner: {
    viewFeature: "beta_public_planner",
    interactiveFeature: "beta_private_extras",
  },
  grocery: {
    viewFeature: "beta_public_grocery",
    interactiveFeature: "beta_private_extras",
  },
};

type PageAccess = {
  user: any | null;
  profile: any | null;
  household: any | null;
  canView: boolean;
  canUse: boolean;
  isAdmin: boolean;
};

export async function getPageAccess(page: PageKey): Promise<PageAccess> {
  const { user, profile, household } = await ensureUserContext();

  // Not logged in
  if (!user) {
    return {
      user: null,
      profile: null,
      household: null,
      canView: false,
      canUse: false,
      isAdmin: false,
    };
  }

  const isAdmin =
    profile?.role === "admin" || profile?.role === "owner";

  // Admin OR beta mode off → full access
  if (!BETA_MODE || isAdmin) {
    return {
      user,
      profile,
      household,
      canView: true,
      canUse: true,
      isAdmin: true,
    };
  }

  // Beta mode on → use feature flags per page
  const config = PAGE_FEATURES[page];

  const [viewGate, useGate] = await Promise.all([
    featureGate(config.viewFeature),
    config.interactiveFeature
      ? featureGate(config.interactiveFeature)
      : Promise.resolve({ allowed: false, reason: "disabled" as const }),
  ]);

  const canView = !!viewGate.allowed;
  const canUse = !!useGate.allowed;

  return {
    user,
    profile,
    household,
    canView,
    canUse,
    isAdmin: false,
  };
}
