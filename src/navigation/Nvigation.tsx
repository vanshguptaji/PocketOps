import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const NEON_GREEN = '#39FF14';
const MUTED_GREEN = '#2E8B2E';
const BORDER_GRAY = '#1A1A1A';

const NAV_ITEMS = [
  { name: 'Home', icon: '⌂', label: 'HOME' },
  { name: 'Habit', icon: '▤', label: 'HABITS' },
  { name: 'Tasks', icon: '▶', label: 'TASKS' },
  { name: 'Notes', icon: '📝', label: 'NOTES' },
  { name: 'Expense', icon: '💰', label: 'EXPENSES' },
  { name: 'Profile', icon: '▮', label: 'STATS' },
] as const;

const TabBar = ({ state, navigation }: BottomTabBarProps) => {
  const activeRouteName = state.routes[state.index].name;

  return (
    <View style={styles.bottomNav}>
      {NAV_ITEMS.map((item) => {
        const isActive = activeRouteName === item.name;
        return (
          <Pressable
            key={item.name}
            style={styles.navItem}
            onPress={() => navigation.navigate(item.name)}
          >
            {isActive ? (
              <View style={styles.navItemActive}>
                <Text style={styles.navIconActive}>{item.icon}</Text>
                <Text style={styles.navLabelActive}>{item.label}</Text>
              </View>
            ) : (
              <>
                <Text style={styles.navIcon}>{item.icon}</Text>
                <Text style={styles.navLabel}>{item.label}</Text>
              </>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: BORDER_GRAY,
    backgroundColor: '#000000',
    paddingVertical: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    backgroundColor: NEON_GREEN,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 4,
    alignItems: 'center',
    width: '90%',
  },
  navIcon: {
    color: MUTED_GREEN,
    fontSize: 14,
    marginBottom: 2,
  },
  navIconActive: {
    color: '#000000',
    fontSize: 14,
    marginBottom: 2,
  },
  navLabel: {
    color: MUTED_GREEN,
    fontFamily: 'Courier',
    fontSize: 8,
  },
  navLabelActive: {
    color: '#000000',
    fontFamily: 'Courier',
    fontSize: 8,
    fontWeight: 'bold',
  },
});

export default TabBar;