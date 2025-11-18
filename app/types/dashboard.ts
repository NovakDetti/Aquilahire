export type CvItem = {
  id: string;
  name: string;
  language: "hu" | "en";
  createdAt: string;
};

export type InterviewItem = {
  id: string;
  cvName: string;
  role: string;
  date: string;
  status: "scheduled" | "finished" | "draft";
  score?: number;
};

export type UserInfo = {
  id: string;
  name: string;
  email: string;
  memberSince: string;
};

export type UserSettings = {
  plan: "Starter" | "Pro" | "Premium";
  emailNotif: boolean;
  newsletter: boolean;
};

export type UserStats = {
  remainingThisMonth: number;
  totalInterviews: number;
  avgScore: number;
};

export type UserAdminData = {
  user: UserInfo;
  settings: UserSettings;
  stats: UserStats;
  cvs: CvItem[];
  interviews: InterviewItem[];
};
