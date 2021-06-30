import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ScanScreen from '../screens/Scan';
import HistoryScreen from '../screens/History';
import ScanResultScreen from '../screens/ScanResult';
import FieldsScreen from '../screens/Fields';
import IDScreen from '../screens/InputID';
import CreateEventScreen from '../screens/CreateEvent';

const AppStack = createStackNavigator();

const AppStackScreen = ({ navigation }) => (

    < AppStack.Navigator headerMode={'none'} >
        <AppStack.Screen name="ID" component={IDScreen} />
        <AppStack.Screen name="Scan" component={ScanScreen} />
        <AppStack.Screen name="Fields" component={FieldsScreen} />
        <AppStack.Screen name="CreateEvent" component={CreateEventScreen} />
        <AppStack.Screen name="History" component={HistoryScreen} />
        <AppStack.Screen name="ScanResult" component={ScanResultScreen} />
    </AppStack.Navigator >
);

export default AppStackScreen;