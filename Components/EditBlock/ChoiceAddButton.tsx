import { Button, View } from "react-native";
import { Choice, ChoiceType, FormBlock, QuestionType } from "../../Models/Question";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { CustomText } from "../CustomText";

export default function ChoiceAddButton(props: {
    item: FormBlock;
    choiceOptions: Choice[];
    addChoice: (value: ChoiceType) => void;
  }) {
    const checkBoxIconName = "checkbox-passive";
  
    return (
      <View
        style={{
          flexDirection: "row",
          marginStart: 10,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {props.item.type == QuestionType.MULTIPLECHOICE ? (
          <FontAwesome5
            name="circle"
            size={24}
            color="lightgray"
            enabled={false}
          />
        ) : (
          <Fontisto.Button
            name={checkBoxIconName}
            size={24}
            color="black"
            backgroundColor="white"
            style={{ overflow: "hidden" }}
          />
        )}
  
        <Button
          color="lightgray"
          title="Add option"
          onPress={() => props.addChoice(ChoiceType.OPTION)}
        />
        {props.choiceOptions.length === props.item.choice.length && (
          <>
            <CustomText>or</CustomText>
            <Button
              title="add 'Other'"
              onPress={() => props.addChoice(ChoiceType.Other)}
            />
          </>
        )}
      </View>
    );
  }