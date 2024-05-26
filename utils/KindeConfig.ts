import { KindeSDK } from "@kinde-oss/react-native-sdk-0-7x";

export const client = new KindeSDK(
  String(process.env.EXPO_PUBLIC_KINDE_ISSUER),
  String(process.env.EXPO_PUBLIC_REDIRECT_URI),
  String(process.env.EXPO_PUBLIC_CLIENT_ID),
  String(process.env.EXPO_PUBLIC_LOGOUT_REDIRECT_URI)
);
