/** @format */

import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Switch,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { RootStackParamList } from "../App";
import { StackScreenProps } from "@react-navigation/stack";
import { CustomText, DEFAILT_FONTSIZE } from "../Components/CustomText";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import {
  Choice,
  ChoiceType,
  FormBlock,
  QuestionType,
} from "../Models/Question";
import { atom, useRecoilState, useRecoilValue } from "recoil";
export type EditScreenProps = StackScreenProps<RootStackParamList, "Edit">;

//MARKER: ATOMS
const formListState = atom<FormBlock[]>({
  key: "FormList",
  default: [],
});
const formIsEditState = atom({
  key: "FormIsEdit",
  default: true,
});

//MARKER: SELECTORS

//MARKER: default data only for dev
const defaultFormBlock: FormBlock = {
  title: "",
  type: QuestionType.MULTIPLECHOICE,
  responseString: undefined,
  choice: [{ title: "Option 1", isSelected: false, type: ChoiceType.OPTION }],
  isRequired: false,
};

// BlockItem 내의 질문지 및 질문 작성 부분
function BlockItemInputField(item: FormBlock) {
  const [longFormHeight, setLongFormHeight] = useState(0);
  const isEdit = useRecoilValue(formIsEditState);
  const [formList, setFormList] = useRecoilState(formListState);
  const index = formList.findIndex((listItem) => item === listItem);

  const filteredOption = item.choice.filter(
    (value) => value.type === ChoiceType.OPTION
  );

  //MARKER: Intents
  const editResponseString = (value: string) => {
    const newList = replaceItemAtIndex(formList, index, {
      ...item,
      responseString: value,
    });
    setFormList(newList);
  };
  const editChoiceTitle = (choiceIndex: number, value: string) => {
    const newChoice = replaceItemAtIndex(item.choice, choiceIndex, {
      ...item.choice[choiceIndex],
      title: value,
    });
    const newList = replaceItemAtIndex(formList, index, {
      ...item,
      choice: newChoice,
    });
    setFormList(newList);
  };

  //after adding choice, sort so other comes at bottom
  const addChoice = (choiceType: ChoiceType) => {
    const optionChoice = item.choice.filter(
      (value) => value.type === ChoiceType.OPTION
    );
    const newChoice: Choice = {
      title:
        choiceType == ChoiceType.Other
          ? "Other..."
          : "Option " + (optionChoice.length + 1),
      isSelected: false,
      type: choiceType,
    };
    const newChoiceList = addItemAfterIndex(
      item.choice,
      item.choice.length,
      newChoice
    ).sort((a, b) => {
      if (a.type == b.type) {
        return 0;
      } else if (a.type == ChoiceType.OPTION && b.type == ChoiceType.Other) {
        return -1;
      } else {
        return 1;
      }
    });

    const newList = replaceItemAtIndex(formList, index, {
      ...item,
      choice: newChoiceList,
    });
    setFormList(newList);
  };
  const removeChoice = (choiceIndex:number) => {
    const newChoiceList = removeItemAtIndex(item.choice, choiceIndex);
    const newList = replaceItemAtIndex(formList, index, {
      ...item,
      choice: newChoiceList,
    });
    setFormList(newList);
  };

  switch (item.type) {
    case QuestionType.SHORTANSWER:
      return (
        <TextInput
          editable={!isEdit}
          selectTextOnFocus={!isEdit}
          autoCorrect={false}
          multiline={false}
          onChangeText={editResponseString}
          style={{
            marginHorizontal: 8,
            backgroundColor: "lightblue",
            height: 35,
          }}
          value={item.responseString}
          placeholder="Short answer text"
        />
      );

    case QuestionType.PARAGRAPH:
      return (
        <TextInput
          editable={!isEdit}
          selectTextOnFocus={!isEdit}
          autoCorrect={false}
          multiline={true}
          onChangeText={editResponseString}
          onContentSizeChange={(event) => {
            setLongFormHeight(event.nativeEvent.contentSize.height);
          }}
          style={{ height: Math.max(35, longFormHeight) }}
          value={item.responseString}
        />
      );
    case QuestionType.MULTIPLECHOICE:
      return (
        <View>
          {item.choice
            .map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  flex: 1,
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginStart: 4,
                }}
              >
                <View
                  style={{ flexDirection: "row", backgroundColor: "lightblue" }}
                >
                  {isEdit ? (
                    <FontAwesome5
                      name="circle"
                      size={24}
                      color=  {item.type == ChoiceType.OPTION ? "black" : "lightgray"}
                    />
                  ) : (
                    <FontAwesome5.Button
                      name="circle"
                      size={24}
                      color="black"
                      enabled={true}
                      onPress={() => {
                        console.log("click");
                      }}
                    />
                  )}
                  <TextInput
                    style={{
                      fontSize: DEFAILT_FONTSIZE,
                      color:
                        item.type == ChoiceType.OPTION ? "black" : "lightgray",
                    }}
                    editable={isEdit && item.type === ChoiceType.OPTION}
                    value={item.title}
                    onChangeText={(value: string) =>
                      editChoiceTitle(index, value)
                    }
                  />
                </View>
                <FontAwesome.Button name="remove" backgroundColor={'white'} size={24} color="black" onPress={()=>removeChoice(index)}/>
              </View>
            ))}
          {/* Add option or add 'other' */}
          <View
            style={{
              flexDirection: "row",
              marginStart: 10,
              alignItems: "center",
            }}
          >
            <FontAwesome5
              name="circle"
              size={24}
              color="lightgray"
              enabled={false}
            />
            <Button
              color="lightgray"
              title="Add option"
              onPress={() => addChoice(ChoiceType.OPTION)}
            />
            {filteredOption.length === item.choice.length && (
              <>
                <CustomText>or</CustomText>
                <Button
                  title="add 'Other'"
                  onPress={() => addChoice(ChoiceType.Other)}
                />
              </>
            )}
          </View>
        </View>
      );
    default:
      return <Text>DEFAULT</Text>;
  }
}

