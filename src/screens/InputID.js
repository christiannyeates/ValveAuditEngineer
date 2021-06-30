import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    Image,
    SafeAreaView,
    Alert
} from 'react-native';
import { AuthContext } from '../components/context';
import LinearGradient from 'react-native-linear-gradient';
import { BASEURL } from '../utils/Constants';
import { insertNewScanList, deleteAllScanLists } from '../database/realm';
import AsyncStorage from '@react-native-community/async-storage';
import { Root, Popup } from 'popup-ui';


const IDScreen = ({ navigation }) => {

    useEffect(() => {
        checkEngineerID();
    }, [])

    const [ID, setID] = useState('');

    const textInputChange = (val) => {
        setID(val);
    }

    const checkEngineerID = async () => {

        const ID = await AsyncStorage.getItem('engineerId');
        if (ID != undefined && ID != "") {
            navigation.replace("Scan");
        }
    }

    const handleSaveID = async () => {
        if (ID === "") {
            Popup.show({
                type: 'Warning',
                title: 'Error',
                button: true,
                textBody: 'Engineer ID is required !!',
                buttonText: 'Ok',
                callback: () => {
                    Popup.hide();
                }
            });
        } else {
            await AsyncStorage.setItem('engineerId', ID);
            navigation.replace("Scan");
        }

    }

    return (
        <Root>
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor='#2bb2e8' barStyle="light-content" />
                <View style={styles.header}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        <Image style={{ width: 160, height: 80, resizeMode: 'contain', alignSelf: 'center', margin: 20 }} source={require("../assets/branding.jpeg")} />
                    </View>
                    <Text style={styles.text_header}>Enter Engineer ID</Text>
                </View>
                <View
                    style={[styles.footer, {
                        backgroundColor: "white"
                    }]}>
                    <Text style={[styles.text_footer, {
                        color: "black"
                    }]}>Engineer ID</Text>

                    <View style={styles.action}>

                        <TextInput
                            placeholder="Your ID"
                            placeholderTextColor="#666666"
                            style={[styles.textInput, {
                                color: "black"
                            }]}
                            value={ID}
                            autoCapitalize="none"
                            onChangeText={(val) => textInputChange(val)}
                        />
                    </View>

                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.signIn}
                            onPress={() => { handleSaveID() }}>
                            <LinearGradient
                                colors={['#2bb2e8', '#2bb2e8']}
                                style={styles.signIn}>
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>Next</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                </View>

            </SafeAreaView>
        </Root>
    );
};

export default IDScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2bb2e8'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 40
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 8 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});