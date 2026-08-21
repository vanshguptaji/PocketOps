import { NewAppScreen } from '@react-native/new-app-screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import ExpenseScreen from './screens/ExpenseScreen';
import HabitScreen from './screens/HabitScreen';
import NoteScreen from './screens/NoteScreen';
import ProfileScreen from './screens/ProfileScreen';
import TaskScreen from './screens/TaskScreen';
import { createStaticNavigation } from '@react-navigation/native';

const RootStack = createNativeStackNavigator({
  screens:{
    Home: {
      screen: HomeScreen,
      options:{title: 'Home'}
    },
    Expense:{
      screen: ExpenseScreen,
      options:{title: 'Expense'}
    },
    Habit: {
      screen: HabitScreen,
      options:{title: 'Habit'}
    },
    Notes: {
      screen: NoteScreen,
      options:{title: 'Notes'}
    },
    Profile: {
      screen: ProfileScreen,
      options:{title: 'Profile'}
    },
    Tasks: {
      screen: TaskScreen,
      options:{title: 'Tasks'}
    }
  }
});

const Navigation = createStaticNavigation(RootStack);


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
      <Navigation />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
