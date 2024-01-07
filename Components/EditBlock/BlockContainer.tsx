import { useState } from "react";
import { FormBlock } from "../../Models/Question";
import { useRecoilState, useRecoilValue } from "recoil";
import { bottomSheetState, formIsEditState, formListState } from "../../recoil/edits";
import { duplicateItemAtIndex, removeItemAtIndex, replaceItemAtIndex } from "../../util/helpers";
import { TextInput, TouchableWithoutFeedback, View,Text, Switch, Button } from "react-native";
import { CustomText } from "../CustomText";
import { BlockQuestionInputField } from "./BlockQuestionInputField";


export default function BlockContainer(props: { item: FormBlock }) {
    const [titleHeight, setTitleHeight] = useState(0);
    const [formList, setFormList] = useRecoilState(formListState);
    const [bottomState, setBottomSheetState] = useRecoilState(bottomSheetState);
    const isEdit = useRecoilValue(formIsEditState);
  
    const index = formList.findIndex((listItem) => props.item === listItem);
    const editTitle = (value: string) => {
      const newList = replaceItemAtIndex(formList, index, {
        ...props.item,
        title: value,
        responseString: "",
      });
      setFormList(newList);
    };
    const toggleIsRequired = (value: boolean) => {
      const newList = replaceItemAtIndex(formList, index, {
        ...props.item,
        isRequired: value,
      });
      setFormList(newList);
    };
    const onDuplicateBlockPress = () => {
      const newList = duplicateItemAtIndex(formList, index);
      setFormList(newList);
    };
    const onDeleteBlockPress = () => {
      const newList = removeItemAtIndex(formList, index);
      setFormList(newList);
    };
  
    return (
      <View
        style={{
          backgroundColor: "white",
          paddingVertical: 16,
          marginVertical: 8,
          borderWidth: 2,
          borderRadius: 8,
          marginHorizontal: isEdit ? 0 : 16,
        }}
      >
        {/* MARKER: 질문 제목 및 필수항목 표시*/}
        {!(!isEdit && props.item.title == "" && !props.item.isRequired) && (
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 8,
              paddingVertical: 8,
              marginBottom: 8,
              borderBottomWidth: isEdit ? 1 : 0,
            }}
          >
            <TextInput
              editable={isEdit}
              placeholder={isEdit ? "Question" : ""}
              autoCorrect={false}
              multiline={false}
              onChangeText={editTitle}
              onContentSizeChange={(event) => {
                setTitleHeight(event.nativeEvent.contentSize.height);
              }}
              style={{
                height: Math.max(35, titleHeight),
                fontSize: 20,
                color: "black",
              }}
              value={props.item.title}
            />
            {!isEdit && props.item.isRequired && (
              <CustomText style={{ color: "red" }}>*</CustomText>
            )}
          </View>
        )}
  
        {/*MARKER: 질문 타입 설정 바텀 Sheet 버튼  */}
        {isEdit && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingEnd: 8,
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                setBottomSheetState({ selectedIndex: index, isVisible: true });
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  padding: 14,
                  borderWidth: 1,
                  borderRadius: 8,
                }}
              >
                <CustomText>{props.item.type}</CustomText>
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}
  
        {/* MARKER: 정답 구조 설정 및 입력 */}
        {BlockQuestionInputField(props.item)}
        {isEdit && (
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
              margin: 6,
            }}
          >
            <Text>Required</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={props.item.isRequired ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleIsRequired}
              value={props.item.isRequired}
            />
            <Button title="복제" onPress={onDuplicateBlockPress} />
            <Button title="삭제" onPress={onDeleteBlockPress} />
          </View>
        )}
      </View>
    );
  }