import React, { Component, useState, useRef, useEffect } from 'react';
import { View, StyleSheet, LogBox, TouchableOpacity, Text, Platform, Image, StatusBar, SafeAreaView, BackHandler, Alert } from 'react-native';
import QRIcon from 'react-native-vector-icons/FontAwesome';
import FlashIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from "react-native-camera";
import NFCIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Slider from 'react-native-slider';
import { AuthContext } from '../components/context';
import { insertScan } from '../database/realm';


LogBox.ignoreAllLogs();
NFCIcon.loadFont();
QRIcon.loadFont();
FlashIcon.loadFont();


// create a component
const Scan = ({ navigation }) => {

    const scannerRef = useRef(null);
    const [flashOn, setflashOn] = useState(false);
    const [camType, setcamType] = useState('back');
    const [zoom, setzoom] = useState(0)

    const { signOut } = React.useContext(AuthContext);

    useEffect(() => {
        navigation.navigate('Fields', { 'qrId': 880097 });
    }, [7])

    const storeData = async (val) => {
        const newScan = {
            id: Math.floor(Date.now() / 1000),
            payload: val,
            time: Math.floor(Date.now() / 1000),
            comments: "Testng.."
        };
        insertScan(1, newScan).then(insertedScan => {
            //Alert.alert('added successfully');
        }).catch((error) => {
            Alert.alert(JSON.stringify(error));
        });
    }

    const openHistory = () => {
        navigation.navigate('History');
    }

    const onSuccess = (e) => {
        var val = e.data;
        storeData(val);

        navigation.navigate('Fields', { 'qrId': val });
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
        <LinearGradient colors={['#2bb2e8', '#2bb2e8', '#2bb2e8']} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
                <StatusBar backgroundColor="#000000" barStyle="light-content" />

                {/* HEADER */}
                <View style={{ height: "10%", width: "100%", justifyContent: 'center', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: "9%", height: "9%", marginLeft: "2%", resizeMode: "contain" }} source={require("../assets/logo.png")} />
                        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', alignSelf: 'center' }}>Scan Valve</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => openHistory()}>
                            <FlashIcon name="history" size={30} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => signOut()}>
                            <FlashIcon name="logout" size={30} color="white" />
                        </TouchableOpacity>
                    </View>

                </View>

                {/* BODY */}
                <QRCodeScanner
                    ref={scannerRef}
                    onRead={onSuccess}
                    reactivate={true}
                    showMarker
                    cameraStyle={{ alignSelf: 'center', width: "100%", height: "100%", position: 'absolute' }}
                    markerStyle={{ borderColor: "#ffc107", width: 300, height: 300 }}
                    reactivateTimeout={3000}
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
                <View style={{ flexDirection: 'row', position: 'absolute', bottom: "13%", justifyContent: 'space-between' }}>

                    <TouchableOpacity style={{ backgroundColor: flashOn ? '#ffc107' : '#00000000', justifyContent: 'center', width: 40, height: 40, borderColor: '#ffc107', borderWidth: 1.5, borderRadius: 20, marginTop: 20, marginHorizontal: 10 }} onPress={() => toggleFlash()} >
                        <FlashIcon name={flashOn ? "flashlight-off" : "flashlight"} color={flashOn ? 'black' : "white"} size={24} style={{ alignSelf: 'center' }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ backgroundColor: camType == "back" ? '#00000000' : '#ffc107', width: 40, height: 40, justifyContent: 'center', borderColor: '#ffc107', borderWidth: 1.5, borderRadius: 20, marginTop: 20, marginHorizontal: 10 }} onPress={() => toggleCamera()} >
                        <NFCIcon name={'flip-camera-ios'} color={camType == "back" ? 'white' : "black"} size={24} style={{ alignSelf: 'center' }} />
                    </TouchableOpacity>

                </View>

                {/* TORCH + SLIDER */}
                <View style={{ position: 'absolute', bottom: "5%" }}>

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
        bottom: "3.3%",
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