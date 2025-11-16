/**
 * Navigation Type Definitions
 */

// Auth Stack
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  RoleSelection: undefined;
};

// Client Stack
export type ClientStackParamList = {
  ClientHome: undefined;
  BosProfile: { bosId: string };
  MyRequests: undefined;
  JobRequestCreate: undefined;
  Profile: undefined;
};

// Bòs Stack
export type BosStackParamList = {
  BosDashboard: undefined;
  BosProfileEdit: undefined;
  JobRequestsList: undefined;
  JobRequestDetail: { jobRequestId: string };
  Profile: undefined;
};

// Root Stack
export type RootStackParamList = {
  Auth: undefined;
  ClientMain: undefined;
  BosMain: undefined;
};
