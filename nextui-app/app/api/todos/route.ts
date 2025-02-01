// export async function GET(request: Request) {

//     return new Response('오늘도 next.js');

// }

// import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//     const response = {
//         message: 'todes 몽당 가져오기',
//         data: ['Todos','Good']
//     }
// //   return new NextResponse('오늘도 nsetjs!!');
//   return NextResponse.json(response, {status: 200});
// }

import { NextRequest, NextResponse } from "next/server";
import dummyTodos from "@/data/dummy.json"
import { fetchTodos, addATodo } from '@/data/firestore'

// 모든 할일 가져오기
export async function GET(request: NextRequest) {

    const fetchedTodos = await fetchTodos();
    const response = {
        message: 'todes 몽당 가져오기',
        //data: dummyTodos
        data: fetchedTodos
    }
//   return new NextResponse('오늘도 nsetjs!!');
  return NextResponse.json(response, {status: 200});
}

// 할일 추가
export async function POST(request: NextRequest) {

  const {title, is_done} = await request.json();

  if(title === undefined){
    const errMessage = {
      message: '할일을 작성해주세요.'
    }
    return NextResponse.json(errMessage, {status: 422});
  }

  const addedTodo = await addATodo({ title });
  // const data = await request.json();

  // const newTodo = {
  //   id: "11",
  //   title,
  //   is_done: false
  // }
  const response = {
    message: '할일 추가 성공!',
    data: addedTodo
  }
 
  // return Response.json(data);
  return Response.json(response, { status: 201 });
}