export type FormBlock = {
    title: string;
    type: QuestionType;
    responseString:string|undefined;
    choice : string[] | undefined;
    isRequired: boolean;
}



export enum QuestionType{
    SHORTANSWER = 'ShortAnswer',
    PARAGRAPH = 'Paragraph',
    MULTIPLECHOICE = 'MultipleChoice',
    CHECKBOXES = 'CheckBoxes'

}