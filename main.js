import "./style.css";
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import firebaseConfig from './firebase.config';

// auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

auth.onAuthStateChanged(function (user) {
  if (user) {
    document.querySelector('#login-page').style.display = 'none'
    document.querySelector('#dashboard-page').style.display = 'block'
    document.querySelector('#current-user').innerHTML = `Hello ${user.displayName}`
  } else {
    document.querySelector('#login-page').style.display = 'block'
    document.querySelector('#dashboard-page').style.display = 'none'
  }
});

document.querySelector('#btn-sign-in').addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log('login success');
    }).catch((error) => {
      console.log(error)
      alert("error happend check console")
    });
})
document.querySelector('#btn-logout').addEventListener('click', () => {
  signOut(auth).then(() => {
    console.log('logout success');
  }).catch((error) => {
    console.log(error)
    alert("error happend check console")
  });
})


// for test only
document.querySelector('#btn-add-data').addEventListener('click', () => {
  writeUserData(document.querySelector('#input-temp').value)
})


// database
const db = getDatabase();
const tempRef = ref(db, 'temp')

function writeUserData(temp) {
  const newTempRef = push(tempRef);
  set(newTempRef, {
    temp: temp,
    date: (new Date()).toISOString()
  });
}


const tbody = document.querySelector('tbody')


onValue(tempRef, (snapshot) => {
  const data = snapshot.val()
  

  tbody.innerHTML = ''
  Object.keys(data).reverse().forEach((key) => {
    const row = document.createElement('tr')
    row.innerHTML = `<td>${data[key].date}</td><td>${data[key].temp}</td><td>${data[key].mac}</td>`
    tbody.appendChild(row)
  })
  
  document.querySelector('#current-temp').innerHTML = data[Object.keys(data).reverse()[0]].temp
});
