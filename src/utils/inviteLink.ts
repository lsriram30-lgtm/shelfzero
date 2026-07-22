import * as Linking from "expo-linking";

export function inviteLink(token: string): string {
  return Linking.createURL(`join/${token}`);
}
