

export interface Email {
    subject: string;
    date:string;
    from: string;
    emailBody:string;

   
  }


export interface ClassifiedEmail extends Email {
    classification: string;
}
export type ClassifyMailFunction = (params: { newMails: string[], apiKey: string }) => Promise<string>;
