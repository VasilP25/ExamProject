import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

type ScreenHeaderProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

export function ScreenHeader({ iconName, title, description }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <ThemedView type="backgroundElement" style={styles.iconBox}>
        <Ionicons name={iconName} size={22} color="#3c87f7" />
      </ThemedView>
      <View style={styles.text}>
        <ThemedText type="subtitle">{title}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {description}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  iconBox: {
    alignItems: 'center',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  text: {
    flex: 1,
    gap: 4,
  },
});
