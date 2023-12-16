/** @format */
import "react-native-gesture-handler";

// import { StatusBar } from "expo-status-bar";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Button,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
} from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

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
import EditScreen, { bottomSheetState } from "./Screens/EditScreen";
import PreviewScreen from "./Screens/PreviewScreen";
import { NavigationContainer } from "@react-navigation/native";
import {
  BottomSheetModalProps,
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";

// MARKER: navigation setup
export type RootStackParamList = {
  Edit: undefined;
  Preview: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

export default () => {
  return (
    <RecoilRoot>
      <App />
    </RecoilRoot>
  );
};

function App() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const state = useRecoilValue(bottomSheetState);
  // const snapPoints = useMemo(() => [0,-1], []);
  // const snapPoints = ['20%'];
  const [backdropPressBehavior, setBackdropPressBehavior] = useState<
    "none" | "close" | "collapse"
  >("close");

  useEffect(() => {
    console.log("state changed!,", state);
    if (state.isVisible) {
      bottomSheetModalRef.current?.present();
    }
  }, [state]);
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
      style={{backgroundColor:'red'}}
        {...props}
        enableTouchThrough={false}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior={backdropPressBehavior}
        onPress={()=>{console.log('a')}}
      />
    ),
    [backdropPressBehavior]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View style={{ flex: 1 }}>
          <SafeAreaView style={styles.AndroidSafeArea}>
            <NavigationContainer>
              <RootStack.Navigator initialRouteName="Edit">
                <RootStack.Screen
                  name="Edit"
                  component={EditScreen}
                  options={{ headerShown: false }}
                />
                <RootStack.Screen
                  name="Preview"
                  component={PreviewScreen}
                  options={{ headerShown: true }}
                />
              </RootStack.Navigator>
            </NavigationContainer>
            <BottomSheetModal
            ref={bottomSheetModalRef}
              backdropComponent={renderBackdrop}
              
              // snapPoints={snapPoints}
              snapPoints={["40%"]}
              onDismiss={()=>{console.log('dismissed')}}
              enablePanDownToClose={true}
              // handleComponent={()=><></>}
              // handleHeight={10}
            >
              <View>
                <Text>Awesome 🎉</Text>
              </View>
            </BottomSheetModal>
          </SafeAreaView>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
