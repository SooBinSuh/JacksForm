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
import EditScreen, {
} from "./Screens/EditScreen";
import { NavigationContainer } from "@react-navigation/native";
import {
  BottomSheetModalProps,
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import {
  GestureHandlerRootView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { ChoiceType, QuestionType } from "./Models/Question";
import { CustomText } from "./Components/CustomText";
import { bottomSheetState, formListState } from "./recoil/edits";
import { replaceItemAtIndex } from "./util/helpers";

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
  const [bottomSheet, setbottomSheet] = useRecoilState(bottomSheetState);
  const [formList, setFormList] = useRecoilState(formListState);

  useEffect(() => {
    if (bottomSheet.isVisible) {
      bottomSheetModalRef.current?.present();
    }
  }, [bottomSheet]);

  const onBottomSheetChocieTypePressed = (type: QuestionType) => {
    //if state 올바르지 않은 값 OR 이미 선택한 타입 선택이면 리턴
    if (
      bottomSheet.selectedIndex == -1 ||
      formList[bottomSheet.selectedIndex].type === type
    ) {
      bottomSheetModalRef.current?.dismiss();
      return;
    }
    const form = formList[bottomSheet.selectedIndex];

    const newForm = replaceItemAtIndex(formList, bottomSheet.selectedIndex, {
      ...form,
      type: type,
      choice: [
        { title: "Option 1", isSelected: false, type: ChoiceType.OPTION },
      ],
    });
    setFormList(newForm);
    bottomSheetModalRef.current?.dismiss();
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        style={{ backgroundColor: "red" }}
        {...props}
        enableTouchThrough={false}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior={"close"}
      />
    ),
    []
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View style={{ flex: 1 }}>
          <SafeAreaView style={styles.AndroidSafeArea}>
            <NavigationContainer>

              <RootStack.Navigator initialRouteName="Edit">
                {/* Edit Screen */}
                <RootStack.Screen
                  name="Edit"
                  component={EditScreen}
                  options={{ headerShown: false }}
                />
              </RootStack.Navigator>
            </NavigationContainer>

            {/* Bottom Modal */}
            <BottomSheetModal
              ref={bottomSheetModalRef}
              backdropComponent={renderBackdrop}
              snapPoints={["50%"]}
              onDismiss={() => {
                setbottomSheet({ ...bottomSheet, isVisible: false });
              }}
              enablePanDownToClose={true}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "space-evenly",
                  paddingVertical: 16,
                  alignItems: "flex-start",
                  paddingStart: 16,
                }}
              >
                {Object.values(QuestionType).map((value, index) => (
                  <TouchableWithoutFeedback
                    key={index}
                    onPress={() => onBottomSheetChocieTypePressed(value)}
                    style={{ padding: 16 }}
                  >
                    <CustomText
                      style={{
                        color: `${
                          formList[bottomSheet.selectedIndex]?.type === value
                            ? "blue"
                            : "black"
                        }`,
                      }}
                    >
                      {value}
                    </CustomText>
                  </TouchableWithoutFeedback>
                ))}
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
