import React, { useRef, useState } from 'react';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../Contexts/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';

function isStrongPassword(password) {
  // Minimum 6 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
}

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get the navigate function from React Router
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    setError('');
    setLoading(true);

    // Check if passwords match
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Validate the password strength before attempting to log in
      if (!isStrongPassword(passwordRef.current.value)) {
        setError('Password is too weak. It should meet strength requirements.');
        setLoading(false);
        return;
      }

      await login(emailRef.current.value, passwordRef.current.value);
      // Use navigate to change the route on successful login
      navigate('/dashboard'); // Change to your desired route
    } catch {
      setError('Failed to log in');
    }

    setLoading(false);
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log In to Prograde</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email:</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password:</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation:</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Log In
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need a Prograde Account? <Link to="/signup">Sign Up</Link>
      </div>
    </>
  );
};

export default Login;
