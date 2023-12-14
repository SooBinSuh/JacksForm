/** @format */
import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createStackNavigator } from "@react-navigation/stack";
import EditScreen from "./Screens/EditScreen";
import PreviewScreen from "./Screens/PreviewScreen";
import { NavigationContainer } from "@react-navigation/native";


// MARKER: navigation setup
export type RootStackParamList = {
  Edit: undefined;
  Preview: undefined;
}

const RootStack = createStackNavigator<RootStackParamList>();





export default function App() {
  return (
    <View style={{flex:1,}}>
    <SafeAreaView style={{flex:1,}}>
      <RecoilRoot>
        <NavigationContainer >
          <RootStack.Navigator initialRouteName="Edit">
            <RootStack.Screen name="Edit" component={EditScreen}  options={{headerShown: false}}/>
            <RootStack.Screen name="Preview" component={PreviewScreen} options={{headerShown: true}}/>
          </RootStack.Navigator>
        </NavigationContainer>
      </RecoilRoot>
    </SafeAreaView>
    </View>

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
