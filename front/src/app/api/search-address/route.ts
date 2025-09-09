import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  const KAKAO_API_URL = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await fetch(KAKAO_API_URL, {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Kakao API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch from Kakao API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data.documents);
  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
