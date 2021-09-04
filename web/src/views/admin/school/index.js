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
  notification
} from "antd";

import intl from "react-intl-universal";

const SchoolModal = props => {
  const [name, setName] = useState(props.item ? props.item.name : "");
  const [code, setCode] = useState(props.item ? props.item.code : "");

  const handleOnSubmit = async () => {
    const data = {
      name,
      code
    };

    try {
      if (props.item && props.item._id) {
        await axios.put(
          process.env.REACT_APP_BACKEND_URL + "/school/" + props.item._id,
          data
        );

        props.setCurrentItem(null);
      } else {
        await axios.post(process.env.REACT_APP_BACKEND_URL + "/school", data);
      }

      props.setShowModal(false);
      props.getData && props.getData();
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
      footer={null}
      onCancel={() => props.setShowModal(false)}
    >
      <Form>
        <Form.Item label={intl.get("SCHOOL.NAME")}>
          <Input value={name} onChange={e => setName(e.target.value)} />
        </Form.Item>

        <Form.Item label={intl.get("SCHOOL.CODE")}>
          <Input value={code} onChange={e => setCode(e.target.value)} />
        </Form.Item>

        <Form.Item>
          <Button onClick={handleOnSubmit}>{intl.get("SCHOOL.SUBMIT")}</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const SchoolList = props => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const getData = async () => {
    const response = await axios(process.env.REACT_APP_BACKEND_URL + "/school");
    setData(response.data.data);
  };

  const handleOnDelete = async _id => {
    await axios.delete(process.env.REACT_APP_BACKEND_URL + "/school/" + _id);

    notification.success({
      message: intl.get("DEPARTMENT.MSG_DELETE_SUCCESS")
    });

    getData();
  };

  const columns = [
    {
      title: intl.get("SCHOOL.NAME"),
      dataIndex: "name"
    },
    {
      title: intl.get("SCHOOL.CODE"),
      dataIndex: "code"
    },
    {
      title: intl.get("SCHOOL.ACTION"),
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

  return (
    <Card
      title={intl.get("SCHOOL.SCHOOL_MNGT")}
      extra={[
        <Button key="add-new" onClick={() => setShowModal(true)}>
          {intl.get("SCHOOL.ADD")}
        </Button>
      ]}
    >
      {showModal && (
        <SchoolModal
          visible={showModal}
          setShowModal={setShowModal}
          item={currentItem}
          setCurrentItem={setCurrentItem}
          getData={getData}
        />
      )}
      <Table dataSource={data} columns={columns} />
    </Card>
  );
};

export const School = props => {
  return <SchoolList />;
};

export default School;
