import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Popconfirm,
  Icon,
  Row,
  Table,
  Modal,
  Form,
  Input,
  notification,
  Select
} from "antd";
import intl from "react-intl-universal";
import slugify from "slugify";

const { Search } = Input;

const LocationModal = props => {
  const [name, setName] = useState(props.item ? props.item.name : "");
  const [email, setEmail] = useState(props.item ? props.item.email : "");
  const [role, setRole] = useState(props.item ? props.item.role : "NORMAL");
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState(
    props.item && props.item.department ? props.item.department._id : null
  );
  const [schools, setSchools] = useState([]);
  const [school, setSchool] = useState(
    props.item && props.item.school ? props.item.school._id : null
  );
  const handleOnSubmit = async () => {
    if (props.item && props.item._id) {
      await axios.put(
        process.env.REACT_APP_BACKEND_URL + "/user/" + props.item._id,
        {
          role,
          name,
          email,
          department,
          school
        }
      );

      props.setCurrentItem(null);
    }

    props.setShowModal(false);
    props.getData && props.getData();
  };

  const getDepartments = async () => {
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/department"
    );

    const data = response.data.data;

    setDepartments(data);
    if (!props.item && data.length > 0) {
      setDepartment(data[0]._id);
    }
  };

  const getSchools = async () => {
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/school"
    );

    const data = response.data.data;

    setSchools(data);
    if (!props.item && data.length > 0) {
      setSchool(data[0]._id);
    }
  };

  useEffect(() => {
    getSchools();
    getDepartments();
  }, []);
  return (
    <Modal
      visible={props.visible}
      footer={null}
      onCancel={() => props.setShowModal(false)}
    >
      <Form>
        <Form.Item label={intl.get("USER.NAME")}>
          <Input onChange={e => setName(e.target.value)} value={name} />
        </Form.Item>

        <Form.Item label={intl.get("USER.EMAIL")}>
          <Input onChange={e => setEmail(e.target.value)} value={email} />
        </Form.Item>

        <Form.Item label={intl.get("USER.ROLE")}>
          <Select value={role} onChange={e => setRole(e)}>
            <Select.Option value="NORMAL">Normal</Select.Option>
            <Select.Option value="ADMIN">Admin</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label={intl.get("USER.DEPARTMENT")}>
          <Select value={department} onChange={e => setDepartment(e)}>
            {departments &&
              departments.map(dept => (
                <Select.Option value={dept._id} key={dept._id}>
                  {dept.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item label={intl.get("USER.SCHOOL")}>
          <Select value={school} onChange={e => setSchool(e)}>
            {schools &&
              schools.map(sch => (
                <Select.Option value={sch._id} key={sch._id}>
                  {sch.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button onClick={handleOnSubmit}>{intl.get("USER.SUBMIT")}</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const Location = props => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const [searchedData, setSearchedData] = useState([]);
  const [isSeach, setSetIsSearch] = useState(false);

  const getData = async () => {
    const response = await axios(process.env.REACT_APP_BACKEND_URL + "/user");
    setData(response.data.data);
  };

  const handleOnDelete = async _id => {
    await axios.delete(process.env.REACT_APP_BACKEND_URL + "/user/" + _id);

    notification.success({
      message: "Delete successfully"
    });

    getData();
  };

  const columns = [
    {
      title: intl.get("USER.NAME"),
      dataIndex: "name"
    },
    {
      title: intl.get("USER.EMAIL"),
      dataIndex: "email"
    },

    {
      title: intl.get("USER.DEPARTMENT"),
      render: (_, record) => record.department && record.department.name
    },
    {
      title: intl.get("USER.SCHOOL"),
      render: (_, record) => record.school && record.school.name
    },

    {
      title: intl.get("USER.ROLE"),
      dataIndex: "role"
    },

    {
      title: intl.get("USER.ACTION"),
      align: "center",
      render: (_, record) => {
        return (
          <Row style={{ display: "flex", justifyContent: "center" }}>
            <Button
              style={{ marginRight: 16 }}
              onClick={() => {
                setCurrentItem(record);
                setShowModal(true);
              }}
            >
              <Icon type="form" />
            </Button>
            <Popconfirm
              placement="top"
              title={"Delete row?"}
              onConfirm={() => {
                handleOnDelete(record._id);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button type="danger">
                <Icon type="delete" />
              </Button>
            </Popconfirm>
          </Row>
        );
      }
    }
  ];

  useEffect(() => {
    getData();
  }, []);

  const handleOnSearch = term => {
    term = slugify(term.toLowerCase(), " ");
    const filtered = data.filter(
      item =>
        slugify(item.name, " ")
          .toLowerCase()
          .includes(term) || item.email.includes(term)
    );

    setSetIsSearch(true);
    setSearchedData(filtered);
  };

  return (
    <Card
      title={intl.get("USER.USER_MNGT")}
      extra={[<Search onSearch={handleOnSearch} />]}
    >
      {showModal && (
        <LocationModal
          visible={showModal}
          setShowModal={setShowModal}
          item={currentItem}
          setCurrentItem={setCurrentItem}
          getData={getData}
        />
      )}
      <Table dataSource={isSeach ? searchedData : data} columns={columns} />
    </Card>
  );
};

export default Location;
