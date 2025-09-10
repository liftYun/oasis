import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ code: 400, message: 'Query is required' }, { status: 400 });
  }

  const KAKAO_API_URL = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
    query
  )}`;

  try {
    const apiKey = process.env.KAKAO_REST_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { code: 500, message: 'KAKAO_REST_API_KEY is not configured' },
        { status: 500 }
      );
    }
    const response = await fetch(KAKAO_API_URL, {
      headers: { Authorization: `KakaoAK ${apiKey}` },
      cache: 'no-store',
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Kakao API Error:', errorData);
      return NextResponse.json(
        { code: response.status, message: 'Failed to fetch from Kakao API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const results = (data.documents ?? [])
      .map((d: any) => {
        const zoneNo = d.road_address?.zone_no ?? d.address?.zip_code ?? '';
        return {
          address_name: d.address_name ?? d.address?.address_name ?? '',
          road_address_name: d.road_address?.address_name ?? '',
          zone_no: zoneNo,
        };
      })
      .filter((r: any) => !!r.zone_no);

    // 우리 앱의 표준 응답 형식으로 래핑
    return NextResponse.json({
      code: 200,
      message: 'Success',
      body: results,
    });
  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ code: 500, message: 'Internal Server Error' }, { status: 500 });
  }
}
