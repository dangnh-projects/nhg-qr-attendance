import React, { useState, useRef, useEffect, Suspense } from "react";
import {
  Affix,
  Row,
  Col,
  Layout,
  Form,
  Input,
  Button,
  notification,
  Icon,
  Typography,
  Select,
  Spin
} from "antd";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import "./style.scss";

import Head from "./home/Head";
import Footer from "./home/Footer";

import BookModal from "./home/BookModal";
import InvitationSection from "./home/InvitationSection";

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { Option } = Select;

const BookItem = ({ book, reversed = false, setShowModal, setCurrentBook }) => {
  const dotStyle = {
    position: "absolute",
    width: 120,
    height: 120,
    maxHeight: 230,
    bottom: 30,
    zIndex: 1
  };
  if (reversed) {
    dotStyle.left = 0;
  } else {
    dotStyle.right = 0;
  }
  return (
    <Row
      style={{
        display: "flex",
        flexDirection: reversed ? "row-reverse" : "row",
        flexWrap: "wrap",
        marginTop: 64,
        justifyContent: "center"
      }}
    >
      <Col
        xs={24}
        md={5}
        onClick={e => {
          setShowModal(true);
          setCurrentBook(book);
        }}
        style={{ justifyContent: "center", display: "flex" }}
      >
        <div style={{ position: "relative", height: 400, minWidth: 300 }}>
          <img
            src={`/image/green-rectangle.png`}
            style={{
              position: "absolute",
              width: 180,
              height: 180,
              maxHeight: 230,
              top: 40,
              left: reversed ? 140 : 20
              // right: !reversed ? 140 : 0
            }}
          />
          <img
            src={`${process.env.REACT_APP_BACKEND_ROOT}/images/${book.image}`}
            style={{
              position: "absolute",
              width: "auto",
              height: "auto",
              maxHeight: 230,
              top: 100,
              left: 80,
              zIndex: 2
            }}
          />
          <img src={`/image/bg-dot.png`} style={dotStyle} />
        </div>
      </Col>
      <Col
        xs={24}
        md={16}
        style={{
          textAlign: "left",
          fontSize: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <Row
          style={{
            backgroundImage: "linear-gradient(to right, #377E00, #074C00)",
            color: "white",
            padding: "8px 12px",
            maxWidth: "max-content",
            marginBottom: 24,
            textTransform: "uppercase",
            alignSelf: reversed ? "flex-start" : "flex-end"
          }}
        >
          {book.name}
        </Row>
        <Row
          style={{ textAlign: reversed ? "left" : "right", color: "#246B00" }}
        >
          <q>{book.quote}</q>
        </Row>
      </Col>
    </Row>
  );
};

const StepItem = ({ image, title, description }) => {
  return (
    <Row style={{ display: "flex", flexDirection: "row", marginBottom: 36 }}>
      <Col>
        <img src={image} />
      </Col>
      <Col
        style={{
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column"
        }}
      >
        <Row
          type="flex"
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            paddingLeft: 12,
            color: "#074C00"
          }}
        >
          <Col style={{ fontWeight: "bold" }}>{title}</Col>
          <Col style={{ textAlign: "left" }}>{description}</Col>
        </Row>
      </Col>
    </Row>
  );
};

const PageIntroduction = () => (
  <Suspense>
    <Row
      type="flex"
      justify="center"
      style={{
        padding: 12,
        textAlign: "center",
        position: "relative"
      }}
    >
      <Col xs={24} md={14}>
        <Title style={{ color: "#246B00", marginTop: 12 }}>GIỚI THIỆU</Title>
        <Paragraph
          style={{
            margin: "auto",
            fontSize: 14,
            color: "#246B00"
          }}
        >
          Trên hành trình thực hiện sứ mệnh lan tỏa tri thức, bằng tình yêu và
          trách nhiệm đối với sự nghiệp giáo dục thế hệ trẻ, NHG mong muốn trao
          tặng những quyển sách hay, ý nghĩa và chứa đựng kỹ năng sống cho
          HS-SV, giáo viên, giảng viên và cả phụ huynh, góp phần triển nở hoa
          trái của giáo dục là con người đích thực, bước ra thế giới một cách
          đầy tự tin.
        </Paragraph>
      </Col>
    </Row>
  </Suspense>
);

const ClickToRegister = () => (
  <Affix
    className="click-register"
    offsetBottom={10}
    style={{ textAlign: "right" }}
  >
    <img
      src="/image/registering.png"
      onClick={() => {
        const elmnt = document.getElementById("main-form");
        elmnt.scrollIntoView({ behavior: "smooth" });
      }}
    />
  </Affix>
);

