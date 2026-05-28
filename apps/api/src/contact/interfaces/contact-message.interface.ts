export enum ContactMessageStatusValue {
  New = 'NEW',
  Read = 'READ',
  Archived = 'ARCHIVED',
}

export interface ContactMessageResponse {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: ContactMessageStatusValue;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactSubmitResponse {
  id: string;
  status: 'received';
  message: string;
}
