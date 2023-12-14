/** @format */

import React, { PropsWithChildren } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { RootStackParamList } from "../App";
import { StackScreenProps } from "@react-navigation/stack";

export type EditScreenProps = StackScreenProps<RootStackParamList, "Edit">;

function EditScreen({ navigation, route }: EditScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.editContainer}>
        <Button
          title="미리보기"
          onPress={() => {
            navigation.navigate("Preview");
          }}
        />
      </View>
      <GlobalText>this is Editadfasdfasdf screen</GlobalText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  editContainer: {
    height: 32,
    backgroundColor: "red",
    alignItems: "flex-end",
  },
  titleContainer: {},
  descriptionContainer: {},
});

export default EditScreen;


export const GlobalText = ({children}:PropsWithChildren)=>{
  return(
    <Text style={{fontSize:20}}>
      {children}
    </Text>
  )
}