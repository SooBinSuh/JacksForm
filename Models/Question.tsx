export type FormBlock = {
    title: string;
    type: QuestionType;
    responseString:string|undefined;
    choice : Choice[];
    isRequired: boolean;
}

export type Choice = {

    title:string;
    isSelected:boolean;
    type: ChoiceType
}

export enum ChoiceType {
    OPTION = "Option",
    Other = "Other"
}

export enum QuestionType{
    SHORTANSWER = 'ShortAnswer',
    PARAGRAPH = 'Paragraph',
    MULTIPLECHOICE = 'MultipleChoice',
    CHECKBOXES = 'CheckBoxes'

}