import React, { Component } from 'react';
import { View, Text, StyleSheet, Linking, LogBox,Dimensions, FlatList, TouchableOpacity, Image, Alert, SafeAreaView, StatusBar, BackHandler } from 'react-native'
import NFCIcon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import QRIcon from 'react-native-vector-icons/FontAwesome';
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { FlingGestureHandler } from 'react-native-gesture-handler';

LogBox.ignoreAllLogs();
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
var boxSize=80;
NFCIcon.loadFont();

const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'Text',
        icon: 'file-text',
        type: 'text'
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'URL',
        icon: 'link',
        type: 'url'
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d721',
        title: 'Email',
        icon: 'envelope',
        type: 'email'
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d722',
        title: 'Phone',
        icon: 'phone',
        type: 'phone'
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d723',
        title: 'SMS',
        icon: 'comment',
        type: 'sms'
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d724',
        title: 'WiFi',
        icon: 'wifi',
        type: 'wifi'
     },
    // {
    //     id: '58694a0f-3da1-471f-bd96-145571e29d725',
    //     title: 'Location',
    //     icon: 'map-marker',
    //     type: 'location'
    // },
    // {
    //     id: '58694a0f-3da1-471f-bd96-145571e29d726',
    //     title: 'Event',
    //     icon: 'calendar',
    //     type: 'event'
    // }, {
    //     id: '58694a0f-3da1-471f-bd96-145571e29d726',
    //     title: 'Bitcoin',
    //     icon: 'bitcoin',
    //     type: 'bitcoin'
    // },
    // {
    //     id: '58694a0f-3da1-471f-bd96-145571e29d727',
    //     title: 'Youtube',
    //     icon: 'youtube'
    // },
    // {
    //     id: '58694a0f-3da1-471f-bd96-145571e29d728',
    //     title: 'Facebook',
    //     icon: 'facebook'
    // },
    // {
    //     id: '58694a0f-3da1-471f-bd96-145571e29d729',
    //     title: 'Twitter',
    //     icon: 'twitter'
    // },
    // {
    //     id: '58694a0f-3da1-471f-bd96-145571e29d7200',
    //     title: 'LinkedIn',
    //     icon: 'linkedin'
    // }
];

class Create extends Component {

    constructor(props) {

        super(props);

        this.state = {
            isEnable: false,
            supported: false,
            boxSize:80
        }

        //console.log("screenWidth = "+screenWidth*0.25);
        //console.log("screenHeight = "+screenHeight);
        boxSize=parseInt(screenWidth*0.24);
        //console.log("boxSize = "+boxSize);
        
    }

    Item = (item) => {
        return <Text>{item.title}</Text>
    };

    handleOpen = () => {

        Linking
            .openURL(this.state.url)
            .catch(err => console.error('An error occured', err));
    };

    openCreator(type, title) {
        this.props.navigation.navigate('Input', { "type": type, "title": title });
    }

    openQR() {
        this.props.navigation.replace("QR");
    }

    openHistory = () => {
        this.props.navigation.navigate('History');
    }

    openInfo = () => {
        this.props.navigation.navigate('Info');
    }

    openURL(url) {
        this.props.navigation.navigate('Webview', { url: url, parent: "Create" });
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


    componentDidMount() {
        //this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        //this.backHandler.remove();
    }


    storeData = async (url, type) => {
        try {
            const value = await AsyncStorage.getItem('@storage_history');

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

            await AsyncStorage.setItem('@storage_history', JSON.stringify(existingData));
        } catch (e) {
            // saving error
        }
    }

    render() {
        return (
            <LinearGradient colors={['#007bff', '#17a2b8', '#20c997']} style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>

                    <StatusBar
                        backgroundColor="#000000"
                        barStyle="light-content"
                    />

                    {/* HEADER */}
                    <View style={{ height: 45, marginTop: 20, width: "100%"}}>

                        <View style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ width: 35, height: 35, marginLeft: 20, resizeMode: "contain" }} source={require("../assets/logo.png")} />
                            <Text style={{ marginLeft: 0, color: 'white', fontSize: 37, fontWeight: 'bold', alignSelf: 'center' }}>R</Text>
                            <Text style={{ fontWeight: '100', color: 'white', fontSize: 36, fontFamily: Platform.OS == "android" ?'Roboto-Thin':'Arial' }}> MONKEY</Text>
                        </View>
                        {/* <TouchableOpacity style={styles.history} onPress={() => this.openHistory()}>
                            <Text style={{ color: "white", textAlign: "center" }}>History</Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity style={{ marginHorizontal: 20, marginTop: -37, alignSelf: 'center', alignSelf: 'flex-start' }} onPress={() => this.openInfo()}>
                            <AntDesign name="menu-fold" size={28} color="white" />
                        </TouchableOpacity>

                    </View>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 40, alignItems: 'center' }}>
                        <FlatList
                            data={DATA}
                            numColumns={3}
                            contentContainerStyle={{ alignItems: 'center' }}
                            renderItem={({ item }) => (

                                <TouchableOpacity
                                    onPress={() => this.openCreator(item.type, item.title)}
                                    style={{
                                        marginHorizontal: 6,
                                        marginVertical: 8,
                                        borderRadius: 5,
                                        width: boxSize,
                                        height: boxSize,
                                        elevation: 5,
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 2,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 1.5,
                                        backgroundColor: '#FFFFFF',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                    <QRIcon color={"#343a40"} name={item.icon} size={24} />
                                    <Text style={{ color: '#343a40', marginTop: 6 }}>{item.title}</Text>
                                </TouchableOpacity>

                            )}
                            keyExtractor={item => item.id}
                        />

                    </View>


                    <View style={styles.footer}>
                        <TouchableOpacity onPress={() => this.openQR()} style={styles.InActiveButton}>
                            <View style={styles.button}>
                                <QRIcon name="qrcode" size={24} color="#ffc107" />
                                <Text style={{ marginStart: 5, color: '#ffc107', fontFamily: Platform.OS == "android" ?'Roboto-Bold':'Arial', fontSize: 18 }}>Scan QR</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ width: 20 }} />

                        <TouchableOpacity style={[styles.ActiveButton,styles.Shadow]}>
                            <View style={styles.button}>
                                <NFCIcon name="create" size={24} color="black" />
                                <Text style={{ marginStart: 5, color: 'black', fontFamily: Platform.OS == "android" ?'Roboto-Bold':'Arial', fontSize: 18 }}>Create QR</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </SafeAreaView>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scanbtn_active: {
        textAlign: 'center',
        backgroundColor: "green",
        width: 250,
        color: '#FFFFFF',
        fontSize: 20,
        padding: 15,
        borderRadius: 10
    },
    scanbtn_inactive: {
        textAlign: 'center',
        backgroundColor: "grey",
        width: 250,
        fontSize: 20,
        color: '#FFFFFF',
        padding: 15,
        borderRadius: 10
    },
    mainview: {
        flex: 1,
        backgroundColor: "#666667",
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
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
    history: {
        borderColor: "white",
        position: 'absolute',
        right: 50,
        width: 65,
        padding: 5,
        borderRadius: 5,
        borderWidth: 2,
    },
    info: {
        position: 'absolute',
        right: 10,
        top: 17
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
    button: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Create;