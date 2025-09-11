export interface AddressSearchResult {
  address_name: string; // 전체 지번 주소
  road_address_name: string; // 전체 도로명 주소
  zone_no: string; // 우편번호
  address_name_eng?: string; // 영문 지번 주소(있다면)
  road_address_name_eng?: string; // 영문 도로명 주소(있다면)
}
