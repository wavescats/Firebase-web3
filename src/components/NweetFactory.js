import React, { useState } from "react";
import { dbService, storageService } from "../firebase";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

function NweetFactory({ userObj }) {
  const [nweet, setNweet] = useState("");
  const [attach, setAttach] = useState("");

  const onSubmit = async event => {
    if (nweet === "") {
      return;
    }
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
      <form className="factoryForm" onSubmit={onSubmit}>
        <div className="factoryInput__container">
          <input
            className="factoryInput__input"
            value={nweet}
            type="text"
            placeholder="What's on your mind?"
            maxLength={120}
            onChange={onChanges}
          />

          <input className="factoryInput__arrow" type="submit" value="Nweet" />
        </div>
        <label htmlFor="attach-file" className="factoryInput__label">
          <span>Add photos</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          id="attach-file"
          style={{
            opacity: 0,
          }}
        />
        {attach && (
          <div className="factoryForm__attachment">
            <img
              src={attach}
              alt=""
              style={{
                backgroundImage: attach,
              }}
            />
            <div className="factoryForm__clear" onClick={onClearImg}>
              <span>Remove</span>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default NweetFactory;
