import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {  SafeAreaProvider} from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import ExpenseScreen from './screens/ExpenseScreen';
import HabitScreen from './screens/HabitScreen';
import NoteScreen from './screens/NoteScreen';
import ProfileScreen from './screens/ProfileScreen';
import TaskScreen from './screens/TaskScreen';
import { createStaticNavigation } from '@react-navigation/native';
import { Provider } from "react-redux";
import { store } from './redux/store';

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
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

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <Navigation />
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
