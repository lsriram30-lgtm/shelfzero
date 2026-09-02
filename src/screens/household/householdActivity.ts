import { DonationRecord, HouseholdMember, PantryItem, ShoppingListItem } from "../../types";

export interface MemberActivity {
  memberId: string;
  blurb: string;
  timestamp: string;
}

// Only built from real, already-tracked data - there's no "what did you
// cook" or reaction feature anywhere in the app, so a blurb is always one
// of: added a pantry item, added a shopping list item, or logged a
// donation. Pantry/donations key by the member's real account id
// (addedBy/donatedBy); the shopping list's addedBy is already a display
// name instead (a different backend quirk), so it's matched by name here.
export function computeLatestActivityByMember(
  members: HouseholdMember[],
  pantryItems: PantryItem[],
  shoppingItems: ShoppingListItem[],
  donations: DonationRecord[]
): Record<string, MemberActivity> {
  const nameToId = new Map(members.map((m) => [m.name.trim().toLowerCase(), m.id]));
  const candidates: MemberActivity[] = [];

  for (const item of pantryItems) {
    if (!item.addedBy) continue;
    candidates.push({ memberId: item.addedBy, blurb: `+ ${item.name}`, timestamp: item.createdAt });
  }

  for (const item of shoppingItems) {
    if (!item.addedBy) continue;
    const memberId = nameToId.get(item.addedBy.trim().toLowerCase());
    if (!memberId) continue;
    candidates.push({ memberId, blurb: `+ ${item.name}`, timestamp: item.createdAt });
  }

  for (const donation of donations) {
    if (!donation.donatedBy) continue;
    candidates.push({ memberId: donation.donatedBy, blurb: "❤️ Donated", timestamp: donation.date });
  }

  const latestByMember: Record<string, MemberActivity> = {};
  for (const candidate of candidates) {
    const current = latestByMember[candidate.memberId];
    if (!current || new Date(candidate.timestamp).getTime() > new Date(current.timestamp).getTime()) {
      latestByMember[candidate.memberId] = candidate;
    }
  }
  return latestByMember;
}
