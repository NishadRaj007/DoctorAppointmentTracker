import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the type for the stack parameter list
export type RootStackParamList = {
  DoctorSignUp: undefined;
  PatientSignUp: undefined;
  DoctorDashboard:  { userType: string };
  PatientDashboard:  { userType: string, hospital: string; doctorName: string; currentStatus: number, isLive: boolean, userId: string };
  HomeScreen: undefined;
  DoctorLogin: undefined;
  PatientLogin: undefined;
  PatientCheckStatus: undefined;
  DoctorSelection:undefined;
  SettingScreen: undefined;
  EditProfileScreen: undefined;
  GeneralSettingsScreen: undefined;
  TimerSettingsScreen: undefined;
  FeedbackScreen: undefined;
  ForgotPassword: undefined;

  ChatsSettings: undefined;
  NotificationSettings: undefined;
  About: undefined;
  Account: undefined;
  UploadAndShowImages: { folderId: string, folderName: string };
};

// Define the type for the screen props
export type DoctorSignUpProps = {navigation: StackNavigationProp<RootStackParamList, 'DoctorSignUp'>;};
export type DoctorLoginProps = {navigation: StackNavigationProp<RootStackParamList, 'DoctorLogin'>;};
export type PatientLoginProps = {navigation: StackNavigationProp<RootStackParamList, 'PatientLogin'>;};
export type PatientSignUpLoginProps = {navigation: StackNavigationProp<RootStackParamList, 'PatientSignUp'>;};
export type DoctorDashboardProps = {navigation: StackNavigationProp<RootStackParamList, 'DoctorDashboard'>,route: RouteProp<RootStackParamList, 'DoctorDashboard'>}; 
export type PatientDashboardProps = {navigation: StackNavigationProp<RootStackParamList, 'PatientDashboard'>,route: RouteProp<RootStackParamList, 'PatientDashboard'>}; 
export type PatientCheckStatusProps = {navigation: StackNavigationProp<RootStackParamList, 'PatientCheckStatus'>;};
export type HomeScreenProps = {navigation: StackNavigationProp<RootStackParamList, 'HomeScreen'>;};
export type DoctorSelectionProps = {navigation: StackNavigationProp<RootStackParamList, 'DoctorSelection'>;};
export type SettingProps= {navigation: StackNavigationProp<RootStackParamList, 'SettingScreen'>;};
export type EditProfileScreenProps= {navigation: StackNavigationProp<RootStackParamList, 'EditProfileScreen'>;};
export type TimerSettingsScreenProps= {navigation: StackNavigationProp<RootStackParamList, 'TimerSettingsScreen'>;};
export type FeedbackScreenProps= {navigation: StackNavigationProp<RootStackParamList, 'FeedbackScreen'>;};
export type ForgotPasswordProp= {navigation: StackNavigationProp<RootStackParamList, 'ForgotPassword'>;};

export type GeneralSettingsProps= {navigation: StackNavigationProp<RootStackParamList, 'GeneralSettingsScreen'>;};


export type ChatsSettingScreenProps= {navigation: StackNavigationProp<RootStackParamList, 'ChatsSettings'>;};
export type NotificationSettingsScreenProps= {navigation: StackNavigationProp<RootStackParamList, 'NotificationSettings'>;};
export type AboutScreenProps= {navigation: StackNavigationProp<RootStackParamList, 'About'>;};
export type AccountScreenProps= {navigation: StackNavigationProp<RootStackParamList, 'Account'>;};
export type UploadAndShowImagesProps= {navigation: StackNavigationProp<RootStackParamList, 'UploadAndShowImages'>;};

