import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Modal, Form, Input, Select } from "antd";

const Option = Select.Option;

const LocationModal = props => {
  const { sessionId } = props;
  const [name, setName] = useState(props.item && props.item.name);
  const [email, setEmail] = useState(props.item && props.item.name);
  const [department, setDepartment] = useState(props.item && props.item.name);
  const [departments, setDepartments] = useState([]);
  const [school, setSchool] = useState(props.item && props.item.school);
  const [schools, setSchools] = useState([]);
  const handleOnSubmit = async () => {
    const data = {
      name,
      email,
      department,
      school
    };
    if (props.item && props.item._id) {
      await axios.put(
        process.env.REACT_APP_BACKEND_URL + "/session/" + sessionId,
        data
      );

      props.setCurrentItem(null);

      props.setShowModal(false);
    } else {
      await axios.post(
        process.env.REACT_APP_BACKEND_URL +
          "/session/" +
          sessionId +
          "/attendee",
        data
      );
      props.setShowModal(false);
    }

    props.getData();
  };

  const getDepartments = async () => {
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/department"
    );

    const data = response.data.data;

    setDepartments(data);
    if (data.length > 0) {
      setDepartment(data[0]._id);
    }
  };

  const getSchools = async () => {
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/school"
    );

    const data = response.data.data;

    setSchools(data);
    if (data.length > 0) {
      setSchool(data[0]._id);
    }
  };

  useEffect(() => {
    getDepartments();
    getSchools();
  }, []);

  return (
    <Modal
      visible={props.visible}
      onOk={handleOnSubmit}
      onCancel={() => props.setShowModal(false)}
    >
      <Form>
        <Form.Item label="Name">
          <Input value={name} onChange={e => setName(e.target.value)} />
        </Form.Item>
        <Form.Item label="Email">
          <Input value={email} onChange={e => setEmail(e.target.value)} />
        </Form.Item>
        <Form.Item label="Department">
          <Select value={department} onChange={val => setDepartment(val)}>
            {departments &&
              departments.map(department => (
                <Option key={department._id} value={department._id}>
                  {department.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item label="School">
          <Select value={school} onChange={val => setSchool(val)}>
            {schools &&
              schools.map(school => (
                <Option key={school._id} value={school._id}>
                  {school.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LocationModal;
