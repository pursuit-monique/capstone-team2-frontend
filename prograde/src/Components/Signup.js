import React, { useRef, useState } from 'react';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../Contexts/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';

function isStrongPassword(password) {
  // Minimum 6 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
}

const Signup = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get the navigate function from React Router
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    // Check if passwords match and meet strength requirements
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }

    if (!isStrongPassword(passwordRef.current.value)) {
      return setError('Password is too weak. It should meet strength requirements.');
    }

    setError('');
    setLoading(true);

    try {
      const errorMessage = await signup(emailRef.current.value, passwordRef.current.value);
      if (errorMessage) {
        setError(errorMessage);
      } else {
        // Signup was successful, navigate to '/dashboard' or another route
        navigate('/dashboard'); // Change to your desired route
      }
    } catch {
      setError('Failed to create an account');
    }

    setLoading(false);
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up for Prograde</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email:</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password:</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
              <small className="text-muted">
                Password should be at least 6 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.
              </small>
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Confirm Password:</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have a Prograde account? <Link to="/login">Log In</Link>
      </div>
    </>
  );
};

export default Signup;
