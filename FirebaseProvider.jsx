import React, { useEffect, useState } from 'react'
import firebase from 'firebase'

export const isBrowser = () => typeof window !== 'undefined'

export const FirebaseContext = React.createContext({
  isLoggedIn: 'unset',
  uid: 'unset',
  subscription: 'unset'
})

if (isBrowser()) {
  firebase.initializeApp({
    apiKey: 'AIzaSyDf6MRhO3ul_IOfx-MBInoG9LIV60mqkaI',
    authDomain: 'trustee-83b59.firebaseapp.com',
    databaseURL: 'https://trustee-83b59.firebaseio.com',
    projectId: 'trustee-83b59',
    storageBucket: 'trustee-83b59.appspot.com',
    messagingSenderId: '906920800941',
    appId: '1:906920800941:web:d8af9bdeff97eddf0e8c24',
    measurementId: 'G-69TW6QJDHQ'
  })
}

// eslint-disable-next-line react/prop-types
export const FirebaseProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState('unset')
  const [uid, setUid] = useState('unset')
  const [subscription, setSubscription] = useState('unset')
  const db = isBrowser() ? firebase.firestore() : null

  // useEffect(() => {
  //   if (window.location.hostname === 'localhost') {
  //     isBrowser() && db.useEmulator('localhost', 8080)
  //   }
  // }, [])

  // useEffect(() => {
  //   if (window.location.hostname === 'localhost') {
  //     isBrowser() && firebase.auth().useEmulator('http://localhost:9099/')
  //   }
  // }, [])

  async function getSubscription(userID) {
    const subscriptionsCollection = await db
      .collection('users')
      .doc(userID)
      .collection('subscriptions')
      .get()
    console.log('subs collection: ', subscriptionsCollection.docs)
    return subscriptionsCollection
  }

  useEffect(() => {
    if (uid !== null && uid !== 'unset') {
      const unsubscribe = db
        .collection('users')
        .doc(uid)
        .collection('subscriptions')
        .onSnapshot(snapshot => {
          console.log('setting subscription object... ')
          if (snapshot.docs[0]) {
            setSubscription(snapshot.docs[snapshot.docs.length - 1].data())
          }
        })
      return unsubscribe
    }
    return () => {}
  }, [uid])

  useEffect(() => {
    if (uid !== null && uid !== 'unset') {
      const unsubscribe = db
        .collection('users')
        .doc(uid)
        .collection('subscriptions')
        .onSnapshot(snapshot => {
          console.log('setting subscription object... ')
          if (snapshot.docs()[0]) {
            setSubscription(snapshot.docs()[snapshot.docs().length - 1].data())
          }
        })
      return unsubscribe()
    }
    return () => {}
  }, [uid])

  useEffect(() => {
    const observer = isBrowser()
      ? firebase.auth().onAuthStateChanged(user => {
          if (user) {
            setIsLoggedIn('yes')
            setUid(user.uid)
            getSubscription(user.uid).then(sub => {
              if (!sub.docs[0]) {
                setSubscription(null)
              } else {
                setSubscription(sub.docs[sub.docs.length - 1].data())
              }
            })
          } else {
            setIsLoggedIn('no')
            setUid(null)
          }
        })
      : () => {}
    return observer
  }, [])
  return <FirebaseContext.Provider value={{ isLoggedIn, uid, subscription }}>{children}</FirebaseContext.Provider>
}

// eslint-disable-next-line react/prop-types
export default ({ element }) => <FirebaseProvider>{element}</FirebaseProvider>
