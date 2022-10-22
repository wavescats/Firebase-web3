import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";
import { dbService, storageService } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

function Nweet({ nweetObj, isOnwer }) {
  const [editing, setEditing] = useState(false);

  // 각 게시물 내용
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  // 각 게시물의 아이디
  let nweetDb = doc(dbService, "nweets", `${nweetObj.id}`);

  // 삭제기능
  const onDelete = async () => {
    await deleteDoc(nweetDb);
    if (nweetObj.attachUrl !== "") {
      await deleteObject(ref(storageService, nweetObj.attachUrl));
    }
  };

  // false true 토글스위치
  const toggleEdit = () => {
    setEditing(prev => !prev);
  };

  // 수정 업데이트 기능
  const onSubmits = async event => {
    event.preventDefault();
    await updateDoc(nweetDb, {
      text: newNweet,
    });
    setEditing(false);
  };

  // target value 값
  const onChanges = event => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  return (
    <div className="nweet">
      {editing ? (
        <>
          {isOnwer && (
            <>
              <form onSubmit={onSubmits} className="container nweetEdit">
                <input
                  className="formInput"
                  type="text"
                  placeholder="Edit your nweet"
                  value={newNweet}
                  required
                  autoFocus
                  onChange={onChanges}
                />
                <input className="formBtn" type="submit" value="Update!" />
              </form>
              <button className="formBtn cancelBtn" onClick={toggleEdit}>
                Cancel
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachUrl && <img src={nweetObj.attachUrl} alt="" />}
          {isOnwer && (
            <div className="nweet__actions">
              <span onClick={onDelete}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEdit}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Nweet;
