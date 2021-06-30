import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/Login';

const AuthStack = createStackNavigator();

const AuthStackScreen = ({ navigation }) => (
    <AuthStack.Navigator headerMode='none'>
        <AuthStack.Screen name="SignInScreen" component={SignInScreen} />

    </AuthStack.Navigator>
);

export default AuthStackScreen;