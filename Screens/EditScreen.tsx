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
export type EditScreenProps = StackScreenProps<RootStackParamList, "Edit">;

//MARKER: default data only for dev
var defaultFormBlock: FormBlock = {
  title: "",
  type: QuestionType.SHORTANSWER,
  responseString: undefined,
  choice: [{ title: "Option 1", isSelected: false, type: ChoiceType.OPTION }],
  isRequired: false,
};

//MARKER: ATOMS
export const formState = atom<Form>({
  key: "Form",
  default: {
    title: "",
    description: "",
  },
});

export var formListState = atom<FormBlock[]>({
  key: "FormList",
  default: [defaultFormBlock],
});
export const formIsEditState = atom({
  key: "FormIsEdit",
  default: true,
});

export const bottomSheetState = atom({
  key: "BottomSheetState",
  default: {
    isVisible: false,
    selectedIndex: -1,
  },
});
//MARKER: SELECTORS
// const bottomSheetVisibileState = selector({
//   key: 'BottomSheetVisibileState',
//   get: ({get}) => {
//     const filter = get(todoListFilterState);
//     const list = get(todoListState);

//     switch (filter) {
//       case 'Show Completed':
//         return list.filter((item) => item.isComplete);
//       case 'Show Uncompleted':
//         return list.filter((item) => !item.isComplete);
//       default:
//         return list;
//     }
//   },
// });

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
  const removeChoice = (choiceIndex: number) => {
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
            height: 35,
            color: "lightgray",
            borderBottomWidth: 1.0,
          }}
          value={isEdit ? "Short answer text" : item.responseString}
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
          style={{
            marginHorizontal: 8,
            height: Math.max(35, longFormHeight),
            color: "lightgray",
            borderBottomWidth: 1.0,
          }}
          value={isEdit ? "Long answer text" : item.responseString}
          placeholder="Long answer text"
        />
      );
    case QuestionType.MULTIPLECHOICE:
    case QuestionType.CHECKBOXES:
      return (
        <View>
          {item.choice.map((choiceItem, index) => (
            <MultipleChoiceItem
              key={index}
              formBlockItem={item}
              choiceItem={choiceItem}
              index={index}
              editChoiceTitle={editChoiceTitle}
              removeChoice={removeChoice}
            />
          ))}
          <ChoiceAddButton
            item={item}
            choiceOptions={filteredOption}
            addChoice={addChoice}
          />
        </View>
      );

    default:
      return <Text>DEFAULT</Text>;
  }
}
function ChoiceAddButton(props: {
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
export function MultipleChoiceItem(props: {
  formBlockItem: FormBlock;
  choiceItem: Choice;
  index: number;
  editChoiceTitle: (index: number, value: string) => void;
  removeChoice: (index: number) => void;
}) {
  const isEdit = useRecoilValue(formIsEditState);
  const checkBoxIconName = props.choiceItem.isSelected
    ? "checkbox-active"
    : "checkbox-passive";
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
              name="circle"
              size={24}
              color={
                props.choiceItem.type == ChoiceType.OPTION
                  ? "black"
                  : "lightgray"
              }
            />
          ) : (
            <Fontisto name={checkBoxIconName} size={24} color="black" />
          )
        ) : //  <Text>asdf</Text>
        props.formBlockItem.type == QuestionType.MULTIPLECHOICE ? (
          <FontAwesome5.Button
            name="circle"
            size={24}
            color="black"
            enabled={true}
            onPress={() => {
              console.log("click");
            }}
          />
        ) : (
          <Fontisto.Button name={checkBoxIconName} size={24} color="black" />
        )}
        <TextInput
          style={{
            marginStart: 8,
            fontSize: DEFAILT_FONTSIZE,
            color:
              props.choiceItem.type == ChoiceType.OPTION
                ? "black"
                : "lightgray",
          }}
          editable={isEdit && props.choiceItem.type === ChoiceType.OPTION}
          value={props.choiceItem.title}
          onChangeText={(value: string) =>
            props.editChoiceTitle(props.index, value)
          }
        />
      </View>
      {props.index != 0 && props.formBlockItem.choice.length > 1 && (
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

//MARKER: Array Item CRUD helper function
function duplicateItemAtIndex(arr: FormBlock[], index: number) {
  let item = { ...arr[index] };
  return [...arr.slice(0, index + 1), item, ...arr.slice(index + 1)];
}
function addItemAfterIndex<T>(arr: T[], index: number, newValue: T) {
  return [...arr.slice(0, index + 1), newValue, ...arr.slice(index + 1)];
}
export function replaceItemAtIndex<T>(arr: T[], index: number, newValue: T) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex<T>(arr: T[], index: number) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

function BlockItem(props: { item: FormBlock }) {
  const [titleHeight, setTitleHeight] = useState(0);
  const [formList, setFormList] = useRecoilState(formListState);
  const [bottomState, setBottomSheetState] = useRecoilState(bottomSheetState);
  const index = formList.findIndex((listItem) => props.item === listItem);
  const isEdit = useRecoilValue(formIsEditState);
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
        marginHorizontal: isEdit ? 0 : 16,
      }}
    >
      {/* MARKER: 질문 제목 및 필수항목 표시*/}
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
            backgroundColor: isEdit ? "lightgray" : undefined,
            fontSize: 20,
          }}
          value={props.item.title}
        />
        {!isEdit && props.item.isRequired && (
          <CustomText style={{ color: "red" }}>*</CustomText>
        )}
      </View>

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
              console.log("toggle bottom sheet modal");
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
      {BlockItemInputField(props.item)}
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

function EditScreen({ navigation, route }: EditScreenProps) {
  const [formList, setFormList] = useRecoilState(formListState);
  const scrollViewRef = useRef<ScrollView>(null);
  const [isEdit, setEdit] = useRecoilState(formIsEditState);
  useEffect(() => {
    console.log("formList count length", formList.length);
  }, [formList]);
  useEffect(() => {
    console.log("isedit changed,", isEdit);
  }, [isEdit]);
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
              // navigation.navigate('Preview');
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
  // const [formList],
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
      <View
        style={{
          paddingVertical: 10,
          marginHorizontal: 16,
        }}
      >
        {isEdit && <CustomText>제목</CustomText>}
        {/* TODO: refactor to custom textinput */}
        {
          <TextInput
            editable={isEdit}
            autoCorrect={false}
            multiline={false}
            onChangeText={setTitle}
            onContentSizeChange={(event) => {
              setTitleHeight(event.nativeEvent.contentSize.height);
            }}
            style={{
              height: Math.max(35, titleHeight),
              borderBottomWidth: isEdit ? 1 : 0,
              fontWeight: isEdit ? "normal" : "bold",
              fontSize: isEdit ? 20 : 32,
            }}
            value={form.title}
          />
        }
      </View>

      <View
        style={{
          paddingVertical: 10,
          marginHorizontal: 16,
        }}
      >
        {isEdit && <CustomText>설명</CustomText>}
        {
          <TextInput
            editable={isEdit}
            autoCorrect={false}
            multiline={true}
            onChangeText={setDescription}
            onContentSizeChange={(event) => {
              setDescriptionHeight(event.nativeEvent.contentSize.height);
            }}
            style={{
              height: Math.max(35, descriptionHeight),
              borderBottomWidth: isEdit ? 1 : 0,
              fontSize: 20,
            }}
            value={form.description}
          />
        }
      </View>
    </>
  );
}
