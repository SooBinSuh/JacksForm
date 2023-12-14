export type FormBlock = {
    id:number;
    type: QuestionType;
    question:string;
    choice : string[] | undefined;
    required: boolean;
}

export enum QuestionType{
    SHORTANSWER = 'ShortAnswer',
    PARAGRAPH = 'Paragraph',
    MULTIPLECHOICE = 'MultipleChoice',
    CHECKBOXES = 'CheckBoxes'

}