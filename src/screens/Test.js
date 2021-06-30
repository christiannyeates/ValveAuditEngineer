import React, { Component, useState, useRef } from 'react';
import { View, StyleSheet, LogBox, TouchableOpacity, Text, Platform, Image, StatusBar, SafeAreaView, BackHandler, Alert } from 'react-native';
import QRIcon from 'react-native-vector-icons/FontAwesome';
import FlashIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from "react-native-camera";
import NFCIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Slider from 'react-native-slider';

const scannerRef = useRef(null);

LogBox.ignoreAllLogs();

QRIcon.loadFont();
FlashIcon.loadFont();

const Scan = () => {

    const [flashOn, setflashOn] = useState(false);
    const [camType, setcamType] = useState('back');
    const [zoom, setzoom] = useState(30)

    // useEffect(() => {
    //     backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    // })


    // componentWillUnmount() {
    //     this.setState({ isFlashOn: false });
    //     this.backHandler.remove();
    // }

    // handleBackPress = () => {
    //     Alert.alert(
    //         'My QR',
    //         'Do you want to exit from application?',
    //         [
    //             {
    //                 text: 'No',
    //                 onPress: () => console.log('Cancel Pressed'),
    //                 style: 'cancel',
    //             },
    //             { text: 'Yes', onPress: () => BackHandler.exitApp() },
    //         ],
    //         { cancelable: false },
    //     );

    //     return true;
    // }

    const storeData = async (url, type) => {
        try {
            const value = await AsyncStorage.getItem('@storage_history')

            let existingData = JSON.parse(value);
            if (!existingData) {
                existingData = [];
            }

            var data = {
                "id": new Date().getTime().toString(),
                "url": url,
                "type": type
            };

            existingData.push(data);
            console.log("writing data", JSON.stringify(existingData));
            await AsyncStorage.setItem('@storage_history', JSON.stringify(existingData));
        } catch (e) {
            // saving error
            console.log('Exception writing data');
        }
    }

    const openHistory = () => {

    }


    const onSuccess = (e) => {
        var val = e.data;
        if (val.indexOf("WIFI") == 0) {
            var fields = val.split(";");
            var ssid = fields[1].replace("S:", "SSID: ");
            var pass = fields[2].replace("P:", "Password: ");
            console.log(val);
            Alert.alert(
                'WiFi QR',
                ssid + "\n" + pass,
                [
                    { text: 'Ok', style: "ok", onPress: () => { } },
                ],
                { cancelable: true },
            );

        }

        else if (val.indexOf("http") == 0) {
            console.log("its url");
            storeData(e.data, "QR");
        } else {
            Alert.alert(
                'General QR',
                val,
                [
                    { text: 'Ok', style: "ok", onPress: () => { } },
                ],
                { cancelable: true },
            );
        }

    }

    const toggleFlash = () => {
        setflashOn(!flashOn);
        scannerRef.flashMode = RNCamera.Constants.FlashMode.torch;
    }

    const toggleCamera = () => {
        if (camType === "back")
            setcamType("front");
        else
            setcamType("back");
    }


    return (

        <LinearGradient colors={['#007bff', '#17a2b8', '#20c997']} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>

                <StatusBar
                    backgroundColor="#000000"
                    barStyle="light-content"
                />

                {/* HEADER */}
                <View style={{ height: hp("10%"), width: wp("100%"), justifyContent: 'center', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>

                    <View style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: wp("9%"), height: hp("9%"), marginLeft: wp("2%"), resizeMode: "contain" }} source={require("../assets/logo.png")} />
                        <Text style={{ color: 'white', fontSize: wp("9%"), fontWeight: 'bold', alignSelf: 'center' }}>R</Text>
                        <Text style={{ fontWeight: '100', color: 'white', fontSize: wp("9%"), fontFamily: Platform.OS == "android" ? 'Roboto-Thin' : "Arial" }}> MONKEY</Text>
                    </View>
                    <TouchableOpacity style={{ marginHorizontal: 20 }} onPress={() => openHistory()}>
                        <FlashIcon name="history" size={hp("5%")} color="white" />
                    </TouchableOpacity>


                </View>

                <QRCodeScanner
                    ref={scannerRef}
                    onRead={onSuccess}
                    reactivate={true}
                    showMarker
                    cameraStyle={{ alignSelf: 'center', width: wp("100%"), height: wp("100%"), position: 'absolute' }}
                    markerStyle={{ borderColor: "#ffc107", width: wp("55%"), height: wp("55%") }}
                    reactivateTimeout={1000}
                    vibrate
                    fadeIn
                    cameraType={camType}
                    cameraProps={{
                        ratio: '1:1',
                        zoom: zoom / 100,
                        autoFocus: RNCamera.Constants.AutoFocus.on,
                        flashMode: flashOn ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off
                    }}
                />

                {/* CAMERA FLIP+TORCH */}
                <View style={{ flexDirection: 'row', position: 'absolute', bottom: hp("19%"), justifyContent: 'space-between' }}>
                    <TouchableOpacity style={{ backgroundColor: flashOn ? '#ffc107' : '#00000000', justifyContent: 'center', width: 40, height: 40, borderColor: '#ffc107', borderWidth: 1.5, borderRadius: 20, marginTop: 20, marginHorizontal: 10 }} onPress={() => this.toggleFlash()} >
                        <FlashIcon name={flashOn ? "flashlight-off" : "flashlight"} color={flashOn ? 'black' : "white"} size={24} style={{ alignSelf: 'center' }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ backgroundColor: camType == "back" ? '#00000000' : '#ffc107', width: 40, height: 40, justifyContent: 'center', borderColor: '#ffc107', borderWidth: 1.5, borderRadius: 20, marginTop: 20, marginHorizontal: 10 }} onPress={() => this.toggleCamera()} >
                        <NFCIcon name={'flip-camera-ios'} color={camType == "back" ? 'white' : "black"} size={24} style={{ alignSelf: 'center' }} />
                    </TouchableOpacity>

                </View>

                {/* TORCH + SLIDER */}
                <View style={{ position: 'absolute', bottom: hp("12.5%") }}>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <NFCIcon name="zoom-out" color={"white"} size={24} style={{ marginHorizontal: 5 }} />
                        <Slider
                            onValueChange={(value) => { setzoom(value) }}
                            style={{ width: 300 }}
                            minimumValue={0}
                            vertical
                            step={2}
                            maximumValue={100}
                            value={zoom}
                            minimumTrackTintColor="#ffc107"
                            maximumTrackTintColor="#FFFFFF"

                            thumbTintColor={'#ffc107'}
                        />
                        <NFCIcon name="zoom-in" color={"white"} size={24} style={{ marginHorizontal: 5 }} />
                    </View>
                </View>

            </SafeAreaView>
        </LinearGradient>

    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#CCCCCC',
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
    },
    history: {
        borderColor: "white",
        position: 'absolute',
        right: 50,
        width: 65,
        padding: 5,
        borderRadius: 5,
        borderWidth: 2,
    }, footer: {
        position: 'absolute',
        bottom: hp("3.3%"),
        // backgroundColor: "#212121",
        width: '100%',
        paddingBottom: 15,
        paddingTop: 15,
        justifyContent: 'center',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        flexDirection: 'row'
    },
    ActiveButton: {
        borderRadius: 30,
        height: 44,
        justifyContent: 'center',
        backgroundColor: "#ffc107",
        color: "#000000",
        width: '42%'
    },
    InActiveButton: {
        borderRadius: 30,
        height: 44,
        justifyContent: 'center',
        borderColor: '#ffc107',
        borderWidth: 1.5,
        backgroundColor: "#00000000",
        color: "#ffc107",
        width: '42%'
    },
    button: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 15,
        padding: 10
    },
    Shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    tv: {
        color: 'white',
        paddingStart: 5
    }
});

//make this component available to the app
export default Scan;
