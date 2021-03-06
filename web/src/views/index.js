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
        <Title style={{ color: "#246B00", marginTop: 12 }}>GI???I THI???U</Title>
        <Paragraph
          style={{
            margin: "auto",
            fontSize: 14,
            color: "#246B00"
          }}
        >
          Tr??n h??nh tr??nh th???c hi???n s??? m???nh lan t???a tri th???c, b???ng t??nh y??u v??
          tr??ch nhi???m ?????i v???i s??? nghi???p gi??o d???c th??? h??? tr???, NHG mong mu???n trao
          t???ng nh???ng quy???n s??ch hay, ?? ngh??a v?? ch???a ?????ng k??? n??ng s???ng cho
          HS-SV, gi??o vi??n, gi???ng vi??n v?? c??? ph??? huynh, g??p ph???n tri???n n??? hoa
          tr??i c???a gi??o d???c l?? con ng?????i ????ch th???c, b?????c ra th??? gi???i m???t c??ch
          ?????y t??? tin.
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
          message: "X??c th???c captcha kh??ng th??nh c??ng, xin h??y th??? l???i"
        });
        return;
      }

      const body = Object.assign({}, data, {
        captchaVal
      });
      try {
        await axios.post(process.env.REACT_APP_BACKEND_URL + "/register", body);
        notification.success({ message: "Th??nh c??ng" });
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
                    B???n ???? ????ng k?? th??nh c??ng, m?? QR ???? ???????c g???i ?????n email c???a
                    b???n. <br /> C???m ??n b???n ???? tham gia ch????ng tr??nh t???ng s??ch
                    "Lan t???a tri th???c" c???a Nguy???n Ho??ng Group.
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
                    ????ng k?? nh???n s??ch
                  </Row>
                  <Form.Item label="H??? v?? t??n">
                    {getFieldDecorator("name", {
                      rules: [
                        {
                          required: true,
                          message: "H??y nh???p H??? v?? t??n"
                        }
                      ]
                    })(<Input placeholder="" />)}
                  </Form.Item>
                  <Form.Item label="Email">
                    {getFieldDecorator("email", {
                      rules: [
                        {
                          required: true,
                          message: "H??y nh???p email"
                        },
                        {
                          pattern: /^[a-z][a-z0-9_\.]{1,}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/gim,
                          message: "C???u tr??c email ch??a h???p l???"
                        }
                      ]
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label="B???n/con b???n ??ang l?? h???c sinh/sinh vi??n tr?????ng:">
                    {getFieldDecorator("school", {
                      rules: [
                        {
                          required: true,
                          message: "H??y nh???p t??n tr?????ng"
                        }
                      ]
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label="Thu???c t???nh/th??nh:">
                    {getFieldDecorator("province", {
                      rules: [
                        {
                          required: true,
                          message: "H??y ch???n t???nh/th??nh"
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
                        ????ng k??
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
                Quy tr??nh nh???n s??ch
              </Row>
              <Row style={{ padding: 24 }}>
                <StepItem
                  image="/image/icon-registration.png"
                  title="????ng k?? tham gia"
                  description="Qu??t m?? QR ho???c nh???p v??o link ????ng k?? online, ????? ?????n form th??ng tin
    ????ng k?? tham gia ch????ng tr??nh."
                />
                <StepItem
                  image="/image/icon-form.png"
                  title="Nh???p th??ng tin v??o form"
                  description="Ho??n t???t form ????ng k?? b???ng c??ch nh???p c??c th??ng tin: h??? t??n; email; t???nh th??nh.                      "
                />
                <StepItem
                  image="/image/icon-mail.png"
                  title="Nh???n email c?? m?? nh???n s??ch"
                  description="BTC g???i email c?? m?? v?? ?????a ch??? c??c ??i???m trao s??ch"
                />
                <StepItem
                  image="/image/icon-book.png"
                  title="Nh???n s??ch t???i tr?????ng"
                  description="?????n c??c ??i???m trao s??ch c?? trong email, ????a m?? QR tr??n cho nh??n vi??n qu??t m?? v?? nh???n s??ch"
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
