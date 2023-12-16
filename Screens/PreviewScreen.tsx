/** @format */

import React from "react";
import { View, Text } from "react-native";
import EditScreen, { EditScreenProps } from "./EditScreen";
import { RootStackParamList } from "../App";
import { StackScreenProps } from "@react-navigation/stack";
export type PreviewScreenProps = StackScreenProps<RootStackParamList, "Preview">;
// export type
function PreviewScreen({navigation,route}:PreviewScreenProps) {
  return (
    // <EditScreen />
    <>
    </>
  );
}

export default PreviewScreen;