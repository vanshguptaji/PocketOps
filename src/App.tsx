import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import ExpenseScreen from './screens/ExpenseScreen';
import HabitScreen from './screens/HabitScreen';
import NoteScreen from './screens/NoteScreen';
import ProfileScreen from './screens/ProfileScreen';
import TaskScreen from './screens/TaskScreen';
import TabBar from './components/Nvigation';
import { createStaticNavigation } from '@react-navigation/native';
import { Provider } from "react-redux";
import { store } from './redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Tabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
  },
  tabBar: (props) => <TabBar {...props} />,
  screens: {
    Home: { screen: HomeScreen, options: { title: 'Home' } },
    Habit: { screen: HabitScreen, options: { title: 'Habit' } },
    Tasks: { screen: TaskScreen, options: { title: 'Tasks' } },
    Profile: { screen: ProfileScreen, options: { title: 'Profile' } },
    Expense: { screen: ExpenseScreen, options: { title: 'Expense' } },
  }
});

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    MainTabs: {
      screen: Tabs,
      options: { headerShown: false },
    },
    Notes: {
      screen: NoteScreen,
      options: { title: 'Notes' },
    },
  }
});

const Navigation = createStaticNavigation(RootStack);

function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <Provider store={store}>
          <Navigation />
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default App;