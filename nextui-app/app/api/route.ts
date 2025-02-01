// export async function GET(request: Request) {

//     return new Response('오늘도 next.js');

// }

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const response = {
        message: 'get 메세지 받으세요',
        data: 'good'
    }
//   return new NextResponse('오늘도 nsetjs!!');
  return NextResponse.json(response, {status: 200});
}