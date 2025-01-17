import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, db } from "../config/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';


const AuthModal = ({ show, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [userComments, setUserComments] = useState([]);
  const [userThreads, setUserThreads] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }

        const commentsRef = collection(db, "comments");
        const commentsQuery = query(commentsRef, where("userId", "==", user.uid));
        const commentsSnapshot = await getDocs(commentsQuery);
        setUserComments(commentsSnapshot.docs.map(doc => doc.data()));

        const threadsRef = collection(db, "threads");
        const threadsQuery = query(threadsRef, where("userId", "==", user.uid));
        const threadsSnapshot = await getDocs(threadsQuery);
        setUserThreads(threadsSnapshot.docs.map(doc => doc.data()));
      }
    };

    fetchUserData();
  }, [user]);

  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
      navigate('/landing');
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
      navigate('/landing');
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{user ? `Welcome, ${user.email}` : "Sign In"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user ? (
          <>
            <img src={userProfile.profilePhoto} alt="Profile" />
            <h3>Your Comments:</h3>
            <ul>
              {userComments.map((comment, index) => (
                <li key={index}>{comment.text}</li>
              ))}
            </ul>
            <h3>Your Threads:</h3>
            <ul>
              {userThreads.map((thread, index) => (
                <li key={index}>{thread.title}</li>
              ))}
            </ul>
          </>
        ) : (
          <Form>
            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        {user ? (
          <Button variant="danger" onClick={handleSignOut}>
            Logout
          </Button>
        ) : (
          <>
            <Button variant="secondary" onClick={handleSignIn}>
              Sign In
            </Button>
            <Button variant="primary" onClick={handleSignInWithGoogle}>
              Sign In with Google
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AuthModal;
