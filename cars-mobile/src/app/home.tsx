import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          iconName="car-sport-outline"
          title="Cars"
          description="Find fresh car ads and keep an eye on the latest listings."
        />

        <View style={styles.actions}>
          <Link href="/dashboard" asChild>
            <Pressable style={styles.primaryAction}>
              <ThemedText type="smallBold">Open dashboard</ThemedText>
            </Pressable>
          </Link>

          <Link href="/explore" asChild>
            <Pressable style={styles.secondaryAction}>
              <ThemedText type="smallBold">Browse ads</ThemedText>
            </Pressable>
          </Link>
        </View>
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
    justifyContent: 'center',
    padding: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  actions: {
    gap: Spacing.three,
    marginTop: Spacing.one,
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: '#3c87f7',
    borderRadius: 12,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  secondaryAction: {
    alignItems: 'center',
    borderColor: '#dbe3ef',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
});
