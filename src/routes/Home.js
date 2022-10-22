import {
  collection,
  // getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import React, { useEffect, useState } from "react";

import Nweet from "../components/Nweet";
import NweetFactory from "../components/NweetFactory";
import { dbService } from "../firebase";

function Home({ userObj }) {
  const [nweets, setNweets] = useState([]);

  // 방법 #1
  // const getNweets = async () => {
  //   const dbNweets = query(collection(dbService, "nweets"));
  //   const getDb = await getDocs(dbNweets);
  //   getDb.forEach(doc => {
  //     const obj = {
  //       ...doc.data(),
  //       id: doc.id,
  //     };
  //     setNweets(prev => [obj, ...prev]);
  //   });
  // };

  // 방법 #2
  useEffect(() => {
    const Arr = query(collection(dbService, "nweets"), orderBy("createdAt"));
    onSnapshot(Arr, snaps => {
      const newArr = snaps.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setNweets(newArr);
    });
  }, []);

  return (
    <div className="container all_container">
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {nweets.map(nw => {
          return (
            <Nweet
              key={nw.id}
              nweetObj={nw}
              isOnwer={nw.creatorId === userObj.uid}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Home;
