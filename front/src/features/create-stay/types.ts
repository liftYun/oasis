export interface KakaoAddressResponse {
  zonecode: string;
  roadAddress: string;
  roadAddressEnglish: string;
  address: string;
  addressEnglish: string;
  jibunAddress: string;
  jibunAddressEnglish: string;
  bcode: string; // 행정구역 코드
  bname: string;
  bnameEnglish: string;
}

export type CreateStayTexts = {
  createStay: string;
  header: {
    searchTitle: string;
  };
  common: {
    next: string;
    processing: string;
    tip: string;
    back: string;
  };
  step1: {
    title: string;
  };
  form: {
    titleLabel: string;
    titlePlaceholder: string;
    addressLabel: string;
    addressSearchAria: string;
    addressSearchPlaceholder: string;
    addressPostalCodePlaceholder: string;
    addressAddressPlaceholder: string;
    addressDetailPlaceholder: string;
    priceLabel: string;
    pricePlaceholder: string;
    imagesLabel: string;
    imagesTipTitle: string;
    imagesTipText: string;
    imagesUploadCta: string;
    imagesPreviewAlt: string;
    imagesDeleteAria: string;
    maxGuestLabel?: string;
    maxGuestPlaceholder?: string;
  };
  step2: {
    title: string;
    tipTitle: string;
    tipText: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
  };
  step3: {
    title: string;
    subtitle: string;
    loading: string;
  };
  categories: {
    bathroom: string;
    bedroom: string;
    kitchen: string;
    convenience: string;
    around: string;
  };
  step4: {
    title: string;
    subtitle: string;
    unavailLabel: string;
    placeholder: string;
    placeholderSelected: string;
    openCalendarAria: string;
  };
  searchAddress: {
    headerTitle: string;
    placeholder: string;
    error: string;
    noResults: string;
    examplesTitle: string;
    exampleRoad: string;
    exampleDong: string;
    jibunLabel: string;
    selectAriaSuffix: string;
  };
  errors: {
    titleRequired: string;
    titleMax: string;
    titleEngRequired: string;
    titleEngMax: string;
    descriptionRequired: string;
    descriptionEngRequired: string;
    postalCodeRequired: string;
    addressRequired: string;
    addressEngRequired: string;
    addressDetailRequired: string;
    addressDetailEngRequired: string;
    subRegionRequired: string;
    priceType: string;
    pricePositive: string;
    priceInvalid: string;
    priceDecimal: string;
    maxGuestType: string;
    maxGuestPositive: string;
    maxGuestInt: string;
    imagesMin: string;
    imagesMax: string;
    fileSizeMax: string;
    fileType: string;
  };
};
