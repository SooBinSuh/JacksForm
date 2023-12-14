/** @format */

import React, { PropsWithChildren, useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { RootStackParamList } from "../App";
import { StackScreenProps } from "@react-navigation/stack";
import { CustomText } from "../Components/CustomText";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { FormBlock, QuestionType } from "../Models/Question";
import { atom, useRecoilState, useRecoilValue } from "recoil";
export type EditScreenProps = StackScreenProps<RootStackParamList, "Edit">;


//MARKER: ATOM/SELECTORS
const formListState = atom<FormBlock[]>({
  key:'FormList',
  default:[],
})




const defaultFormBlock = {
  type: QuestionType.SHORTANSWER,
  question: "",
  choice: undefined,
  required: false,
};
function BlockItemInputField(type:QuestionType){
  //get list state(array) from recoil 
  //compute index 
  //after setting value -> replace item with index

  switch(type){
    case QuestionType.SHORTANSWER:
      return       <TextInput
      autoCorrect={false}
      multiline={true}
      // onChangeText={}
      // style={{ marginHorizontal:8,backgroundColor:'gray',height:reset needed }}
      value={'daf'}
    />
    default:
      <Text>
        not yet
      </Text>

  }
}
function BlockItem(props: { item: FormBlock }) {
  //TODO: modify,delete,duplicate state with recoil
  const [title, setTitle] = useState(props.item.question);
  const [titleHeight, setTitleHeight] = useState(0);

  return (
    <View style={{backgroundColor:'white',paddingVertical:16,marginVertical:8,borderWidth:2,borderRadius:8}}>
      <TextInput
        autoCorrect={false}
        multiline={false}
        onChangeText={setTitle}
        onContentSizeChange={(event) => {
          setTitleHeight(event.nativeEvent.contentSize.height);
        }}
        style={{ marginHorizontal:8,height: Math.max(35, titleHeight),backgroundColor:'gray' }}
        value={title}
      />
      <Button  title={props.item.type}
            onPress={() => {
              console.log("toggle bottom sheet modal")
            }}/>

            {BlockItemInputField(props.item.type)}
      {/* TODO: bottom modal sheet for type*/}
      {/* TODO: conditionally render input Field */}

    </View>
  );
}
function EditScreen({ navigation, route }: EditScreenProps) {
  // const [testData,setTestData] = useState<FormBlock[]>([]);
  // const formList = useRecoilValue(formListState);
  const [formList,setFormList] = useRecoilState(formListState);
  

  useEffect(()=>{
    console.log('testData set!',formList);
  },[formList]);

  const onCreateBlockPress = () => {
    setFormList([...formList,{...defaultFormBlock}]);
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.editContainer}>
          <Button
            title="미리보기"
            onPress={() => {
              navigation.navigate("Preview");
            }}
          />
        </View>

        <TitleWithDescription />
        {formList.map((item,index) => (
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
