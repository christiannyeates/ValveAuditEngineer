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
    Keyboard,
    ActivityIndicator,
    KeyboardAvoidingView,
    Alert
} from 'react-native';
import axios from 'axios';
import qs from 'qs';
import { AuthContext } from '../components/context';
import LinearGradient from 'react-native-linear-gradient';
import { BASEURL } from '../utils/Constants';
import { Dropdown } from 'react-native-material-dropdown-v2-fixed';
import AsyncStorage from '@react-native-community/async-storage';
import { Root, Popup } from 'popup-ui';
import GetLocation from 'react-native-get-location'
import { DismissKeyboardView } from '../utils/DissmissView'


const Login = (props) => {

    const [data, setData] = React.useState({
        username: 'waterengineer',
        password: 'admin@123',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });

    const [lat, setlat] = useState('')
    const [lng, setlng] = useState('')

    useEffect(() => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
            .then(location => {
                setlat(location.latitude);
                setlng(location.longitude);
                console.log("Location" + JSON.stringify(location));
            })
            .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
            })

    }, [1])

    let eventTypes = [{
        value: 'Audit',
    }, {
        value: 'Reactive',
    }, {
        value: 'Planned',
    }, {
        value: 'Scheduled',
    }, {
        value: 'Test',
    }];

    const [isLoading, setisLoading] = React.useState(false);
    const [eventType, seteventType] = useState('Audit')
    const [description, setdescription] = useState('')

    const textInputChange = (val) => {
        if (val.trim().length >= 4) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        setdescription(val);
    }

    const submitFields = async () => {
        Keyboard.dismiss();
        if (description === "") {
            Popup.show({
                type: 'Warning',
                title: 'Error',
                button: true,
                textBody: 'Please enter the description.',
                buttonText: 'Done',
                callback: () => {
                    Popup.hide();
                }
            });

            return;
        }

        var token = await AsyncStorage.getItem('userToken');
        setisLoading(true);

        const instance = axios.create({
            baseURL: BASEURL,
            timeout: 40000,
            headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'Authorization': 'Bearer ' + token }
        });

        const params = props.route.params.params;
        params.latitude = String(lat);
        params.longitude = String(lng);
        const qrid = props.route.params.params.qrid;

        console.log("Submit Fields CALL", params);

        instance.put(BASEURL + '/Valve/' + qrid, params).then(function (response) {

            const valve_id = response.data.item.id;
            setisLoading(false);
            console.log("Succeffully submitted fields !!");
            saveEvent(qrid, valve_id, token);
        }).catch(function (error) {
            console.log("ERROR : " + JSON.stringify(error));
            setisLoading(false);
        });


    }

    const saveEvent = async (qr_id, valve_id, token) => {

        var engineerId = await AsyncStorage.getItem('engineerId');

        setisLoading(true);

        const instance = axios.create({
            baseURL: BASEURL,
            timeout: 40000,
            headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'Authorization': 'Bearer ' + token }
        });

        let event_type = 0;
        switch (eventType) {
            case "Audit":
                event_type = 1;
                break;
            case "Reactive":
                event_type = 2;
                break;
            case "Planned":
                event_type = 3;
                break;
            case "Scheduled":
                event_type = 4;
                break;
            case "Test":
                event_type = 5;
                break;
        }

        const params = {
            "eventType": event_type,
            "eventDescription": description,
            "qrId": qr_id,
            "valveId": valve_id,
            "engineerId": engineerId
        }
        console.log("Events Fields CALL", params);

        instance.post(BASEURL + '/ValveEvent', params).then(function (response) {

            setisLoading(false);
            console.log("Succeffully submitted event !!");
            proceedNext();
        }).catch(function (error) {
            console.log("ERROR : " + JSON.stringify(error));
            setisLoading(false);
        });
    }

    const proceedNext = () => {

        Popup.show({
            type: 'Success',
            title: 'Success',
            button: true,
            textBody: 'Event saved successfully',
            buttonText: 'Done',
            callback: () => {
                Popup.hide();
                props.navigation.navigate("Scan");
            }
        });

    }

    return (
        <Root>
            <DismissKeyboardView style={{ flex: 1 }}>
                <SafeAreaView style={styles.container}>
                    <StatusBar backgroundColor='#009387' barStyle="light-content" />
                    <View style={styles.header} onPress={() => Keyboard.dismiss()}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                            <Image style={{ width: 160, height: 80, resizeMode: 'contain', alignSelf: 'center', margin: 20 }} source={require("../assets/branding.jpeg")} />
                        </View>
                        <Text style={styles.text_header}>Add an Event</Text>
                    </View>
                    <View
                        style={[styles.footer, {
                            backgroundColor: "white"
                        }]}>
                        <Text style={[styles.text_footer, {
                            color: "black"
                        }]}>Type of Event</Text>

                        <View style={[styles.action, { borderBottomWidth: 0 }]}>

                            <Dropdown
                                value={eventType}
                                containerStyle={{ width: '100%', marginTop: -15 }}
                                data={eventTypes}
                                onChangeText={(value) => { seteventType(value) }}
                            />
                        </View>


                        <Text style={[styles.text_footer, {
                            color: "black",
                            marginTop: 35
                        }]}>Description</Text>
                        <View style={styles.action}>

                            <TextInput
                                placeholder="Enter Description"
                                placeholderTextColor="#666666"
                                multiline
                                value={description}
                                style={[styles.textInput, {
                                    color: "black",
                                    height: 50,
                                    textAlignVertical: 'bottom'
                                }]}
                                autoCapitalize="none"
                                onChangeText={(val) => handlePasswordChange(val)}
                            />

                        </View>

                        <View style={styles.button}>
                            <TouchableOpacity
                                style={styles.signIn}
                                onPress={() => { submitFields() }}>

                                <LinearGradient
                                    colors={['#2bb2e8', '#2bb2e8']}
                                    style={styles.signIn}>
                                    <Text style={[styles.textSign, {
                                        color: '#fff'
                                    }]}>Save</Text>
                                </LinearGradient>

                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        isLoading && (
                            <ActivityIndicator style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} size="large" color="#2bb2e8" />
                        )
                    }

                </SafeAreaView>
            </DismissKeyboardView>
        </Root>
    );
};

export default Login;

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
        marginTop: Platform.OS === 'ios' ? 0 : -12,
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