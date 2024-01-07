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

import { Fontisto } from "@expo/vector-icons";
import { RootStackParamList } from "../App";
import { StackScreenProps } from "@react-navigation/stack";
import { CustomText, DEFAILT_FONTSIZE } from "../Components/CustomText";
import {
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

import {
  Choice,
  ChoiceType,
  Form,
  FormBlock,
  QuestionType,
} from "../Models/Question";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import {
  bottomSheetState,
  formIsEditState,
  formListState,
  formState,
} from "../recoil/edits";
import { addItemAfterIndex, removeItemAtIndex, replaceItemAtIndex } from "../util/helpers";
import BlockContainer from "../Components/EditBlock/BlockContainer";
export type EditScreenProps = StackScreenProps<RootStackParamList, "Edit">;

//MARKER: default data only for dev
const defaultFormBlock: FormBlock = {
  title: "",
  type: QuestionType.SHORTANSWER,
  responseString: undefined,
  choice: [{ title: "Option 1", isSelected: false, type: ChoiceType.OPTION }],
  isRequired: false,
};





function EditScreen({ navigation, route }: EditScreenProps) {
  const [formList, setFormList] = useRecoilState(formListState);
  const scrollViewRef = useRef<ScrollView>(null);
  const [isEdit, setEdit] = useRecoilState(formIsEditState);
  useEffect(() => {
  }, [formList]);

  useEffect(() => {

    if (isEdit && formList.length > 0) {
      resetAllAnswers();
    }
  }, [isEdit]);

  const resetAllAnswers = () => {
    const newFormList = formList.map((item, index) => ({
      ...item,
      responseString: "",
      choice: item.choice.map((item2, index) => ({
        ...item2,
        isSelected: false,
      })),
    }));
    setFormList(newFormList);
  };
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
            title={`${isEdit ? "미리보기" : "수정하기"}`}
            onPress={() => {
              setEdit(!isEdit);
            }}
          />
        </View>

        <TitleWithDescription />
        {formList.map((item, index) => (
          <BlockContainer key={index} item={item} />
        ))}
      </ScrollView>
      {isEdit && (
        <View style={styles.toolsContainer}>
          <TouchableOpacity onPress={onCreateBlockPress}>
            <AntDesign name="pluscircleo" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  editContainer: {
    height: 32,
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
  shortLongAnswerTextInput: {
    marginHorizontal: 8,
    borderBottomWidth: 1.0,
  },
});

export default EditScreen;

//Form Header, not a shared component
function TitleWithDescription() {
  const [form, setForm] = useRecoilState(formState);
  const isEdit = useRecoilValue(formIsEditState);
  const setTitle = (value: string) => {
    setForm({ ...form, title: value });
  };
  const setDescription = (value: string) => {
    setForm({ ...form, description: value });
  };

  const [titleHeight, setTitleHeight] = useState(0);
  const [descriptionHeight, setDescriptionHeight] = useState(0);
  return (
    <>
      {!(!isEdit && form.title == "") && (
        <View
          style={{
            paddingVertical: 10,
            marginHorizontal: 16,
          }}
        >
          {isEdit && <CustomText>제목</CustomText>}
          <TextInput
            editable={isEdit}
            autoCorrect={false}
            multiline={false}
            onChangeText={setTitle}
            onContentSizeChange={(event) => {
              setTitleHeight(event.nativeEvent.contentSize.height);
            }}
            style={{
              color: "black",
              height: Math.max(35, titleHeight),
              borderBottomWidth: isEdit ? 1 : 0,
              fontWeight: isEdit ? "normal" : "bold",
              fontSize: isEdit ? 20 : 32,
            }}
            value={form.title}
          />
        </View>
      )}
      {!(!isEdit && form.title == "") && (
        <View
          style={{
            paddingVertical: 10,
            marginHorizontal: 16,
          }}
        >
          {isEdit && <CustomText>설명</CustomText>}
          {!(!isEdit && form.description == "") && (
            <TextInput
              editable={isEdit}
              autoCorrect={false}
              multiline={true}
              onChangeText={setDescription}
              onContentSizeChange={(event) => {
                setDescriptionHeight(event.nativeEvent.contentSize.height);
              }}
              style={{
                color: "black",
                height: Math.max(35, descriptionHeight),
                borderBottomWidth: isEdit ? 1 : 0,
                fontSize: 20,
              }}
              value={form.description}
            />
          )}
        </View>
      )}
    </>
  );
}
