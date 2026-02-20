import { Linking } from 'react-native';

export const openDiscogs = async (vinylId: number) => {
  const url = `https://www.discogs.com/release/${vinylId}`;
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
  }
};
