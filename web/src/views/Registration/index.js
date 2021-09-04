import React, { useRef, useState, useEffect } from "react";
import { Form, Row, Col, notification, Input, Button, Select } from "antd";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import moment from "moment";
import MicrosoftLogin from "react-microsoft-login";

const { Option } = Select;

const SessionDetail = ({ session }) => {
  return (
    <Col xs={24} md={12}>
      <Row
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 12,
          color: "#246B00",
          textTransform: "uppercase"
        }}
      >
        Thông tin khóa học
      </Row>
      <Col style={{ display: "flex", justifyContent: "center" }}>
        <Row>
          <Row style={{ textAlign: "left", marginBottom: 12 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: "bold",
                marginBottom: 12,
                color: "#246B00",
                textTransform: "uppercase",
                marginRight: 15
              }}
            >
              Tên khóa học:
            </span>
            {session && session.name}
          </Row>
          <Row style={{ textAlign: "left", marginBottom: 12 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: "bold",
                marginBottom: 12,
                color: "#246B00",
                textTransform: "uppercase",
                marginRight: 15
              }}
            >
              Ngày:
            </span>
            {session && moment(session.date).format("DD/MM/YYYY")}
          </Row>
          <Row style={{ textAlign: "left", marginBottom: 12 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: "bold",
                marginBottom: 12,
                color: "#246B00",
                textTransform: "uppercase",
                marginRight: 15
              }}
            >
              Thời gian :
            </span>
            {session && moment(session.startTime).format("HH:mm")}
            {" - "}
            {session && moment(session.endTime).format("HH:mm")}
          </Row>
        </Row>
      </Col>
    </Col>
  );
};

const Registration = props => {
  const { id } = props;

  const { getFieldDecorator } = props.form;
  const captchaRef = useRef();
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [departments, setDepartments] = useState([]);
  const [schools, setSchools] = useState([]);
  const [captchaVal, setCaptchaVal] = useState(null);
  const [province, setProvince] = useState(null);
  const [isDone, setIsDone] = useState(false);
  const [department, setDepartment] = useState("");
  const [school, setSchool] = useState("");
  const [session, setSession] = useState("");
  const [user, setUser] = useState("");
  const [searching, setSearching] = useState(false);

  const getDepartments = async () => {
    const response = await axios(
      process.env.REACT_APP_BACKEND_URL + "/department"
    );
    setDepartments(response.data.data);
  };

  const getSchools = async () => {
    const response = await axios(process.env.REACT_APP_BACKEND_URL + "/school");
    setSchools(response.data.data);
  };

  const getSession = async () => {
    const response = await axios(
      process.env.REACT_APP_BACKEND_URL + "/session/" + id
    );
    setSession(response.data.session);
  };

  useEffect(() => {
    getDepartments();
    getSchools();
    getSession();
  }, []);

  // const onSeachEmail = async email => {
  //   const response = await axios.get(
  //     process.env.REACT_APP_BACKEND_URL + "/user/by-email/" + email
  //   );
  //   console.log(response);
  // };

  const handleOnSubmit = e => {
    e.preventDefault && e.preventDefault();
    props.form.validateFields(async (err, data) => {
      if (err) {
        return;
      }

      if (!captchaVal) {
        notification.error({
          message: "Xác thực captcha không thành công, xin hãy thử lại"
        });
        return;
      }

      const body = Object.assign({}, data, {
        captchaVal
      });
      try {
        await axios.post(
          process.env.REACT_APP_BACKEND_URL + "/session/" + id + "/register",
          body
        );
        notification.success({ message: "Thành công" });
        setIsDone(true);
      } catch (error) {
        notification.error({ message: error.response.data.message });
        captchaRef.current.reset();
      }
    });
  };

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

        const { name, email, department, school } = user;
        setName(name);
        setEmail(email);
        setUser(user);
        if (department && department._id) {
          setDepartment(department._id);
        }

        if (school && school._id) {
          setSchool(school._id);
        }
      }
    } catch (error) {}
  };

  return (
    <Row id="main-form" style={{ padding: 12 }}>
      <Col style={{ display: "flex" }}>
        <Row
          type="flex"
          className="main-form"
          style={{
            justifyContent: "center",
            width: "100%",

            color: "#246B00"
          }}
        >
          <Col
            xs={24}
            style={{
              fontSize: 32,
              fontWeight: "bold",
              marginTop: 18,
              marginBottom: 24,
              color: "#246B00",
              textTransform: "uppercase"
            }}
          >
            Đăng ký Tham gia khóa học
          </Col>
          <SessionDetail session={session} />
          <Col xs={24} md={12}>
            <Row
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 12,
                color: "#246B00",
                textTransform: "uppercase"
              }}
            >
              Thông tin đăng ký
            </Row>

            {isDone && (
              <Col
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center"
                }}
              >
                <Row style={{ fontSize: 16 }}>
                  Chúc mừng bạn đã đăng ký thành công, mã đăng ký đã được gửi
                  đến email của bạn, <br /> mã đăng ký này sẽ được dùng để điểm
                  danh
                </Row>
              </Col>
            )}
            {!isDone && (
              <Form
                onSubmit={handleOnSubmit}
                style={{ padding: 24, width: "100%" }}
                layout="verticle"
              >
                {/* <MicrosoftLogin
                  clientId={"e9e8ef5d-f3ac-4504-a0b2-57bb902710a4"}
                  authCallback={authHandler}
                  redirectUri={window && window.location.origin}
                /> */}
                <Form.Item label="Email">
                  {getFieldDecorator("email", {
                    initialValue: email,
                    rules: [
                      {
                        required: true,
                        message: "Hãy nhập email"
                      },
                      {
                        pattern: /^[a-z][a-z0-9_\.]{1,}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/gim,
                        message: "Cấu trúc email chưa hợp lệ"
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="Họ và tên">
                  {getFieldDecorator("name", {
                    initialValue: name,
                    rules: [
                      {
                        required: true,
                        message: "Hãy nhập Họ và tên"
                      }
                    ]
                  })(<Input placeholder="" />)}
                </Form.Item>

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
                    initialValue: school,
                    rules: [
                      {
                        required: true,
                        message: "Hãy chọn đơn vị"
                      }
                    ]
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <Form.Item>
                    <ReCAPTCHA
                      ref={captchaRef}
                      sitekey="6LeJO74UAAAAACIoItW6K-vr_R6GAAWCuYFp47LK"
                      onChange={val => setCaptchaVal(val)}
                    />
                  </Form.Item>
                  <Form.Item style={{ width: "100%" }}>
                    <Button
                      className="submit-input"
                      type="primary"
                      htmlType="submit"
                      style={{ height: 50 }}
                    >
                      Đăng ký
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Form.create({ name: "Registration form" })(Registration);
