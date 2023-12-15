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
import { RootStackParamList } from "../App";
import { StackScreenProps } from "@react-navigation/stack";
import { CustomText } from "../Components/CustomText";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { FormBlock, QuestionType } from "../Models/Question";
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

const defaultFormBlock = {
  title: "",
  type: QuestionType.SHORTANSWER,
  responseString: undefined,
  choice: undefined,
  isRequired: false,
};

// BlockItem 내의 질문지 및 질문 작성 부분
function BlockItemInputField(item: FormBlock) {
  const [longFormHeight, setLongFormHeight] = useState(0);
  const isEdit = useRecoilValue(formIsEditState);
  const [formList, setFormList] = useRecoilState(formListState);
  const index = formList.findIndex((listItem) => item === listItem);

  const editResponseString = (value: string) => {
    const newList = replaceItemAtIndex(formList, index, {
      ...item,
      responseString: value,
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
    default:
      <Text>not yet</Text>;
  }
}


//MARKER: Array Item CRUD helper function
function duplicateItemAtIndex(arr:FormBlock[],index:number){
  let item = {...arr[index]}
  return [...arr.slice(0, index+1), item, ...arr.slice(index + 1)];  
}

function replaceItemAtIndex(
  arr: FormBlock[],
  index: number,
  newValue: FormBlock
) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex(arr: FormBlock[], index: number) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

function BlockItem(props: { item: FormBlock}) {
  //TODO: modify,delete,duplicate state with recoil
  const [title, setTitle] = useState(props.item.title);
  const [titleHeight, setTitleHeight] = useState(0);
  const [formList, setFormList] = useRecoilState(formListState);
  const index = formList.findIndex((listItem) => props.item === listItem);

  const toggleIsRequired = (value: boolean) => {
    const newList = replaceItemAtIndex(formList, index, {
      ...props.item,
      isRequired: value,
    });
    setFormList(newList);
  };
  const onDuplicateBlockPress = ()=>{
    const newList = duplicateItemAtIndex(formList,index);
    setFormList(newList);
  }
  const onDeleteBlockPress = ()=>{
    const newList = removeItemAtIndex(formList,index);
    setFormList(newList);
  }
  
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
        onChangeText={setTitle}
        onContentSizeChange={(event) => {
          setTitleHeight(event.nativeEvent.contentSize.height);
        }}
        style={{
          marginHorizontal: 8,
          height: Math.max(35, titleHeight),
          backgroundColor: "lightgray",
        }}
        value={title}
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
        <Button title="복제"  onPress={onDuplicateBlockPress}/>
        <Button title="삭제" onPress={onDeleteBlockPress}/>
      </View>
      {/* TODO: bottom modal sheet for type*/}
    </View>
  );
}
function EditScreen({ navigation, route }: EditScreenProps) {
  const [formList, setFormList] = useRecoilState(formListState);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    console.log("testData set!", formList);
  }, [formList]);

  //아이템 추가 콜백
  const onCreateBlockPress = () => {
    setFormList([...formList, { ...defaultFormBlock }]);
    //list state 업데이트 이후 스크롤
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
          <BlockItem key={index} item={item}/>
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
