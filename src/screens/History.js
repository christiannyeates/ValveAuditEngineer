//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, SafeAreaView, Image } from 'react-native';
import { queryAllScanLists } from '../database/realm';
import QRIcon from 'react-native-vector-icons/FontAwesome';
// create a component

//QRIcon.loadFont();
const Item = ({ title }) => (
    <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
    </View>
);

const MyComponent = ({ navigation }) => {

    const [data, setdata] = useState([]);
    const renderItem = ({ item }) => (
        <Item title={item.payload} />
    );

    useEffect(() => {

        queryAllScanLists().then((todoLists) => {
            setdata(todoLists);
        }).catch((error) => {
            setdata([]);
        });

    }, [1]);

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={{ backgroundColor: '#2bb2e8', height: "10%", width: "100%", justifyContent: 'center', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>

                <View style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center', marginHorizontal: 30 }}>
                    <QRIcon style={{ marginEnd: 20 }} name="arrow-left" size={24} color={"white"} onPress={() => { navigation.goBack() }} />
                    <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', alignSelf: 'center' }}>Scan History</Text>
                </View>

            </View>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />

            {
                data.length == 0 && (
                    <Text style={{ alignSelf: 'center' }}>No Data Available</Text>
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
        backgroundColor: '#CCCCCC',
        borderRadius: 10,
        padding: 12,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 18,
    },
});

//make this component available to the app
export default MyComponent;
