import React, { useContext } from "react";
import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import { Formik, Form, Field } from "formik";

import {
  SVG,
  modalStyle,
  SecondaryButton,
  RedButton,
} from "../../Components/Styles/styles";
import Logo from "../../Images/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { handleSignIn, setAuth } from "../../Services/services";
import { UserContext } from "../../Context/user.context";

const Signin = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn } = useContext(UserContext);
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              backgroundColor: "black",
            }}
          >
            <div>
              <SVG src={Logo} />
            </div>
            <div>
              <Link
                to="/signup"
                style={{ textDecoration: "none" }}
                onClick={handleClose}
              >
                <SecondaryButton>Sign Up</SecondaryButton>
              </Link>
            </div>
          </div>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={async (values) => {
              const response = await handleSignIn({ userInfo: values });

              if (response === 404) {
                alert("Wrong email or password");
              } else {
                setIsLoggedIn(true);
                setAuth(response);
                // const userInfo = await getUserInfo(access);
                // setUser();
                navigate("/");
                handleClose();
              }
            }}
          >
            {({ values }) => (
              <div
                style={{
                  display: "flex",
                  padding: "30px",
                  backgroundColor: "white",
                }}
              >
                <Form>
                  <h3>Have an Account?</h3>
                  <div>
                    <label htmlFor="email">Email : </label>
                    <Field type="email" name="email" />
                  </div>
                  <div>
                    <label htmlFor="password">Password : </label>
                    <Field type="password" name="password" />
                  </div>
                  <pre>{JSON.stringify(values)}</pre>
                  <RedButton type="submit">Sign In</RedButton>
                </Form>
              </div>
            )}
          </Formik>
        </div>
      </Box>
    </Modal>
  );
};

export default Signin;
