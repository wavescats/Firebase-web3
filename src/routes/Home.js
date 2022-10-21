import {
  addDoc,
  collection,
  // getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import Nweet from "../components/Nweet";
import { dbService, storageService } from "../firebase";

function Home({ userObj }) {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attach, setAttach] = useState("");

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

  const onSubmit = async event => {
    event.preventDefault();
    let attachUrl = "";
    if (attach !== "") {
      const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
      const response = await uploadString(fileRef, attach, "data_url");
      attachUrl = await getDownloadURL(response.ref);
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachUrl,
    };
    await addDoc(collection(dbService, "nweets"), nweetObj);
    setNweet("");
    setAttach("");
  };

  const onChanges = event => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  // 이미지 미리보기
  const onFileChange = event => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    if (theFile) {
      reader.onloadend = finisheed => {
        const {
          target: { result },
        } = finisheed;
        setAttach(result);
      };
      reader.readAsDataURL(theFile);
    }
  };

  const onClearImg = () => {
    setAttach("");
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
          onChange={onChanges}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {attach && (
          <div>
            <img src={attach} alt="" width="50px" height="50px" />
            <button onClick={onClearImg}>Clear</button>
          </div>
        )}
      </form>

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
  );
}

export default Home;
