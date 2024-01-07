import { useState } from "react";
import { Choice, ChoiceType, FormBlock, QuestionType } from "../../Models/Question";
import { useRecoilState, useRecoilValue } from "recoil";
import { formIsEditState, formListState } from "../../recoil/edits";
import { addItemAfterIndex, removeItemAtIndex, replaceItemAtIndex } from "../../util/helpers";
import { TextInput,StyleSheet, View, Text } from "react-native";
import MultipleChoiceItem from "./MultipleChoiceItem";
import ChoiceAddButton from "./ChoiceAddButton";


//MARKER: BlockItem > 질문지 및 질문 작성 부분
export function BlockQuestionInputField(item: FormBlock) {
    const [longFormHeight, setLongFormHeight] = useState(0);
    const isEdit = useRecoilValue(formIsEditState);
    const [formList, setFormList] = useRecoilState(formListState);
    const index = formList.findIndex((listItem) => item === listItem);
  
    const filteredOption = item.choice.filter(
      (value) => value.type === ChoiceType.OPTION
    );
  
    const toggleChoiceItem = (chocieIndex: number) => {
      const newChoiceList =
        item.type == QuestionType.CHECKBOXES
          ? replaceItemAtIndex(item.choice, chocieIndex, {
              ...item.choice[chocieIndex],
              isSelected: !item.choice[chocieIndex].isSelected,
            })
          : item.choice.map((item, index) => ({
              ...item,
              isSelected: index === chocieIndex ? !item.isSelected : false,
            }));
      const newList = replaceItemAtIndex(formList, index, {
        ...item,
        choice: newChoiceList,
      });
      setFormList(newList);
    };
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
  
    //Choice 추가 후, 'Other'타입이 항상 하단에 위치하기 정렬한다
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
              ...styles.shortLongAnswerTextInput,
              color: isEdit ? "lightgray" : "black",
              height: 35,
            }}
            value={isEdit ? "Short answer text" : item.responseString}
            placeholder={isEdit ? "Short answer text" : "Your answer"}
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
              ...styles.shortLongAnswerTextInput,
              height: Math.max(35, longFormHeight),
              color: isEdit ? "lightgray" : "black",
            }}
            value={isEdit ? "Long answer text" : item.responseString}
            placeholder={isEdit ? "Long answer text" : "Your answer"}
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
                toggleChoice={toggleChoiceItem}
              />
            ))}
            {isEdit && (
              <ChoiceAddButton
                item={item}
                choiceOptions={filteredOption}
                addChoice={addChoice}
              />
            )}
          </View>
        );
  
      default:
        return <Text>DEFAULT</Text>;
    }
  }



  const styles = StyleSheet.create({

    shortLongAnswerTextInput: {
      marginHorizontal: 8,
      borderBottomWidth: 1.0,
    },
  });