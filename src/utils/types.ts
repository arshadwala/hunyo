import { FieldValue, Timestamp } from 'firebase/firestore';

type Formats = 'jpeg' | 'pdf';

// Tasks for the system

export type FormTask = 'createDoc' | 'resubmitDoc' | 'resubmitPages';

type ActionsType = 'verifyDocuments' | 'messageNotSent';

export interface Invite {
  createdAt: Timestamp | FieldValue;
  company: {
    name: string;
    id: string;
  };
  email: string;
  resend: boolean;
}

export interface Company {
  createdAt: Timestamp | FieldValue;
  name: string;
  users: string[];
  logo?: string;
}

export interface User {
  createdAt: Timestamp | FieldValue;
  company: {
    id: string;
    name: string;
  };
  email: string;
  name: {
    first: string;
    last: string;
  };
  dashboards: {
    id: string;
    title: string;
    type: string;
  }[];
  actions?: {
    createdAt: Timestamp | FieldValue;
    id: string;
    type: 'verifyDocuments';
    applicant: {
      email: string;
      name?: {
        first: string;
        last: string;
      };
    };
  }[];
}

export interface DraftDashboard {
  createdAt: Timestamp;
  createdBy: string;
  country: string;
  job: string;
  title: string;
  deadline: Timestamp;
  formContent?: {
    header: string;
    caption: string;
  };
  docs: { [key: string]: DashboardDoc };
  applicants?: string[];
  messages?: {
    opening: string;
  };
  isPublished: false;
}

export interface PublishedDashboard {
  createdAt: Timestamp;
  createdBy: string;
  country: string;
  job: string;
  title: string;
  deadline: Timestamp;
  formContent: {
    header: string;
    caption: string;
  };
  docs: { [key: string]: DashboardDoc };
  applicants: string[];
  messages: {
    opening: string;
  };
  isPublished: true;
  publishedAt: Timestamp;
  applicantsCount?: number;
  incompleteApplicantsCount?: number;
  completeApplicantsCount?: number;
  actionsCount?: number;
  messagesSentCount?: number;
}

export interface Dashboard {
  createdAt: Timestamp | FieldValue;
  title: string;
  options: {
    type: 'documentCollector';
    docs: {
      name: string;
      format: 'pdf' | 'jpeg';
      sample?: string;
    }[];
    messages: {
      opening: string;
      followUps: string[];
    };
  };
  users: {
    id: string;
    name: {
      first: string;
      last: string;
    };
  }[];
  company: {
    id: string;
    name: string;
  };
  applicantsCount?: number;
  incompleteApplicantsCount?: number;
  completeApplicantsCount?: number;
  actionsCount?: number;
  messagesSentCount?: number;
}

export interface Applicant {
  createdAt: Timestamp | FieldValue;
  email: string;
  name?: {
    first: string;
    last: string;
  };
  latestMessage?: {
    id: string;
    status: ApplicantDashboardMessageStatus;
    sentAt: Timestamp;
  };
  actions: {
    id: string;
    type: ActionsType;
  }[];
  dashboard: {
    id: string;
    status: ApplicantStatus;
    submittedAt?: Timestamp | FieldValue;
  };
  docIds: string[];
}

export interface ApplicantDoc {
  status: DocumentStatus;
  format: Formats;
}

export type ApplicantStatus = 'Not Submitted' | 'Incomplete' | 'Complete';

export type ApplicantDashboardMessageStatus =
  | 'Pending'
  | 'Delivered'
  | 'Not Delivered';

export type DocumentStatus =
  | 'Submitted'
  | 'Accepted'
  | 'Rejected'
  | 'Not Submitted';

export type PageStatus = 'Submitted' | 'Accepted' | 'Rejected';

export type AdminCheckStatus = 'Accepted' | 'Rejected' | 'Not Checked';

export interface Form {
  applicant: {
    id: string;
    status: ApplicantStatus;
    name?: {
      first: string;
      last: string;
    };
    email: string;
  };
  company: {
    id: string;
    logo?: string;
    name: string;
  };
  dashboard: {
    id: string;
    formContent: {
      header: string;
      caption: string;
    };
    deadline: Timestamp;
    job: string;
    country: string;
    messages: {
      opening: string;
    };
  };
  docs: { [key: string]: FormDoc };
}

export interface UpdatedForm extends Omit<Form, 'applicant'> {
  applicant: {
    id: string;
    status: ApplicantStatus;
    name: {
      first: string;
      last: string;
    };
  };
}

// Docs

export interface DashboardDoc {
  format: Formats;
  sample?: {
    file: string;
    contentType: string;
  };
  instructions?: string;
  docNumber: number;
}

export interface FormDoc extends DashboardDoc {
  name: string;
  status: DocumentStatus;
  systemTask: FormTask | null;
  pages?: { [key: string]: FormPage };
  deviceSubmitted?: 'mobile' | 'desktop';
}

export interface AdminCheckDoc
  extends Omit<FormDoc, 'pages' | 'deviceSubmitted'> {
  deviceSubmitted: 'mobile' | 'desktop';
  pages: { [key: string]: AdminCheckPage };
  adminCheckStatus: AdminCheckStatus;
}

export interface FormPage {
  name: string;
  status: PageStatus;
  pageNumber: number;
  submissionCount: number;
  submittedSize?: number;
  submittedFormat?: string;
  systemCheckStatus?: 'Accepted' | 'Rejected';
}

export interface AdminCheckPage
  extends Omit<
    FormPage,
    'systemCheckStatus' | 'submittedFormat' | 'submittedSize'
  > {
  submittedSize: number;
  submittedFormat: string;
  systemCheckStatus: 'Accepted' | 'Rejected';
  adminCheckStatus?: AdminCheckStatus;
}

export interface AdminCheck {
  createdAt: Timestamp;
  applicant: {
    name: {
      first: string;
      last: string;
    };
    id: string;
  };
  companyId: string;
  dashboard: {
    id: string;
    job: string;
    country: string;
    deadline: Timestamp;
  };
  formId: string;
  docs: { [key: string]: AdminCheckDoc };
  adminCheckStatus: AdminCheckStatus;
}

export interface WorkerDoc extends Omit<AdminCheckDoc, 'pages'> {
  createdAt: Timestamp;
  companyId: string;
  dashboardId: string;
  applicantId: string;
  adminCheckId: string;
  formId: string;
  pages: { [key: string]: AdminCheckPage };
}

// Lets make it doc

export interface Action {
  createdAt: Timestamp;
  applicant: {
    id: string;
    name: {
      first: string;
      last: string;
    };
  };
  workerDocId: string;
  doc: WorkerDoc;
  isComplete: boolean;
  competedBy?: {
    name: {
      first: string;
      last: string;
    };
    id: string;
  };
}

export interface Message {
  createdAt: Timestamp;
  subject: string;
  recipients: {
    email: string;
    type?: 'to' | 'cc' | 'bcc';
  }[];
  body: string;
  fromName?: string;
  metadata?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  updatedAt?: Timestamp;
  messageResponseData?: {
    id: string;
    status: string;
    rejectReason: string;
    analytics?: {
      opens?: number;
      clicks?: number;
      isSpam?: boolean;
    };
  };
}
