import React, { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./Components/Auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { Button, Form, InputGroup, Card } from "react-bootstrap";

function App() {
  const [commentList, setCommentList] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [isNewCommentImportant, setIsNewCommentImportant] = useState(false);
  const [updatedCommentContent, setUpdatedCommentContent] = useState("");
  const [fileUpload, setFileUpload] = useState(null);

  const commentsCollectionRef = collection(db, "comments");

  const getCommentList = async () => {
    try {
      const data = await getDocs(commentsCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCommentList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCommentList();
  }, []);

  const onSubmitComment = async () => {
    try {
      await addDoc(commentsCollectionRef, {
        content: newCommentContent,
        important: isNewCommentImportant,
        userId: auth?.currentUser?.uid,
      });
      getCommentList();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComment = async (id) => {
    const commentDoc = doc(db, "comments", id);
    await deleteDoc(commentDoc);
    getCommentList();
  };

  const updateCommentContent = async (id) => {
    const commentDoc = doc(db, "comments", id);
    await updateDoc(commentDoc, { content: updatedCommentContent });
    getCommentList();
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(
      storage,
      `projectFiles/${fileUpload.name}`
    );
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <Auth />

      <div>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Comment content..."
            onChange={(e) => setNewCommentContent(e.target.value)}
          />
          <InputGroup.Checkbox
            checked={isNewCommentImportant}
            onChange={(e) => setIsNewCommentImportant(e.target.checked)}
          />
          <InputGroup.Text>Important</InputGroup.Text>
        </InputGroup>
        <Button onClick={onSubmitComment}>Submit Comment</Button>
      </div>
      <div>
        {commentList.map((comment) => (
          <Card key={comment.id}>
            <Card.Body>
              <Card.Title>
                {comment.title}
              </Card.Title>
              <Card.Text>
                {comment.content}
              </Card.Text>
              <Button onClick={() => deleteComment(comment.id)}>
                Delete Comment
              </Button>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="New content..."
                  onChange={(e) => setUpdatedCommentContent(e.target.value)}
                />
                <Button onClick={() => updateCommentContent(comment.id)}>
                  Update Comment Content
                </Button>
              </InputGroup>
            </Card.Body>
          </Card>
        ))}
      </div>
      <div>
        <Form.Control
          type="file"
          onChange={(e) => setFileUpload(e.target.files[0])}
        />
        <Button onClick={uploadFile}>Upload File</Button>
      </div>
    </div>
  );
}

export default App;
