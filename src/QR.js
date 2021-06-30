//import liraries
import React, { Component } from 'react';
import { View, StyleSheet, LogBox, TouchableOpacity, Text, Platform, Image, StatusBar, SafeAreaView, BackHandler, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import QRIcon from 'react-native-vector-icons/FontAwesome';
import FlashIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from "react-native-camera";
import AntDesign from 'react-native-vector-icons/AntDesign';
import NFCIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Slider from 'react-native-slider';

LogBox.ignoreAllLogs();

QRIcon.loadFont();
FlashIcon.loadFont();
// create a component

class QR extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isFlashOn: false,
            cameraType: 'back',
            cameraSize: 30
        }

        this.toggleFlash = this.toggleFlash.bind(this);
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        this.setState({ isFlashOn: false });
        this.backHandler.remove();
    }

    handleBackPress = () => {
        Alert.alert(
            'My QR',
            'Do you want to exit from application?',
            [

                {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Yes', onPress: () => BackHandler.exitApp() },
            ],
            { cancelable: false },
        );

        return true;
    }

    storeData = async (url, type) => {
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

    openNFC() {
        this.props.navigation.replace("Create");
    }

    openHistory = () => {
        this.props.navigation.navigate('History');
    }

    openInfo = () => {
        this.props.navigation.navigate('Info');
    }

    openURL(url) {
        this.props.navigation.navigate('Webview', { url: url, parent: "QR" });
    }

    onSuccess = (e) => {
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
            this.storeData(e.data, "QR");
            this.openURL(e.data);
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

    toggleFlash() {
        this.setState({ isFlashOn: !this.state.isFlashOn });
        this.scanner.flashMode = RNCamera.Constants.FlashMode.torch;
    }

    toggleCamera() {
        if (this.state.cameraType === "back")
            this.setState({ cameraType: 'front' });
        else
            this.setState({ cameraType: 'back' });
    }

    render() {
        return (

            <LinearGradient colors={['#007bff', '#17a2b8', '#20c997']} style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>

                    <StatusBar
                        backgroundColor="#000000"
                        barStyle="light-content"
                    />

                    {/* HEADER */}
                    <View style={{height: hp("10%"), width: wp("100%"), justifyContent: 'center', justifyContent: 'space-between', flexDirection: 'row' ,alignItems:'center'}}>

                        <TouchableOpacity style={{ marginHorizontal: 20 }} onPress={() => this.openInfo()}>
                            <AntDesign name="menu-fold" size={hp("5%")} color="white" />
                        </TouchableOpacity>

                        <View style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ width: wp("9%"), height: hp("9%"), marginLeft: wp("2%"), resizeMode: "contain" }} source={require("../assets/logo.png")} />
                            <Text style={{  color: 'white', fontSize: wp("9%"), fontWeight: 'bold', alignSelf: 'center' }}>R</Text>
                            <Text style={{ fontWeight: '100', color: 'white', fontSize: wp("9%"), fontFamily: Platform.OS == "android" ? 'Roboto-Thin' : "Arial" }}> MONKEY</Text>
                        </View>
                        <TouchableOpacity style={{ marginHorizontal: 20}} onPress={() => this.openHistory()}>
                            <FlashIcon name="history" size={hp("5%")} color="white" />
                        </TouchableOpacity>


                    </View>

                    <QRCodeScanner
                        ref={(node) => { this.scanner = node }}
                        onRead={this.onSuccess}
                        reactivate={true}
                        showMarker
                        cameraStyle={{ alignSelf: 'center',width:wp("100%"), height: wp("100%") ,position:'absolute'}}
                        markerStyle={{ borderColor: "#ffc107", width: wp("55%"), height: wp("55%") }}
                        reactivateTimeout={1000}
                        vibrate
                        fadeIn
                        cameraType={this.state.cameraType}
                        cameraProps={{
                            ratio: '1:1',
                            zoom: this.state.cameraSize / 100,
                            autoFocus: RNCamera.Constants.AutoFocus.on,
                            flashMode: this.state.isFlashOn ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off
                        }}
                    />

                    {/* CAMERA FLIP+TORCH */}
                    <View style={{ flexDirection: 'row', position: 'absolute', bottom: hp("19%"), justifyContent: 'space-between' }}>
                        <TouchableOpacity style={{ backgroundColor: this.state.isFlashOn ? '#ffc107' : '#00000000', justifyContent: 'center', width: 40, height: 40, borderColor: '#ffc107', borderWidth: 1.5, borderRadius: 20, marginTop: 20, marginHorizontal: 10 }} onPress={() => this.toggleFlash()} >
                            <FlashIcon name={this.state.isFlashOn ? "flashlight-off" : "flashlight"} color={this.state.isFlashOn ? 'black' : "white"} size={24} style={{ alignSelf: 'center' }} />
                        </TouchableOpacity>

                        <TouchableOpacity style={{ backgroundColor: this.state.cameraType == "back" ? '#00000000' : '#ffc107', width: 40, height: 40, justifyContent: 'center', borderColor: '#ffc107', borderWidth: 1.5, borderRadius: 20, marginTop: 20, marginHorizontal: 10 }} onPress={() => this.toggleCamera()} >
                            <NFCIcon name={'flip-camera-ios'} color={this.state.cameraType == "back" ? 'white' : "black"} size={24} style={{ alignSelf: 'center' }} />
                        </TouchableOpacity>

                    </View>

                    {/* TORCH + SLIDER */}
                    <View style={{ position: 'absolute', bottom: hp("12.5%") }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <NFCIcon name="zoom-out" color={"white"} size={24} style={{ marginHorizontal: 5 }} />
                            <Slider
                                onValueChange={(value) => { this.setState({ cameraSize: value }) }}
                                style={{ width: 300 }}
                                minimumValue={0}
                                vertical
                                step={2}
                                maximumValue={100}
                                value={this.state.cameraSize}
                                minimumTrackTintColor="#ffc107"
                                maximumTrackTintColor="#FFFFFF"

                                thumbTintColor={'#ffc107'}
                            />
                            <NFCIcon name="zoom-in" color={"white"} size={24} style={{ marginHorizontal: 5 }} />
                        </View>
                    </View>


                    {/* FOOTER */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={[styles.ActiveButton,styles.Shadow]}>
                            <View style={styles.button}>
                                <QRIcon name="qrcode" size={24} color="black" />
                                <Text style={{ marginStart: 5, color: 'black', fontSize: 18, fontFamily: Platform.OS == "android" ? 'Roboto-Bold' : 'Arial' }}>Scan QR</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ width: 20 }} />

                        <TouchableOpacity onPress={() => this.openNFC()} style={[styles.InActiveButton]}>
                            <View style={styles.button}>
                                <NFCIcon name="create" size={24} color="#ffc107" />
                                <Text style={{ marginStart: 5, color: '#ffc107', fontFamily: Platform.OS == "android" ? 'Roboto-Bold' : 'Arial', fontSize: 18 }}>Create QR</Text>
                            </View>
                        </TouchableOpacity>


                    </View>
                </SafeAreaView>
            </LinearGradient>

        );

    }
}

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
export default QR;
