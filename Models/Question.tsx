/** @format */

import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Switch,
  TextInput,
} from "react-native";
import { useRecoilValue } from "recoil";
import { formIsEditState } from "../Screens/EditScreen";
import React from "react";

import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { DEFAILT_FONTSIZE } from "../Components/CustomText";

export type FormBlock = {
  title: string;
  type: QuestionType;
  responseString: string | undefined;
  choice: Choice[];
  isRequired: boolean;
};

export type Choice = {
  title: string;
  isSelected: boolean;
  type: ChoiceType;
};

export enum ChoiceType {
  OPTION = "Option",
  Other = "Other",
}

export enum QuestionType {
  SHORTANSWER = "ShortAnswer",
  PARAGRAPH = "Paragraph",
  MULTIPLECHOICE = "MultipleChoice",
  CHECKBOXES = "CheckBoxes",
}

