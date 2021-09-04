import React, { useState, useEffect } from "react";
import { Row, Col, Card, notification, Form, Select, Button } from "antd";
import MicrosoftLogin from "react-microsoft-login";

import axios from "axios";
import { navigate } from "@reach/router";

const { Option } = Select;

const AdditionalInformationForm = props => {
  const { getFieldDecorator } = props.form;
  const [departments, setDepartments] = useState([]);
  const [schools, setSchools] = useState([]);
  const [department, setDepartment] = useState("");
  const [school, setSchool] = useState("");

  const getDepartments = async () => {
    const response = await axios(
      process.env.REACT_APP_BACKEND_URL + "/department"
    );
    setDepartments(response.data.data);

    if (
      response.data.data &&
      response.data.data.length > 0 &&
      !props.user.department
    ) {
      setDepartment(response.data.data[0]._id);
    }
  };

  const getSchools = async () => {
    const response = await axios(process.env.REACT_APP_BACKEND_URL + "/school");
    setSchools(response.data.data);

    if (
      response.data.data &&
      response.data.data.length > 0 &&
      !props.user.school
    ) {
      setSchool(response.data.data[0]._id);
    }
  };

  useEffect(() => {
    getDepartments();
    getSchools();
  }, []);

  const handleOnSubmit = e => {
    e.preventDefault();
    props.form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return;
      } else {
        await axios.put(
          process.env.REACT_APP_BACKEND_URL + "/user/" + props.user._id,
          Object.assign({}, { ...props.user }, { ...fieldsValue })
        );

        navigate("/dashboard");
      }
    });
  };

  return (
    <Row type="flex" align="center" style={{ marginTop: 24 }}>
      <Col xs={24} sm={14} md={8}>
        <Card style={{ width: "100%" }}>
          <Form
            onSubmit={handleOnSubmit}
            style={{ padding: 24, width: "100%" }}
            layout="verticle"
          >
            <Form.Item label="Phòng/ban">
              {getFieldDecorator("department", {
                initialValue: department,
                rules: [
                  {
                    required: true,
                    message: "Hãy chọn phòng/ban"
                  }
                ]
              })(
                <Select onChange={val => setDepartment(val)}>
                  {departments.map(department => (
                    <Option key={department._id} value={department._id}>
                      {department.name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item label="Đơn vị">
              {getFieldDecorator("school", {
                value: school,
                rules: []
              })(
                <Select onChange={val => setSchool(val)}>
                  {schools.map(school => (
                    <Option key={school._id} value={school._id}>
                      {school.name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Row>
              <Col>
                <Button htmlType="submit">Submit</Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

const AdditionalInformation = Form.create({ name: "additional-form" })(
  AdditionalInformationForm
);

const Login = props => {
  const [showAdditional, setShowAdditional] = useState(false);
  const [user, setUser] = useState(null);
  const authHandler = async (err, data) => {
    if (err) {
      notification.error({ message: err.message });
      return;
    }
    try {
      notification.info({ message: "Processing" });
      const { authResponseWithAccessToken = {} } = data;
      const { accessToken } = authResponseWithAccessToken;
      if (accessToken) {
        const { data } = await axios.post(
          process.env.REACT_APP_BACKEND_URL + "/user/login",
          { accessToken }
        );

        const { token, user } = data;
        if (user.role !== "ADMIN") {
          notification.error({
            message: `You logged in with email ${user.email} and you are not administrator. 
            Please log in with administration account to continue`
          });

          return;
        }
        localStorage.setItem("email", user.email);
        localStorage.setItem("name", user.name);
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);

        if (!user.department && !user.school) {
          setUser(user);
          setShowAdditional(true);
        } else {
          // redirect things
          navigate("/dashboard");
        }
      }
    } catch (error) {}
  };

  return (
    <Col>
      <Row>
        <Card>
          <MicrosoftLogin
            clientId={"e9e8ef5d-f3ac-4504-a0b2-57bb902710a4"}
            authCallback={authHandler}
            redirectUri={window && window.location.href}
          />
        </Card>

        {showAdditional && <AdditionalInformation user={user} />}
      </Row>
    </Col>
  );
};

export default Login;
