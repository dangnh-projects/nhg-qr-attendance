import React, { useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  Row,
  Modal,
  Form,
  Input,
  TimePicker,
  DatePicker,
  Col,
  Card,
  notification
} from "antd";
import intl from "react-intl-universal";

const LocationModal = props => {
  console.log(process.env);
  const [name, setName] = useState(props.item && props.item.name);
  const [code, setCode] = useState(props.item && props.item.code);
  const [date, setDate] = useState(props.item && moment(props.item.date));
  const [startTime, setStartTime] = useState(
    props.item && moment(props.item.startTime)
  );
  const [endTime, setEndTime] = useState(
    props.item && moment(props.item.endTime)
  );
  const handleOnSubmit = async () => {
    if (code.length !== 4) {
      notification.error({
        message: "Code must be 4 characters long"
      });
      return;
    }
    const data = {
      date,
      name,
      code,
      startTime,
      endTime
    };
    try {
      if (props.item && props.item._id) {
        await axios.put(
          process.env.REACT_APP_BACKEND_URL + "/session/" + props.item._id,
          data
        );

        props.setCurrentItem(null);

        props.setShowModal(false);
      } else {
        await axios.post(process.env.REACT_APP_BACKEND_URL + "/session", data);
        props.setShowModal(false);
      }

      props.getData();
    } catch (error) {
      if (error && error.response && error.response.data) {
        notification.error({
          message: error.response.data.message
        });
      }
    }
  };
  return (
    <Modal
      visible={props.visible}
      onOk={handleOnSubmit}
      onCancel={() => props.setShowModal(false)}
    >
      <Form style={{ marginTop: 24 }}>
        <Form.Item label={intl.get("SESSION.NAME")}>
          <Input value={name} onChange={e => setName(e.target.value)} />
        </Form.Item>
        <Form.Item label={intl.get("SESSION.CODE")}>
          <Input
            maxLength={4}
            minLength={4}
            value={code}
            onChange={e => setCode(e.target.value)}
          />
        </Form.Item>
        {/* <Form.Item label={intl.get("SESSION.REGISTRATION_DEADLINE")}>
          <Row type="flex">
            <Col xs={12}>
              <DatePicker value={date} onChange={val => setDate(val)} />
            </Col>
            <Col xs={12}>
              <TimePicker
                format="HH:mm"
                value={date}
                onChange={val => setDate(val)}
              />
            </Col>
          </Row>
        </Form.Item> */}
        <Form.Item label={intl.get("SESSION.DATE")}>
          <DatePicker value={date} onChange={val => setDate(val)} />
        </Form.Item>
        <Row type="flex" gutter={16}>
          <Col>
            <Form.Item label={intl.get("SESSION.START_TIME")}>
              <TimePicker
                format="HH:mm"
                value={startTime}
                onChange={val => setStartTime(val)}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label={intl.get("SESSION.END_TIME")}>
              <TimePicker
                format="HH:mm"
                value={endTime}
                onChange={val => setEndTime(val)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default LocationModal;
