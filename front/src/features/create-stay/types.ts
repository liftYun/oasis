export interface AddressSearchResult {
  address_name: string; // 전체 지번 주소
  road_address_name: string; // 전체 도로명 주소
  zone_no: string; // 우편번호
  address_name_eng?: string; // 영문 지번 주소(있다면)
  road_address_name_eng?: string; // 영문 도로명 주소(있다면)
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
