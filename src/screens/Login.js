import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    Image,
    ActivityIndicator,
    Alert
} from 'react-native';
import axios from 'axios';
import qs from 'qs';
import { AuthContext } from '../components/context';
import LinearGradient from 'react-native-linear-gradient';
import { BASEURL } from '../utils/Constants';
import { insertNewScanList, deleteAllScanLists } from '../database/realm';


const Login = ({ navigation }) => {

    const [data, setData] = React.useState({
        username: 'waterengineer',
        password: 'admin@123',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });

    const [isLoading, setisLoading] = React.useState(false);
    const { signIn } = React.useContext(AuthContext);

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
        if (val.trim().length >= 8) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidUser = (val) => {
        if (val.trim().length >= 4) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }

    const loginHandle = (userName, password) => {

        if (data.username.length == 0 || data.password.length == 0) {
            Alert.alert('Wrong Input!', 'Username or password field cannot be empty.', [
                { text: 'Okay' }
            ]);
            return;
        }
        setisLoading(true);
        const instance = axios.create({
            baseURL: BASEURL,
            timeout: 40000,
            headers: { 'Content-Type': 'application/json', 'Accept': '*/*' }
        });
        var foundUser;
        instance.post('/users/authenticate', { 'userName': userName, 'password': password })
            .then(function (response) {
                setisLoading(false);
                if (response.status === 200 && response.data != null) {
                    foundUser = response.data;
                    console.log(response.data);

                    deleteAllScanLists().then((response) => {
                        const newScanList = {
                            id: 1,
                            name: 'scans',
                            creationDate: new Date()
                        };
                        insertNewScanList(newScanList).then((response) => {
                            signIn(foundUser);
                        }).catch((error) => {
                            console.log(JSON.stringify(error));
                        });

                    }).catch((error) => {
                        console.log(JSON.stringify(error));
                    });



                } else {
                    setisLoading(false);
                    Alert.alert('Invalid User!', 'Username or password is incorrect.', [
                        { text: 'Okay' }
                    ]);
                    return;
                }
            })
            .catch(error => {
                setisLoading(false);
                Alert.alert("Hi, There seems some error in logging please try again!")
            });
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor='#2bb2e8' barStyle="light-content" />

            <View style={styles.header}>
                <View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                    <Image style={{ width: 160, height: 80, resizeMode: 'contain', alignSelf: 'center', margin: 20 }} source={require("../assets/branding.jpeg")} />
                </View>
                <Text style={styles.text_header}>Welcome to Valve Audit</Text>
            </View>
            <View
                style={[styles.footer, {
                    backgroundColor: "white"
                }]}>
                <Text style={[styles.text_footer, {
                    color: "black"
                }]}>Username</Text>

                <View style={styles.action}>

                    <TextInput
                        placeholder="Your Username"
                        placeholderTextColor="#666666"
                        style={[styles.textInput, {
                            color: "black"
                        }]}
                        value={data.username}
                        autoCapitalize="none"
                        onChangeText={(val) => textInputChange(val)}
                        onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
                    />
                    {data.check_textInputChange ?
                        <View
                            animation="bounceIn"
                        >

                        </View>
                        : null}
                </View>
                {data.isValidUser ? null :
                    <View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Username must be 4 characters long.</Text>
                    </View>
                }


                <Text style={[styles.text_footer, {
                    color: "black",
                    marginTop: 35
                }]}>Password</Text>
                <View style={styles.action}>

                    <TextInput
                        placeholder="Your Password"
                        placeholderTextColor="#666666"
                        value={data.password}
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={[styles.textInput, {
                            color: "black"
                        }]}
                        autoCapitalize="none"
                        onChangeText={(val) => handlePasswordChange(val)}
                    />

                </View>
                {data.isValidPassword ? null :
                    <View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
                    </View>
                }

                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => { loginHandle(data.username, data.password) }}
                    >
                        <LinearGradient
                            colors={['#2bb2e8', '#2bb2e8']}
                            style={styles.signIn}>
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Sign In</Text>
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
        alignSelf: 'center',
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