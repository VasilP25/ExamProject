import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CarCard } from '@/components/car-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { getDashboardAds } from '@/services/cars-api';
import type { MobileAd } from '@/types/ad';

export default function DashboardScreen() {
  const [ads, setAds] = useState<MobileAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getDashboardAds()
      .then((response) => {
        if (isMounted) {
          setAds(response.ads);
          setError(null);
        }
      })
      .catch((fetchError: Error) => {
        if (isMounted) {
          setError(fetchError.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="subtitle">Dashboard</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Last three added ads
          </ThemedText>
        </View>

        {isLoading ? (
          <ActivityIndicator />
        ) : error ? (
          <ThemedView type="backgroundElement" style={styles.messageBox}>
            <ThemedText type="small" themeColor="textSecondary">
              {error}
            </ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={ads}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <CarCard ad={item} />}
            contentContainerStyle={styles.list}
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  header: {
    gap: 8,
    marginBottom: Spacing.four,
  },
  list: {
    gap: Spacing.four,
    paddingBottom: Spacing.four,
  },
  messageBox: {
    borderRadius: 12,
    padding: Spacing.four,
  },
});
