import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import ExpenseScreen from './screens/ExpenseScreen';
import HabitScreen from './screens/HabitScreen';
import NoteListScreen from './screens/NoteListScreen';
import NoteScreen from './screens/NoteScreen';
import ProfileScreen from './screens/ProfileScreen';
import TaskScreen from './screens/TaskScreen';
import SplashScreen from './screens/SplashScreen';
import TabBar from './navigation/Nvigation';
import { createStaticNavigation } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

const Tabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
  },
  tabBar: (props) => <TabBar {...props} />,
  screens: {
    Home: { screen: HomeScreen, options: { title: 'Home' } },
    Habit: { screen: HabitScreen, options: { title: 'Habit' } },
    Tasks: { screen: TaskScreen, options: { title: 'Tasks' } },
    Notes: { screen: NoteListScreen, options: { title: 'Notes' } },
    Expense: { screen: ExpenseScreen, options: { title: 'Expense' } },
    Profile: { screen: ProfileScreen, options: { title: 'Profile' } },
  },
});

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Splash',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Splash: {
      screen: SplashScreen,
      options: { headerShown: false },
    },
    MainTabs: {
      screen: Tabs,
      options: { headerShown: false },
    },
    NotesDetail: {
      screen: NoteScreen,
      options: { title: 'Note Details' },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <GestureHandlerRootView style={styles.container}>
        <Provider store={store}>
          <Navigation />
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

export default App;