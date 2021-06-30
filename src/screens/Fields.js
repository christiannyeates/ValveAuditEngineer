//import liraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import QRIcon from 'react-native-vector-icons/FontAwesome';
import { BASEURL } from '../utils/Constants';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from '../components/context';


const Item = ({ id, title, val, allowedEdit }) => {
    return (
        <View style={styles.item}>
            <Text style={styles.title}>{title}</Text>
            <TextInput
                editable={allowedEdit && editable}
                style={[
                    styles.input,
                    {
                        borderColor: allowedEdit && editable ? '#2bb2e8' : "#cccccc",
                        backgroundColor: allowedEdit && editable ? '#FFFFFF' : "#cccccc",
                    }]}
                value={val}
                onChangeText={(value) => onChange(id, value)}
            />
        </View>
    )
}

const Fields = (props) => {

    const { signOut } = React.useContext(AuthContext);
    const [isLoading, setisLoading] = useState(false);
    const [editable, seteditable] = useState(false);
    const [data, setdata] = useState(null);

    const [id, setid] = useState("");
    const [valveId, setvalveId] = useState("");
    const [qrid, setqrid] = useState("");
    const [dmaName, setdmaName] = useState("");
    const [latitude, setlatitude] = useState("");
    const [longitude, setlongitude] = useState("");
    const [direction, setdirection] = useState("");
    const [valveSize, setvalveSize] = useState("");
    const [assetId, setassetId] = useState("");
    const [bvId, setbvId] = useState("");
    const [comment, setcomment] = useState("");
    const [bvcontrolNumber, setbvcontrolNumber] = useState("");
    const [events, setevents] = useState([]);

    React.useEffect(() => {
        getFieldsforQR(props.route.params.qrId);
    }, [5]);

    const onDMANameChange = (value) => {
        setdmaName(value);
    }

    const onCommentChange = (value) => {
        setcomment(value);
    }

    const onDirectionChange = (value) => {
        setdirection(value);
    }

    const onValveSizeChange = (value) => {
        setvalveSize(value);
    }



    const onChange = (key, value) => {
        if (key === "valveId")
            setvalveId(value);
        else if (key === "qrid")
            setqrid(value);
        else if (key === "dmaName")
            setdmaName(value);
        else if (key === "latitude")
            setlatitude(value);
        else if (key === "longitude")
            setlongitude(value);
        else if (key === "assetId")
            setassetId(value);
        else if (key === "bvId")
            setbvId(value);
        else if (key === "comment")
            setcomment(value);
        else if (key === "bvcontrolNumber")
            setbvcontrolNumber(value);
        else if (key === "valveSize")
            setvalveSize(value);
        else if (key === "direction")
            setdirection(value);

    }


    const getFieldsforQR = async (qrID) => {
        var token = await AsyncStorage.getItem('userToken');
        setisLoading(true);
        const instance = axios.create({
            baseURL: BASEURL,
            timeout: 40000,
            headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'Authorization': 'Bearer ' + token }
        });

        instance.get('/Valve/' + qrID).then(function (response) {
            setdata(response.data.valveDetail);

            setid(response.data.valveDetail.id);
            setvalveId(response.data.valveDetail.valveId);
            setqrid(response.data.valveDetail.qrid);
            setdmaName(response.data.valveDetail.dmaName);
            setlatitude(response.data.valveDetail.latitude);
            setlongitude(response.data.valveDetail.longitude);
            setvalveSize(response.data.valveDetail.valveSize);
            setdirection(response.data.valveDetail.direction);
            setassetId(response.data.valveDetail.assetId);
            setbvId(response.data.valveDetail.bvId);
            setcomment(response.data.valveDetail.comment);
            setbvcontrolNumber(response.data.valveDetail.bvcontrolNumber);

            setisLoading(false);
        }).catch(function (error) {
            console.log("ERROR : " + error.response.status);
            setisLoading(false);
            if (error.response.status === 401) {
                signOut();
            }



        });
    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const editHandle = async () => {
        seteditable(!editable);
    }

    const submitHandle = async () => {


        var params = {
            id: data.id,
            qrid: data.qrid,
            dmaName: dmaName,
            valveSize: valveSize,
            direction: direction,
            comment: comment,
            latitude: data.latitude,
            longitude: data, longitude,
            //assetId: data.assetId,
            //bvId: data.bvId,
            //bvcontrolNumber: data.bvcontrolNumber,
            //events: data.events
        }
        props.navigation.navigate("CreateEvent", { "params": params, "qrid": data.qrid });
    }

    return (

        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={{ backgroundColor: '#2bb2e8', height: "10%", width: "100%", justifyContent: 'center', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>

                <View style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center', marginHorizontal: 30 }}>
                    <QRIcon style={{ marginEnd: 20 }} name="arrow-left" size={24} color={"white"} onPress={() => { props.navigation.goBack() }} />
                    <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', alignSelf: 'center' }}>Valve Details</Text>
                </View>

                <TouchableOpacity style={{ marginHorizontal: 20 }} onPress={() => { editHandle() }}>
                    <QRIcon name={editable ? "check" : "edit"} color={'white'} size={30} />
                </TouchableOpacity>

            </View>

            {
                data != null && (
                    <ScrollView style={{ marginBottom: 40, backgroundColor: 'white' }}>
                        <Item id={"valveId"} title={capitalizeFirstLetter("Valve ID")} val={id} allowedEdit={false} />
                        <Item id={"qrid"} title={capitalizeFirstLetter("QR ID")} val={qrid} allowedEdit={false} />

                        <View style={styles.item}>
                            <Text style={styles.title}>DMA Name</Text>
                            <TextInput
                                editable={editable}
                                style={[
                                    styles.input,
                                    {
                                        borderColor: editable ? '#2bb2e8' : "#cccccc",
                                        backgroundColor: editable ? '#FFFFFF' : "#cccccc",
                                    }]}
                                value={dmaName}
                                onChangeText={(value) => onDMANameChange(value)}
                            />
                        </View>

                        <View style={styles.item}>
                            <Text style={styles.title}>Direction</Text>
                            <TextInput
                                editable={editable}
                                style={[
                                    styles.input,
                                    {
                                        borderColor: editable ? '#2bb2e8' : "#cccccc",
                                        backgroundColor: editable ? '#FFFFFF' : "#cccccc",
                                    }]}
                                value={direction}
                                onChangeText={(value) => onDirectionChange(value)}
                            />
                        </View>

                        <View style={styles.item}>
                            <Text style={styles.title}>Valve Size</Text>
                            <TextInput
                                editable={editable}
                                style={[
                                    styles.input,
                                    {
                                        borderColor: editable ? '#2bb2e8' : "#cccccc",
                                        backgroundColor: editable ? '#FFFFFF' : "#cccccc",
                                    }]}
                                value={valveSize}
                                onChangeText={(value) => onValveSizeChange(value)}
                            />
                        </View>

                        <View style={styles.item}>
                            <Text style={styles.title}>Comment</Text>
                            <TextInput
                                editable={editable}
                                style={[
                                    styles.input,
                                    {
                                        borderColor: editable ? '#2bb2e8' : "#cccccc",
                                        backgroundColor: editable ? '#FFFFFF' : "#cccccc",
                                    }]}
                                value={comment}
                                onChangeText={(value) => onCommentChange(value)}
                            />
                        </View>

                        {/* <Item id={"dmaName"} title={capitalizeFirstLetter("DMA Name")} val={dmaName} allowedEdit={true} />
                        <Item id={"valveSize"} title={capitalizeFirstLetter("Valve Size")} val={valveSize} allowedEdit={true} />
                        <Item id={"direction"} title={capitalizeFirstLetter("Direction")} val={direction} allowedEdit={true} />
                        <Item id={"comment"} title={capitalizeFirstLetter("Comment")} val={comment} allowedEdit={true} /> */}
                        <Item id={"latitude"} title={capitalizeFirstLetter("Latitude")} val={latitude} allowedEdit={false} />
                        <Item id={"longitude"} title={capitalizeFirstLetter("Longitude")} val={longitude} allowedEdit={false} />
                        <Item id={"assetId"} title={capitalizeFirstLetter("Asset ID")} val={assetId} allowedEdit={false} />
                        <Item id={"bvId"} title={capitalizeFirstLetter("BV ID")} val={bvId} allowedEdit={false} />
                        <Item id={"bvcontrolNumber"} title={capitalizeFirstLetter("BV Control Number")} val={bvcontrolNumber} allowedEdit={false} />
                        {/* <Item ref={events} title={"events"} value={events} /> */}
                    </ScrollView>
                )
            }

            {
                data != null && (

                    <TouchableOpacity
                        disabled={editable}
                        style={styles.signIn}
                        onPress={() => { submitHandle() }}>
                        <View
                            style={[styles.signIn, { backgroundColor: editable ? '#CCCCCC' : '#2bb2e8' }]}>
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Next</Text>
                        </View>
                    </TouchableOpacity>
                )
            }

            {
                isLoading && (
                    <ActivityIndicator style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} size="large" color="#2bb2e8" />
                )
            }

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    item: {
        borderRadius: 8,
        padding: 5,
        fontSize: 12,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 18,
        marginVertical: 5,
        fontWeight: '500'
    },
    input: {
        width: '100%',
        borderRadius: 7,
        padding: 10,
        color: '#000000',
        borderWidth: 1,
        borderColor: "#CCCCCC"
    },
    signIn: {
        width: '90%',
        alignSelf: 'center',
        height: 50,
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});

//make this component available to the app
export default Fields;
