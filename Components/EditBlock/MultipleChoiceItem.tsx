import { useRecoilValue } from "recoil";
import { Choice, ChoiceType, FormBlock, QuestionType } from "../../Models/Question";
import { formIsEditState } from "../../recoil/edits";
import { TextInput, TouchableWithoutFeedback, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { DEFAILT_FONTSIZE } from "../CustomText";

export default function MultipleChoiceItem(props: {
    formBlockItem: FormBlock;
    choiceItem: Choice;
    index: number;
    editChoiceTitle: (index: number, value: string) => void;
    removeChoice: (index: number) => void;
    toggleChoice: (choiceIndex: number) => void;
  }) {
    const isEdit = useRecoilValue(formIsEditState);
    const checkBoxIconName = props.choiceItem.isSelected
      ? "check-square"
      : "square";
    const circleIconNAme = props.choiceItem.isSelected ? "dot-circle" : "circle";
    return (
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          justifyContent: "space-between",
          alignItems: "center",
          marginStart: 4,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          {isEdit ? (
            props.formBlockItem.type == QuestionType.MULTIPLECHOICE ? (
              <FontAwesome5
                name={circleIconNAme}
                size={24}
                color={
                  isEdit
                    ? props.choiceItem.type == ChoiceType.OPTION
                      ? "black"
                      : "lightgray"
                    : "black"
                }
              />
            ) : (
              <FontAwesome5 name={checkBoxIconName} size={24} color="black" />
            )
          ) : props.formBlockItem.type == QuestionType.MULTIPLECHOICE ? (
            <TouchableWithoutFeedback
              onPress={() => {
                props.toggleChoice(props.index);
              }}
            >
              <FontAwesome5
                name={circleIconNAme}
                size={24}
                color="black"
                enabled={true}
              />
            </TouchableWithoutFeedback>
          ) : (
            <TouchableWithoutFeedback
              onPress={() => {
                props.toggleChoice(props.index);
              }}
            >
              <FontAwesome5
                name={checkBoxIconName}
                size={24}
                color="black"
              />
            </TouchableWithoutFeedback>
          )}
          <TextInput
            style={{
              marginStart: 8,
              fontSize: DEFAILT_FONTSIZE,
              color: isEdit
                ? props.choiceItem.type == ChoiceType.OPTION
                  ? "black"
                  : "lightgray"
                : "black",
            }}
            editable={isEdit && props.choiceItem.type === ChoiceType.OPTION}
            value={props.choiceItem.title}
            onChangeText={(value: string) =>
              props.editChoiceTitle(props.index, value)
            }
          />
        </View>
        {props.index != 0 && props.formBlockItem.choice.length > 1 && isEdit && (
          <FontAwesome.Button
            name="remove"
            backgroundColor={"white"}
            size={24}
            color="black"
            onPress={() => props.removeChoice(props.index)}
          />
        )}
      </View>
    );
  }
  
  