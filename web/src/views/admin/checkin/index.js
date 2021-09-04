import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Row,
  Col,
  Card,
  Button,
  notification,
  Icon,
  Input,
  Form,
  Select,
  Spin
} from "antd";
import moment from "moment";

import intl from "react-intl-universal";

const Read = props => {
  const [result, setResult] = useState();
  const [isScan, setIsScan] = useState(false);
  const [user, setUser] = useState(false);
  const [attendee, setAttendee] = useState(false);
  const [session, setSession] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState();

  const handleSubmitCode = async data => {
    if (code) {
      setLoading(true);
      try {
        const response = await axios.post(
          process.env.REACT_APP_BACKEND_URL + "/check-code",
          {
            code: code.trim()
          }
        );

        if (response.data) {
          const { attendee } = response.data;

          setUser(attendee.user);
          setSession(attendee.session);
          setAttendee(attendee);

          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        notification.error({ message: error.response.data.error });
        setUser(null);
      }
    }
  };

  const handleReceiveBook = async e => {
    setLoading(true);
    e.preventDefault();

    try {
      await axios.post(process.env.REACT_APP_BACKEND_URL + "/attend", {
        _id: attendee._id
      });

      notification.success({ message: "Checkin successfully" });
      setLoading(false);
      setUser(null);
    } catch (error) {}
  };

  return (
    <Spin spinning={loading}>
      <Card
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
        bodyStyle={{ minHeight: 120 }}
      >
        <Row
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          {user && (
            <Col>
              <Form>
                <Form.Item label={intl.get("SCAN_QR.FULLNAME")}>
                  <Input value={user.name} contentEditable={false} />
                </Form.Item>
                <Form.Item label={intl.get("SCAN_QR.EMAIL")}>
                  <Input value={user.email} contentEditable={false} />
                </Form.Item>
                <Form.Item label={intl.get("SCAN_QR.REGISTRATION_DATE")}>
                  <Input
                    value={moment(attendee.created).format(
                      "DD/MM/YYYY HH:mm:ss"
                    )}
                    contentEditable={false}
                  />
                </Form.Item>
                <Form.Item label={intl.get("SCAN_QR.SESSION")}>
                  <Input value={session.name} contentEditable={false} />
                </Form.Item>
                <Row>
                  {!user.received && (
                    <Col>
                      <Row>
                        <Button onClick={handleReceiveBook}>Submit</Button>
                      </Row>
                    </Col>
                  )}
                </Row>
              </Form>
            </Col>
          )}

          {!user && (
            <>
              <Form.Item label={intl.get("SCAN_QR.REGISTRATION_CODE")}>
                <Input onChange={e => setCode(e.target.value)} />
              </Form.Item>

              <Button style={{ marginTop: 24 }} onClick={handleSubmitCode}>
                {intl.get("SCAN_QR.SUBMIT")}
              </Button>
            </>
          )}
        </Row>
      </Card>
    </Spin>
  );
};

export default Read;
