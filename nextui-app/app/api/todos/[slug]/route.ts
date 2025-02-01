// export async function GET(request: Request) {

//     return new Response('오늘도 next.js');

// }

import { NextRequest, NextResponse } from "next/server";
import { fetchATodo, deleteATodo, editATodo } from "@/data/firestore";

// 할일 단일 조회
export async function GET(request: NextRequest, 
   { params }: { params: { slug: string } }) {
    // { params }: { params: { id: string } }) {

    //const searchParams = useSearchParams()
    const searchParams = request.nextUrl.searchParams;
    // const search = searchParams.get('search')
    const query = searchParams.get('query')
    
    // URL -> `/dashboard?search=my-project`
    // `search` -> 'my-project'

    const fetchedTodo = await fetchATodo(params.slug);

    if( fetchedTodo === null ) {
      return new Response( null, {status : 204});
    }

    const response = {
        message: '단일 할일 가져오기 성공!',
        // data: {
        //   // id: params.id,
        //   id: params.slug,
        //   title: '1주차',
        //   is_done: false,
        //   query: query
        // }
        data: fetchedTodo
    }
//   return new NextResponse('오늘도 nsetjs!!');
  return NextResponse.json(response, {status: 200});
}

// 할일 단일 수정 id 존재
export async function POST(request: NextRequest, 
  // { params }: { params: { slug: string } }) {
    { params }: { params: { slug: string } }) {

      const {title, is_done} = await request.json();

      const editeTodo = await editATodo(params.slug, { title, is_done} );

      if( editeTodo === null ) {
        return new Response( null, {status : 204});
      }

      const response = {
        message: '단일 할일 수정 성공!',
        data: editeTodo
    }
//   return new NextResponse('오늘도 nsetjs!!');
  return NextResponse.json(response, {status: 200});
}

// 할일 단일 삭제
export async function DELETE(
  request: NextRequest, 
  { params }: { params: { slug: string } }
) {
  // 오타 수정: deleedTodo -> deletedTodo
  const deletedTodo = await deleteATodo(params.slug);

  if (deletedTodo === null) {
    // 삭제할 할 일이 없을 경우 204 상태 반환
    return new Response(null, { status: 204 });
  }

  const response = {
    message: '단일 할일 삭제 성공!',
    data: deletedTodo,
  };

  // JSON 응답 반환
  return NextResponse.json(response, { status: 200 });
}
