import { atom } from "recoil";
import { Form, FormBlock } from "../Models/Question";



export const formState = atom<Form>({
    key: "Form",
    default: {
      title: "",
      description: "",
    },
  });
  
  export var formListState = atom<FormBlock[]>({
    key: "FormList",
    default: [
    ],
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
  