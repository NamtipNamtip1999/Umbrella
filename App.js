import "react-native-gesture-handler";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Main from "./Screen/Main";
import LoginScreen from "./Screen/LoginScreen";
import Register from "./Screen/Register";
import Borrow from "./Screen/Borrow";
import Menu from "./Screen/Menu";
import Registered from "./Screen/Registered";
import GotUmbrella from "./Screen/GotUmbrella";
import Edituser from "./Screen/Edituser";
import * as SecureStore from "expo-secure-store";
import UploadImage from "./Screen/UploadImage";
// import AuthContext from './Screen/Context'
import axios from "axios";
import ChangePassword from "./Screen/ChangePassword";
import BorrowHistoryMain from "./Screen/BorrowHistoryMain";
import BorrowScreen from "./Screen/BorrowScreen";
import BorrowSelect from "./Screen/BorrowSelect";
import WaitToBorrow from "./Screen/WaitToBorrow";
import GetSelect from "./Screen/GetSelect ";
import DepositSelect from "./Screen/DepositSelect";
import DepositScreen from "./Screen/DepositScreen";
import DepositHistory from "./Screen/DepositHistory";
import LocationCr from "./Screen/LocationCr";
import DepositSelectGot from "./Screen/DepositSelectGot";
import firebase from "firebase";
import SolveTest from "./Screen/SolveTest";
import BorrowSelectGot from "./Screen/BorrowSelectGot";
import Scanner from "./Screen/Scanner";
import TEST from "./Screen/TEST";

const firebaseConfig = {
  apiKey: "AIzaSyDBzU9r967Zqlef6SjOUxMBnLRI97s3sgA",
  authDomain: "umbrashare-b39d1.firebaseapp.com",
  databaseURL: "https://umbrashare-b39d1-default-rtdb.firebaseio.com",
  projectId: "umbrashare-b39d1",
  storageBucket: "umbrashare-b39d1.appspot.com",
  messagingSenderId: "662233862687",
  appId: "1:662233862687:web:8da60453b2284628a1bb2a",
  measurementId: "G-H5C85NTRRH",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export const AuthContext = React.createContext();
const Stack = createStackNavigator();
export default function App() {
  const initialloginState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
  };

  const LoginReducer = (prevState, action) => {
    switch (action.type) {
      case "RESTORE_TOKEN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case "SIGN_IN":
        return {
          ...prevState,
          isSignout: false,
          userToken: action.token,
        };
      case "SIGN_OUT":
        return {
          ...prevState,
          isSignout: true,
          userToken: null,
        };
      case "REGISTER":
        return {
          ...prevState,
          isLoading: false,
          userToken: action.token,
        };
    }
  };

  async function readUserProfile(userToken) {
    const res = await axios.post(
      "https://umbrellashareserver.herokuapp.com/user/" + userToken
    );
    return res.data;
  }

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        //get token
        userToken = await SecureStore.getItemAsync("userToken");
        console.log("userToken");
        console.log(userToken);
      } catch (error) {}

      dispatch({
        type: "RESTORE_TOKEN",
        token: userToken,
      });
    };
    bootstrapAsync();
  }, []);

  async function Login(data) {
    // { email: 'sbd@mail.com', password: 'dsffsf'}
    const res = await axios.post(
      "https://umbrellashareserver.herokuapp.com/login" +
        "/" +
        data.email +
        "/" +
        data.password
    );
    console.log("res.data");
    console.log(res.data);
    return res.data;
  }

  const [state, dispatch] = React.useReducer(LoginReducer, initialloginState);
  const authContext = React.useMemo(() => ({
    signIn: async (data) => {
      let userToken;
      try {
        const user = await Login(data);
        userToken = user.p_id;
        console.log(user);
        if (user === "incorrect email") {
          Alert.alert("", "อีเมลล์ไม่ถูกต้อง", [{ text: "ลองอีกครั้ง" }]);
        } else if (user === "incorrect password") {
          Alert.alert("", "รหัสผ่านไม่ถูกต้อง", [{ text: "ลองอีกครั้ง" }]);
        } else {
          console.log("login");
        }
      } catch (error) {
        console.log(error);
      }
      try {
        await SecureStore.setItemAsync("userToken", userToken);
      } catch (error) {
        console.log(error);
      }
      dispatch({
        type: "SIGN_IN",
        token: userToken,
      });

      console.log("sign in");
    },

    signOut: async () => {
      try {
        await SecureStore.deleteItemAsync("userToken");
      } catch (error) {}
      dispatch({ type: "SIGN_OUT" });
    },

    // register: async () => {
    //   try {
    //     await SecureStore.deleteItemAsync("userToken")
    //     console.log("register")
    //   } catch (error) {

    //   }
    //   dispatch({ type: 'REGISTER' })
    // }
  }));

  return (
    <AuthContext.Provider value={{ ...state, ...authContext }}>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: "#004954",
                height: 60,
              },
              headerTintColor: "#fff",
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontSize: 18,
              },
            }}
          >
            {state.userToken == null ? (
              <>
                <Stack.Screen
                  name="LoginScreen"
                  component={LoginScreen}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="Registered"
                  component={Registered}
                  options={{ title: "สมัครสมาชิก" }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="Menu"
                  component={Menu}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="Borrow"
                  component={Borrow}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="GotUmbrella"
                  component={GotUmbrella}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Edituser"
                  component={Edituser}
                  options={{ title: "แก้ไขข้อมูล" }}
                />
                <Stack.Screen
                  name="ChangePassword"
                  component={ChangePassword}
                  options={{ title: "เปลี่ยนรหัสผ่าน" }}
                />
                <Stack.Screen
                  name="UploadImage"
                  component={UploadImage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="LocationCr"
                  component={LocationCr}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="BorrowHistoryMain"
                  component={BorrowHistoryMain}
                  options={{ title: "ประวัติการยืม" }}
                />
                <Stack.Screen
                  name="BorrowScreen"
                  component={BorrowScreen}
                  options={{ title: "MagicUmbrella" }}
                />
                <Stack.Screen
                  name="BorrowSelect"
                  component={BorrowSelect}
                  options={{ title: "ยืมร่ม" }}
                />
                <Stack.Screen
                  name="WaitToBorrow"
                  component={WaitToBorrow}
                  options={{ title: "เพิ่มรูปภาพก่อนยืม" }}
                />
                <Stack.Screen
                  name="GetSelect"
                  component={GetSelect}
                  options={{ title: "คืนร่ม" }}
                />
                <Stack.Screen
                  name="DepositScreen"
                  component={DepositScreen}
                  options={{ title: "MagicUmbrella" }}
                />
                <Stack.Screen
                  name="DepositSelect"
                  component={DepositSelect}
                  options={{ title: "ฝากร่ม" }}
                />
                <Stack.Screen
                  name="DepositHistory"
                  component={DepositHistory}
                  options={{ title: "ประวัติการฝาก" }}
                />
                <Stack.Screen
                  name="DepositSelectGot"
                  component={DepositSelectGot}
                  options={{ title: "รับร่มคืน" }}
                />
                <Stack.Screen
                  name="SolveTest"
                  component={SolveTest}
                  options={{ title: "แจ้งร่มชำรุด" }}
                />
                <Stack.Screen
                  name="BorrowSelectGot"
                  component={BorrowSelectGot}
                  options={{ title: "คืนร่ม" }}
                />
                <Stack.Screen
                  name="Scanner"
                  component={Scanner}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="TEST"
                  component={TEST}
                  options={{ headerShown: false }}
                />
              </>
            )}
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
