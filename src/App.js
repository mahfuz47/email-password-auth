import "bootstrap/dist/css/bootstrap.min.css";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import app from "./firebase.init";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";

const auth = getAuth(app);
function App() {
  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  const handleNameBlur = (event) => {
    setName(event.target.value);
  };

  const handleEmailBlur = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordBlur = (event) => {
    setPassword(event.target.value);
  };

  const handleRegisteredChange = (event) => {
    setRegistered(event.target.checked);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    if (!/(?=.*?[#?!@$%^&*-])/.test(pass)) {
      setError("Password should contain at least one special charecter");
      return;
    }

    setValidated(true);
    setError("");

    if (registered) {
      signInWithEmailAndPassword(auth, email, pass)
        .then((result) => {
          const user = result.user;
          console.log(user);
        })
        .catch((error) => {
          console.log(error);
          setError(error.message);
        });
    } else {
      createUserWithEmailAndPassword(auth, email, pass)
        .then((result) => {
          const user = result.user;
          console.log(user);
          setEmail("");
          setPassword("");
          verifyEmail();
          setUserName();
        })
        .catch((error) => {
          console.log(error);
          setError(error.message);
        });
      // console.log(email, pass);
    }
    event.preventDefault();
  };

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email).then((result) => {
      console.log("email sent");
    });
  };

  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        console.log("updating name");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser);
  };

  return (
    <div>
      <div className="registration w-50 mx-auto mt-2">
        <h2 className="text-primary">
          Please {registered ? "Login" : "Register"}!!
        </h2>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          {!registered && (
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                onBlur={handleNameBlur}
                type="text"
                placeholder="Enter your name"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide your name.
              </Form.Control.Feedback>
            </Form.Group>
          )}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              onBlur={handleEmailBlur}
              type="email"
              placeholder="Enter email"
              required
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              onBlur={handlePasswordBlur}
              type="password"
              placeholder="Password"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              onChange={handleRegisteredChange}
              type="checkbox"
              label="Already Registered"
            />
          </Form.Group>
          <p className="text-danger">{error}</p>
          <Button onClick={handlePasswordReset} variant="link">
            Forget Password?
          </Button>
          <br />
          <Button variant="primary" type="submit">
            {registered ? "Login" : "Register"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
