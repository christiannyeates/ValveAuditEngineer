import AsyncStorage from '@react-native-community/async-storage'

export const CUSTOMER_ID = 'cid'
export const CUSTOMER_PHONE_NUMBER = 'phone'
export const CUSTOMER_FULL_NAME = 'full_name'
export const CUSTOMER_LOGIN_TYPE = 'login_type'
export const USER_TYPE = 'user_type'
export const ALREADY_LOGIN = 'already_login'
export const FCM_TOKEN = 'fcm_token'
export const FAV_COURSES = 'fav_courses'

export const storeItem = async ( key , value) => {
    console.log("store: key: ", key)
    console.log("store: value: ", value)
    try {
        await AsyncStorage.setItem(key, value)
        console.log("store item Success"+value);
    } catch (error) {
        console.error("store item: ", error)
        return error
    }
}


export const getItem =  async (key) => {
    try {
        const value =  await AsyncStorage.getItem(key)
        console.log("getItem: Success", value)
        return value
    } catch (error) {
        console.error("get item: ", error)
        return error
    }
}

