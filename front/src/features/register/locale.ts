import type { RegisterTexts } from '@/features/register';

export const registerMessages: Record<'ko' | 'en', RegisterTexts> = {
  ko: {
    title: '서비스에서 사용할 \n 닉네임을 정해주세요.',
    subtitle: '보안상 닉네임 변경이 불가능합니다.',
    nicknamePlaceholder: '닉네임',
    nicknameGuide: '닉네임은 2~10자 사이여야 합니다.',
    confirm: '확인',
    errorEmpty: '닉네임을 입력해주세요.',
    errorLength: '닉네임은 2~10자 사이여야 합니다.',
    checkTitle: '입력한 정보가 올바른지 \n 확인해주세요.',
    emailLabel: '이메일',
    imageLabelBefore: '추가',
    imageLabelAfter: '변경',
  },
  en: {
    title: 'Set a nickname \nto use in the service.',
    subtitle: 'For security, nickname cannot be changed later.',
    nicknamePlaceholder: 'Nickname',
    nicknameGuide: 'Nickname must be 2–10 characters long.',
    confirm: 'Confirm',
    errorEmpty: 'Please enter a nickname.',
    errorLength: 'Nickname must be 2–10 characters.',
    checkTitle: 'Please confirm that the information you entered is correct.',
    emailLabel: 'Email',
    imageLabelBefore: 'Add',
    imageLabelAfter: 'Change',
  },
};
