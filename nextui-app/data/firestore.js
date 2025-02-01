// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // const firebaseConfig = {
// //   apiKey: "AIzaSyAkRp8ADyrA_pUo2b7rkxbVfHGif3o5gy8",
// //   authDomain: "next-todo-a50b0.firebaseapp.com",
// //   projectId: "next-todo-a50b0",
// //   storageBucket: "next-todo-a50b0.firebasestorage.app",
// //   messagingSenderId: "279630293441",
// //   appId: "1:279630293441:web:e899ad2566d4dd1ddf2740"
// // };

// const firebaseConfig = {
//     apiKey: process.env.API_KEY,
//     authDomain: process.env.AUTH_DOMAIN,
//     projectId: process.env.PROJECT_ID,
//     storageBucket: process.env.STORAGE_BUCKET,
//     messagingSenderId: process.env.MESSAGE_SENDER_ID,
//     appId: process.env.APP_ID,
//   };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, getDoc, doc, setDoc,
     Timestamp, deleteDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGE_SENDER_ID,
    appId: process.env.APP_ID,
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 모든 할일 가져오기
export async function fetchTodos() { // collection(db, "데이터 베이스")

    const querySnapshot = await getDocs(collection(db, "todos"));

    if( querySnapshot.empty){
        return [];
    }

    const fetchTodes = [];

    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());

        const aTodo = {
            id: doc.id,
            title: doc.data()["title"],
            is_done: doc.data()["is_done"],
            // 한국어 시간대로 받아오기
            // created_at: doc.data()["created_at"].toDate().toLocaleTimeString('ko'),
            created_at: doc.data()["created_at"].toDate(),
        }
        fetchTodes.push(aTodo);
    });
    return fetchTodes;
}

// 할일 추가가
export async function addATodo({ title }) { // collection(db, "데이터 베이스")

    // Add a new document with a generated id
    const newTodeRef = doc(collection(db, "todos"));

    const createdAtTimestamp = Timestamp.fromDate(new Date());

    const newTodoData = {
        id: newTodeRef.id,
        title: title,
        is_done: false,
        created_at:createdAtTimestamp,
    }

    // later...
    await setDoc(newTodeRef, newTodoData);

   // return newTodoData;
    return {
        id: newTodeRef.id,
        title: title,
        is_done: false,
        created_at: createdAtTimestamp.toDate(),
    };
}

// 단일 할일 조회
export async function fetchATodo(id) { // collection(db, "데이터 베이스")

    if (id === null){
        return null;
    }

    const todoDocRef = doc(db, "todos", id);
    const tododocSnap = await getDoc(todoDocRef);

    if (tododocSnap.exists()) {
        console.log("Document data:", tododocSnap.data());

        const fetchTodo = {
            id: tododocSnap.id,
            title: tododocSnap.data()["title"],
            is_done: tododocSnap.data()["is_done"],
            // 한국어 시간대로 받아오기
            // created_at: doc.data()["created_at"].toDate().toLocaleTimeString('ko'),
            created_at: tododocSnap.data()["created_at"].toDate(),
        }
        return fetchTodo;

    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        return null;
    }
}

// 단일 할일 삭제
export async function deleteATodo(id) { // collection(db, "데이터 베이스") 
   const fetchedTodo = await fetchATodo(id);

   if(fetchedTodo === null){
    return null;
   }

   await deleteDoc(doc(db, "todos", id));
   return fetchedTodo;
}

// 단일 할일 수정정
// 첫번쩨 단일 변수 받기 두번째 json 형식으로 데이터 받기
export async function editATodo(id, { title, is_done }) {
    try {
        // id로 할 일을 가져옴
        const fetchedTodo = await fetchATodo(id);

        if (fetchedTodo === null) {
            // 해당 id에 할 일이 없을 경우 null 반환
            return null;
        }

        // Firestore에서 해당 문서 참조 가져오기
        const todoRef = doc(db, "todos", id);

        // Firestore 문서 업데이트
        await updateDoc(todoRef, {
            title: title,
            is_done: is_done,
        });

        // 업데이트된 데이터 반환
        return {
            id: id,
            title: title,
            is_done: is_done,
            created_at: fetchedTodo.created_at,
        };
    } catch (error) {
        console.error("Error updating todo:", error);
        throw new Error("할일 업데이트 중 문제가 발생했습니다.");
    }
}


module.exports = { fetchTodos, addATodo, fetchATodo, deleteATodo, editATodo }
