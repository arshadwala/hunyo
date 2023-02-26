import { collection, doc, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from 'src/boot/firebase';
import {
  Company,
  Invite,
  User,
  Applicant,
  Form,
  DraftDashboard,
  PublishedDashboard,
  AdminCheck,
} from './types';

const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    return snap.data() as T;
  },
});

export const dbColRefs = {
  companies: collection(db, 'companies').withConverter(converter<Company>()),
  invites: collection(db, 'invites').withConverter(converter<Invite>()),
  forms: collection(db, 'forms').withConverter(converter<Form>()),
  adminChecks: collection(db, 'adminChecks').withConverter(
    converter<AdminCheck>()
  ),
  getUsersRef: (companyId: string) =>
    collection(db, 'companies', companyId, 'users').withConverter(
      converter<User>()
    ),
  getDraftDashboardsRef: (companyId: string) =>
    collection(db, 'companies', companyId, 'dashboards').withConverter(
      converter<DraftDashboard>()
    ),
  getPublishedDashboardsRef: (companyId: string) =>
    collection(db, 'companies', companyId, 'dashboards').withConverter(
      converter<PublishedDashboard>()
    ),
  getApplicantsRef: (companyId: string, dashboardId: string) =>
    collection(
      db,
      'companies',
      companyId,
      'dashboards',
      dashboardId,
      'applicants'
    ).withConverter(converter<Applicant>()),
};

export const dbDocRefs = {
  getCompanyRef: (companyId: string) =>
    doc(db, 'companies', companyId).withConverter(converter<Company>()),
  getFormRef: (formId: string) =>
    doc(db, 'forms', formId).withConverter(converter<Form>()),
  getAdminCheckRef: (adminCheckId: string) =>
    doc(db, 'adminChecks', adminCheckId).withConverter(converter<AdminCheck>()),
  getUserRef: (companyId: string, userId: string) =>
    doc(db, 'companies', companyId, 'users', userId).withConverter(
      converter<User>()
    ),
  getInviteRef: (inviteId: string) =>
    doc(db, 'invites', inviteId).withConverter(converter<Invite>()),
  getDraftDashboardRef: (companyId: string, dashboardId: string) =>
    doc(db, 'companies', companyId, 'dashboards', dashboardId).withConverter(
      converter<DraftDashboard>()
    ),
  getPublishedDashboardRef: (companyId: string, dashboardId: string) =>
    doc(db, 'companies', companyId, 'dashboards', dashboardId).withConverter(
      converter<PublishedDashboard>()
    ),
  getApplicantRef: (
    companyId: string,
    dashboardId: string,
    applicantId: string
  ) =>
    collection(
      db,
      'companies',
      companyId,
      'dashboards',
      dashboardId,
      'applicants',
      applicantId
    ).withConverter(converter<Applicant>()),
};