const FormSection = props => {
  const { getFieldDecorator } = props.form;
  const captchaRef = useRef();
  const [provinces, setProvinces] = useState([]);
  const [captchaVal, setCaptchaVal] = useState(null);
  const [province, setProvince] = useState(null);
  const [isDone, setIsDone] = useState(false);

  const getProvinces = async () => {
    const response = await axios(
      process.env.REACT_APP_BACKEND_URL + "/province"
    );
    setProvinces(response.data.data);
  };

  useEffect(() => {
    getProvinces();
  }, []);

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
        await axios.post(process.env.REACT_APP_BACKEND_URL + "/register", body);
        notification.success({ message: "Thành công" });
        setIsDone(true);
      } catch (error) {
        notification.error({ message: error.response.data.message });
        captchaRef.current.reset();
      }
    });
  };

  return (
    <Suspense fallback={<Spin />}>
      <Row id="main-form" style={{ padding: 12 }}>
        <Col style={{ display: "flex" }}>
          <Row style={{ marginBottom: 18 }}></Row>

          <Row
            type="flex"
            className="main-form"
            style={{
              justifyContent: "center",
              width: "100%",

              color: "#246B00"
            }}
          >
            <Col xs={24} md={12}>
              {isDone && (
                <Col
                  style={{
                    width: "100%",
                    marginTop: 24,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                  }}
                >
                  <Row>
                    <Icon
                      type="check-circle"
                      style={{ fontSize: 48, color: "#074C00" }}
                    />
                  </Row>
                  <Row
                    style={{
                      fontSize: 18,
                      padding: 24,
                      textAlign: "center",
                      color: "#074C00"
                    }}
                  >
                    Bạn đã đăng ký thành công, mã QR đã được gửi đến email của
                    bạn. <br /> Cảm ơn bạn đã tham gia chương trình tặng sách
                    "Lan tỏa tri thức" của Nguyễn Hoàng Group.
                  </Row>
                </Col>
              )}
              {!isDone && (
                <Form
                  onSubmit={handleOnSubmit}
                  style={{ padding: 24, width: "100%" }}
                  layout="verticle"
                >
                  <Row
                    style={{
                      fontSize: 32,
                      fontWeight: "bold",
                      marginBottom: 12,
                      color: "#246B00",
                      textTransform: "uppercase"
                    }}
                  >
                    Đăng ký nhận sách
                  </Row>
                  <Form.Item label="Họ và tên">
                    {getFieldDecorator("name", {
                      rules: [
                        {
                          required: true,
                          message: "Hãy nhập Họ và tên"
                        }
                      ]
                    })(<Input placeholder="" />)}
                  </Form.Item>
                  <Form.Item label="Email">
                    {getFieldDecorator("email", {
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
                  <Form.Item label="Bạn/con bạn đang là học sinh/sinh viên trường:">
                    {getFieldDecorator("school", {
                      rules: [
                        {
                          required: true,
                          message: "Hãy nhập tên trường"
                        }
                      ]
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label="Thuộc tỉnh/thành:">
                    {getFieldDecorator("province", {
                      rules: [
                        {
                          required: true,
                          message: "Hãy chọn tỉnh/thành"
                        }
                      ]
                    })(
                      <Select
                        defaultValue={
                          provinces && provinces.length > 0 && provinces[0]._id
                        }
                        onChange={val => setProvince(val)}
                      >
                        {provinces.map(province => (
                          <Option key={province._id} value={province._id}>
                            {province.name}
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
            <Col xs={24} md={12} style={{ padding: 24 }}>
              <Row
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  marginBottom: 12,
                  textTransform: "uppercase"
                }}
              >
                Quy trình nhận sách
              </Row>
              <Row style={{ padding: 24 }}>
                <StepItem
                  image="/image/icon-registration.png"
                  title="Đăng ký tham gia"
                  description="Quét mã QR hoặc nhấp vào link đăng ký online, để đến form thông tin
    đăng ký tham gia chương trình."
                />
                <StepItem
                  image="/image/icon-form.png"
                  title="Nhập thông tin vào form"
                  description="Hoàn tất form đăng ký bằng cách nhập các thông tin: họ tên; email; tỉnh thành.                      "
                />
                <StepItem
                  image="/image/icon-mail.png"
                  title="Nhận email có mã nhận sách"
                  description="BTC gửi email có mã và địa chỉ các điểm trao sách"
                />
                <StepItem
                  image="/image/icon-book.png"
                  title="Nhận sách tại trường"
                  description="Đến các điểm trao sách có trong email, đưa mã QR trên cho nhân viên quét mã và nhận sách"
                />
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Suspense>
  );
};

const BooksSection = props => {
  const [books, setBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getBooks = async () => {
    const response = await axios(process.env.REACT_APP_BACKEND_URL + "/book");
    setBooks(response.data.data);
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <Suspense fallback={<Spin />}>
      {showModal && (
        <BookModal
          visible={showModal}
          setShowModal={setShowModal}
          book={currentBook}
        />
      )}
      <Row style={{ padding: 24 }}>
        {books &&
          books.map((book, i) => (
            <BookItem
              book={book}
              key={i}
              reversed={i % 2 === 0}
              setShowModal={setShowModal}
              setCurrentBook={setCurrentBook}
            />
          ))}
      </Row>
    </Suspense>
  );
};

const Index = props => {
  const { form } = props;

  return (
    <Layout>
      <Head />

      <Content
        style={{ backgroundColor: "white", width: "100vw", overflow: "hidden" }}
      >
        <img src="image/cover.jpg" style={{ width: "100%", height: "auto" }} />
        <Row>
          <div
            style={{
              backgroundImage: 'url("/image/background.png")',
              position: "absolute",
              width: 560,
              height: 590,
              top: -10,
              left: -200,
              backgroundPosition: "right center",
              backgroundSize: "cover"
            }}
          />
          <div
            style={{
              backgroundImage: 'url("/image/background.png")',
              position: "absolute",
              width: 560,
              height: 590,
              top: 600,
              right: -270,
              backgroundPosition: "left center",
              backgroundSize: "cover"
            }}
          />
          <div
            style={{
              backgroundImage: 'url("/image/background.png")',
              position: "absolute",
              width: 560,
              height: 590,
              top: 1200,
              left: -200,
              backgroundPosition: "right center",
              backgroundSize: "cover"
            }}
          />
          <PageIntroduction />
          <BooksSection />
        </Row>
        <InvitationSection />
        <FormSection form={form} />
        <ClickToRegister />
      </Content>
      <Footer />
    </Layout>
  );
};

const WrappedForm = Form.create({ name: "Home form" })(Index);

export default WrappedForm;
