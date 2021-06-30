import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from './src/components/context';
import AuthRoutes from './src/navigation/AuthRoute';
import AppRoutes from './src/navigation/AppRoute';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';
import { createStackNavigator } from '@react-navigation/stack';


import SignInScreen from './src/screens/Login';
import ScanScreen from './src/screens/Scan';
import HistoryScreen from './src/screens/History';
import FieldsScreen from './src/screens/Fields';
import IDScreen from './src/screens/InputID';
import CreateEventScreen from './src/screens/CreateEvent';

const App = () => {

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userID: null,
    userToken: null,
    engineerID: null
  };


  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          engineerID: action.eid,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userID: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          engineerID: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async (foundUser) => {
      const userToken = String(foundUser.token);
      const userID = String(foundUser.userId);
      const userName = String(foundUser.userName);
      const fullName = foundUser.name;

      try {
        await AsyncStorage.setItem('userToken', userToken);
        await AsyncStorage.setItem('userID', userID);
        await AsyncStorage.setItem('fullName', userID);
        await AsyncStorage.setItem('userName', userName);
      } catch (e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: 'LOGIN', id: userID, token: userToken });
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('engineerId');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: () => {
      // setUserToken('fgkj');
      // setIsLoading(false);
    }
  }), []);

  useEffect(() => {
    SplashScreen.hide();

    setTimeout(async () => {
      // setIsLoading(false);
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        engineerID = await AsyncStorage.getItem('engineerId');
      } catch (e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken, eid: engineerID });
    }, 1000);
  }, []);

  const Stack = createStackNavigator();

  function AppStack() {
    return (

      < Stack.Navigator headerMode={'none'} >
        <Stack.Screen name="ID" component={IDScreen} />
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="Fields" component={FieldsScreen} />
        <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="ScanResult" component={ScanResultScreen} />
      </Stack.Navigator >
    )
  }


  function AuthStack() {
    return (
      <Stack.Navigator headerMode='none'>
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
      </Stack.Navigator>
    )
  }



  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loginState.userToken !== null ? (
          <AppStack />
        )
          :
          <AuthStack />
        }
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;