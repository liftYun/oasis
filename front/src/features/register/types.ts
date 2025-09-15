export type Lang = 'ko' | 'en';

export type RegisterTexts = {
  title: string;
  subtitle: string;
  nicknamePlaceholder: string;
  nicknameGuide: string;
  confirm: string;
  errorEmpty: string;
  errorLength: string;
  checkTitle: string;
  emailLabel?: string;
  imageLabelBefore?: string;
  imageLabelAfter?: string;
  roleTitle: string;
  roleSubtitle: string;
  guestRole: string;
  guestDescription: string;
  hostRole: string;
  hostDescription: string;
  hostTitle: string;
  hostSubtitle: string;
  hostImage: string;
  hostImageGuide: string;
  moneyTitle: string;
  moneySubTitle: string;
  moneyModalTitle: string;
  moneyModalDescription: string;
  back: string;
  successLogin: string;
};

export type Step = 'nickname' | 'check' | 'role' | 'done';
export type Role = 'guest' | 'host' | null;

export type RegisterData = {
  nickname: string;
  email?: string | null;
  role: Role;
};

export type RegisterState = {
  step: Step;
  data: RegisterData;
  setNickname: (v: string) => void;
  setEmail: (v: string | null) => void;
  setRole: (v: Role) => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
};
