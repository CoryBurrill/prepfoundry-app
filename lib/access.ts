// lib/access.ts
import "server-only";

import { ensureUserContext } from "@/lib/ensureUserContext";
import { featureGate } from "@/lib/feature-gate";

const BETA_MODE = true; // flip to false when you want everything public

type PageKey = "dashboard";

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

  if (!BETA_MODE) {
    const isAdmin =
      profile?.role === "admin" || profile?.role === "owner";

    return {
      user,
      profile,
      household,
      canView: true,
      canUse: true,
      isAdmin,
    };
  }

  // For now we only care about dashboard
  const [betaGate, privateGate] = await Promise.all([
    featureGate("beta_public_dashboard"),
    featureGate("beta_private_extras"),
  ]);

  const hasPublicBeta = !!betaGate.allowed;
  const hasPrivateExtras = !!privateGate.allowed;

  const isAdmin =
    hasPrivateExtras ||
    profile?.role === "admin" ||
    profile?.role === "owner";

  return {
    user,
    profile,
    household,
    canView: hasPublicBeta,
    canUse: hasPrivateExtras,
    isAdmin,
  };
}