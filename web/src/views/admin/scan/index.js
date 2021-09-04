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
import { navigate } from "@reach/router";

import QrReader from "react-qr-reader";

import intl from 'react-intl-universal';

const Option = Select.Option;

const CURRENT_LOC_KEY = "fsd.askfjabfukasnjkfdssbk";

const Read = props => {
  const [result, setResult] = useState();
  const [isScan, setIsScan] = useState(false);
  const [user, setUser] = useState(false);
  const [attendee, setAttendee] = useState(false);
  const [session, setSession] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleScan = async data => {
    if (data) {
      setLoading(true);
      setResult(data);
      setIsScan(false);

      try {
        const response = await axios.post(
          process.env.REACT_APP_BACKEND_URL + "/verify",
          {
            token: data
          }
        );

        if (response.data) {
          const { user, session, attendee } = response.data;

          setUser(user);
          setSession(session);
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

  const handleError = err => {
    console.error(err);
  };

  const handleBeginScan = () => {
    setIsScan(true);
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
          {isScan && (
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "400px" }}
              // facingMode={"user"}
              // legacyMode={true}
            />
          )}

          {user && !isScan && (
            <Col>
              <Form>
                <Form.Item label={intl.get('SCAN_QR.FULLNAME')}>
                  <Input value={user.name} contentEditable={false} />
                </Form.Item>
                <Form.Item label={intl.get('SCAN_QR.EMAIL')}>
                  <Input value={user.email} contentEditable={false} />
                </Form.Item>
                <Form.Item label={intl.get('SCAN_QR.REGISTRATION_DATE')}>
                  <Input value={attendee.created} contentEditable={false} />
                </Form.Item>
                <Form.Item label={intl.get('SCAN_QR.SESSION')}>
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

                  {user.received && (
                    <Row>
                      Đăng ký này đã được nhận sách tại:{" "}
                      <b>{user.location && user.location.name}</b>
                    </Row>
                  )}
                </Row>
              </Form>
            </Col>
          )}

          <Button style={{ marginTop: 24 }} onClick={handleBeginScan}>
            {intl.get('SCAN_QR.Scan_QR_CODE')}
            <Icon type="scan" />
          </Button>
        </Row>
      </Card>
    </Spin>
  );
};

export default Read;
