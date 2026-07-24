import * as Notifications from "expo-notifications";
import { PantryItem } from "../types";

const DAY_MS = 24 * 60 * 60 * 1000;
const REMINDER_WINDOW_DAYS = 3;
const REMINDER_HOUR = 9;

const EXPIRY_CATEGORY = "pantry-expiry";
const INVITE_CATEGORY = "invite-activity";

let handlerConfigured = false;

export function configureNotificationHandler(): void {
  if (handlerConfigured) return;
  handlerConfigured = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  const request = await Notifications.requestPermissionsAsync();
  return request.granted;
}

function reminderDateFor(item: PantryItem): Date {
  const expiry = new Date(item.expiresAt as string);
  const reminderDate = new Date(expiry.getTime() - REMINDER_WINDOW_DAYS * DAY_MS);
  reminderDate.setHours(REMINDER_HOUR, 0, 0, 0);

  const soonest = new Date(Date.now() + 60 * 1000);
  return reminderDate > soonest ? reminderDate : soonest;
}

async function cancelByCategory(category: string): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const ours = scheduled.filter((n) => n.content.data?.category === category);
  await Promise.all(
    ours.map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );
}

export async function cancelExpiryReminders(): Promise<void> {
  await cancelByCategory(EXPIRY_CATEGORY);
}

export async function syncExpiryReminders(
  items: PantryItem[],
  enabled: boolean
): Promise<void> {
  await cancelByCategory(EXPIRY_CATEGORY);
  if (!enabled) return;

  const now = Date.now();
  const upcoming = items.filter((item) => {
    if (!item.expiresAt) return false;
    const daysLeft = (new Date(item.expiresAt).getTime() - now) / DAY_MS;
    return daysLeft >= 0 && daysLeft <= REMINDER_WINDOW_DAYS;
  });

  await Promise.all(
    upcoming.map((item) =>
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Use it up soon",
          body: `${item.name} expires ${new Date(item.expiresAt as string).toLocaleDateString()}.`,
          data: { category: EXPIRY_CATEGORY, itemId: item.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: reminderDateFor(item),
        },
      })
    )
  );
}

export async function notifyInviteAccepted(name: string, enabled: boolean): Promise<void> {
  if (!enabled) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Household update",
      body: `${name} joined your household.`,
      data: { category: INVITE_CATEGORY },
    },
    trigger: null,
  });
}
