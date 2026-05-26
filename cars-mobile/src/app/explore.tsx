import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CarCard } from '@/components/car-card';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { getAds } from '@/services/cars-api';
import type { MobileAd } from '@/types/ad';

export default function BrowseAdsScreen() {
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [ads, setAds] = useState<MobileAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const timeout = setTimeout(() => {
      setIsLoading(true);

      getAds({ name, model, year, page })
        .then((response) => {
          if (isMounted) {
            setAds(response.ads);
            setHasMore(response.hasMore);
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

    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [name, model, year, page]);

  function updateName(value: string) {
    setName(value);
    setPage(1);
  }

  function updateModel(value: string) {
    setModel(value);
    setPage(1);
  }

  function updateYear(value: string) {
    setYear(value);
    setPage(1);
  }

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          iconName="search-outline"
          title="Browse ads"
          description="Search cars by brand, model, or year."
        />

        <ThemedView type="backgroundElement" style={styles.filters}>
          <TextInput
            value={name}
            onChangeText={updateName}
            placeholder="Brand"
            placeholderTextColor="#64748b"
            style={styles.input}
          />
          <TextInput
            value={model}
            onChangeText={updateModel}
            placeholder="Model"
            placeholderTextColor="#64748b"
            style={styles.input}
          />
          <TextInput
            value={year}
            onChangeText={updateYear}
            placeholder="Year"
            placeholderTextColor="#64748b"
            keyboardType="number-pad"
            style={styles.input}
          />
        </ThemedView>

        {isLoading ? (
          <ActivityIndicator style={styles.loader} />
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
            ListEmptyComponent={
              <ThemedView type="backgroundElement" style={styles.messageBox}>
                <ThemedText type="small" themeColor="textSecondary">
                  No car ads match your search.
                </ThemedText>
              </ThemedView>
            }
            ListFooterComponent={
              <View style={styles.pager}>
                <Pressable
                  disabled={page === 1}
                  onPress={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
                  style={[styles.pageButton, page === 1 && styles.disabledButton]}>
                  <ThemedText type="smallBold">Previous</ThemedText>
                </Pressable>
                <ThemedText type="small">Page {page}</ThemedText>
                <Pressable
                  disabled={!hasMore}
                  onPress={() => setPage((currentPage) => currentPage + 1)}
                  style={[styles.pageButton, !hasMore && styles.disabledButton]}>
                  <ThemedText type="smallBold">Next</ThemedText>
                </Pressable>
              </View>
            }
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
  filters: {
    gap: Spacing.two,
    borderRadius: 12,
    padding: Spacing.three,
    marginBottom: Spacing.four,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dbe3ef',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    color: '#0f172a',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  loader: {
    marginTop: Spacing.four,
  },
  list: {
    gap: Spacing.four,
    paddingBottom: Spacing.four,
  },
  messageBox: {
    borderRadius: 12,
    padding: Spacing.four,
  },
  pager: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingVertical: Spacing.four,
  },
  pageButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#dbe3ef',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  disabledButton: {
    opacity: 0.4,
  },
});
