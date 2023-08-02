import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot ,doc, deleteDoc,updateDoc  } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";


const firebaseConfig = {

};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const ids = [];
const getData = () => {
    var list = document.getElementById("list");
    onSnapshot(collection(db, "Todos"), (data) => {
        data.docChanges().forEach((change) => {
            ids.push(change.doc.id)
            if(change.type === "removed"){
            const dTodo = document.getElementById(change.doc.id)
            dTodo.remove()
            console.log(change.doc.id)
        }else if(change.type === "added"){
            list.innerHTML += `
                      <li id = ${change.doc.id}>
                       <input class='todo-input' type='text' value='${change.doc.data().Value}' disabled/>
                       ${change.doc.data().Time}
                       <button onclick='delTodo("${change.doc.id}")'>Delete</button> 
                       <button onclick='editTodo(this,"${change.doc.id}")'>Edit</button>
                      </li>
                      `
                    }
        })
    })
}
getData()


async function addTodo() {

    var todo = document.getElementById("todo");
    var date = new Date()

    const docRef = await addDoc(collection(db, "Todos"), {
        Value: todo.value,
        Time: date.toLocaleString()
    });
    console.log("Document written with ID: ", docRef.id);
    todo.value = ""
}


async function delTodo(id) {
    await deleteDoc(doc(db, "Todos", id));

}

var edit = false;
async function editTodo(e,id) {

    if (edit) {
        await updateDoc(doc(db, "Todos",id ),{
            Value:e.parentNode.childNodes[1].value
    })
        e.parentNode.childNodes[1].disabled = true;
        e.parentNode.childNodes[1].blur()
        e.parentNode.childNodes[5].innerHTML = "Edit"
        edit = false;
    } else {
        e.parentNode.childNodes[1].disabled = false;
        e.parentNode.childNodes[1].focus()
        e.parentNode.childNodes[5].innerHTML = "Update"
        edit = true;

    }
}


 function  deleteAll() {
    const arr = []
ids.forEach (async element => {
    await deleteDoc(doc(db, "Todos", element));
});
Promise.all(arr) 
.then((res)=>{
console.log("All Data Deleted")
})
.catch((err)=>{
console.log(err)
})
}


// console.log(moment(new Date("Thu May 25 2023 21:45:23 GMT+0500 (Pakistan Standard Time)"), "YYYYMMDD").fromNow())



window.addTodo = addTodo;
window.delTodo = delTodo;
window.editTodo = editTodo;
window.deleteAll = deleteAll;
