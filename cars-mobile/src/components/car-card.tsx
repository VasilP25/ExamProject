import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import type { MobileAd } from '@/types/ad';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type CarCardProps = {
  ad: MobileAd;
};

export function CarCard({ ad }: CarCardProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.imageFrame}>
        {ad.picture ? (
          <Image source={{ uri: ad.picture }} style={styles.image} contentFit="cover" />
        ) : (
          <View style={styles.emptyImage}>
            <ThemedText type="small" themeColor="textSecondary">
              No picture
            </ThemedText>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <ThemedText type="smallBold" style={styles.title}>
          {ad.name} {ad.model}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Year of registration: {ad.year}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Posted by: {ad.ownerName}
        </ThemedText>
        <ThemedText type="smallBold">
          {ad.likes} {ad.likes === 1 ? 'like' : 'likes'}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbe3ef',
  },
  imageFrame: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#e5eaf1',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  emptyImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    gap: 8,
    padding: 16,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
  },
});