//MARKER: Array Item CRUD helper function
function duplicateItemAtIndex(arr: FormBlock[], index: number) {
  let item = { ...arr[index] };
  return [...arr.slice(0, index + 1), item, ...arr.slice(index + 1)];
}
function addItemAfterIndex<T>(arr: T[], index: number, newValue: T) {
  return [...arr.slice(0, index + 1), newValue, ...arr.slice(index + 1)];
}
function replaceItemAtIndex<T>(arr: T[], index: number, newValue: T) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex<T>(arr: T[], index: number) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

function BlockItem(props: { item: FormBlock }) {
  const [titleHeight, setTitleHeight] = useState(0);
  const [formList, setFormList] = useRecoilState(formListState);
  const index = formList.findIndex((listItem) => props.item === listItem);

  const editTitle = (value: string) => {
    const newList = replaceItemAtIndex(formList, index, {
      ...props.item,
      title: value,
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
      }}
    >
      <TextInput
        placeholder="Question"
        autoCorrect={false}
        multiline={false}
        onChangeText={editTitle}
        onContentSizeChange={(event) => {
          setTitleHeight(event.nativeEvent.contentSize.height);
        }}
        style={{
          marginHorizontal: 8,
          height: Math.max(35, titleHeight),
          backgroundColor: "lightgray",
        }}
        value={props.item.title}
      />
      <Button
        title={props.item.type}
        onPress={() => {
          console.log("toggle bottom sheet modal");
        }}
      />
      {/* 정답 구조 설정 및 입력 */}
      {BlockItemInputField(props.item)}
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
      {/* TODO: bottom modal sheet for type*/}
    </View>
  );
}
function EditScreen({ navigation, route }: EditScreenProps) {
  const [formList, setFormList] = useRecoilState(formListState);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    console.log("formList count length", formList.length);
  }, [formList]);

  //아이템 추가 콜백
  const onCreateBlockPress = () => {
    setFormList([...formList, { ...defaultFormBlock }]);
    setTimeout(
      () => scrollViewRef?.current?.scrollToEnd({ animated: true }),
      500
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} ref={scrollViewRef}>
        <View style={styles.editContainer}>
          <Button
            title="미리보기"
            onPress={() => {
              navigation.navigate("Preview");
            }}
          />
        </View>

        <TitleWithDescription />
        {formList.map((item, index) => (
          <BlockItem key={index} item={item} />
        ))}
      </ScrollView>
      <View style={styles.toolsContainer}>
        <TouchableOpacity onPress={onCreateBlockPress}>
          <AntDesign name="pluscircleo" size={24} color="black" />
        </TouchableOpacity>
      </View>
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
  toolsContainer: {
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
  },
  titleContainer: {},
  descriptionContainer: {},
});

export default EditScreen;

function TitleWithDescription() {
  const [title, setTitle] = useState("");
  const [titleHeight, setTitleHeight] = useState(0);

  const [description, setDescription] = useState("");
  const [descriptionHeight, setDescriptionHeight] = useState(0);
  return (
    <>
      <View
        style={{
          backgroundColor: "lightblue",
          paddingVertical: 10,
        }}
      >
        <CustomText>제목</CustomText>
        {/* TODO: refactor to custom textinput */}
        <TextInput
          autoCorrect={false}
          multiline={false}
          onChangeText={setTitle}
          onContentSizeChange={(event) => {
            setTitleHeight(event.nativeEvent.contentSize.height);
          }}
          style={{ height: Math.max(35, titleHeight) }}
          value={title}
        />
      </View>

      <View
        style={{
          backgroundColor: "lightgreen",
          paddingVertical: 10,
        }}
      >
        <CustomText>설명</CustomText>
        <TextInput
          autoCorrect={false}
          multiline={true}
          onChangeText={setDescription}
          onContentSizeChange={(event) => {
            setDescriptionHeight(event.nativeEvent.contentSize.height);
          }}
          style={{ height: Math.max(35, descriptionHeight) }}
          value={description}
        />
      </View>
    </>
  );
}
// utility for creating unique Id
let id = 0;
function getId() {
  return id++;
}
