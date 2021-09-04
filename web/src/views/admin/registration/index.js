import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
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
  Checkbox
} from "antd";

const LocationModal = props => {
  const handleOnSubmit = async () => {
    if (props.item && props.item._id) {
      await axios.put(
        process.env.REACT_APP_BACKEND_URL + "/registration/" + props.item._id,
        {
          // name,
          // address
        }
      );

      props.setCurrentItem(null);

      props.setShowModal(false);
    }
  };
  return (
    <Modal visible={props.visible} onCancel={() => props.setShowModal(false)}>
      <Form>
        <Form.Item label="Tên">
          <Input
            value={props.item && props.item.name}
            contentEditable={false}
          />
        </Form.Item>

        <Form.Item label="Email">
          <Input
            value={props.item && props.item.email}
            contentEditable={false}
          />
        </Form.Item>
        <Form.Item label="Ngày đăng ký">
          <Input
            value={
              props.item && moment(props.item.created).format("DD/MM/YYYY")
            }
            contentEditable={false}
          />
        </Form.Item>

        <Form.Item label="Tỉnh/thành đăng ký">
          <Input
            value={
              props.item && props.item.province && props.item.province.name
            }
            contentEditable={false}
          />
        </Form.Item>

        <Form.Item label="">
          <Checkbox
            checked={props.item && props.item.received}
            contentEditable={false}
          >
            Đã nhận sách
          </Checkbox>
        </Form.Item>

        {props.item && props.item.received && (
          <Form.Item label="Nơi nhận sách">
            <Input
              value={
                props.item && props.item.location && props.item.location.name
              }
              contentEditable={false}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export const Location = props => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const getData = async page => {
    const response = await axios(
      process.env.REACT_APP_BACKEND_URL +
        "/registration?offset=" +
        currentPage * 10
    );

    const { count, registrations } = response.data.data;
    setData(registrations);
    setTotal(count);
  };

  const handleOnDelete = async _id => {
    await axios.delete(
      process.env.REACT_APP_BACKEND_URL + "/registration/" + _id
    );

    notification.success({
      message: "Delete successfully"
    });

    getData();
  };

  const handleChangePage = page => getData(page);

  const columns = [
    {
      title: "Name",
      dataIndex: "name"
    },
    {
      title: "Email",
      dataIndex: "email"
    },

    {
      title: "Ngày đăng ký",
      render: (_, record) =>
        moment(record.created).format("DD/MM/YYYY HH:mm:ss")
    },

    {
      title: "Tỉnh/thành đăng ký",
      render: (_, record) => record.province && record.province.name
    },
    {
      title: "Nơi nhận sách",
      render: (_, record) => record.location && record.location.name
    },
    {
      title: "Sách nhận",
      render: (_, record) => record.book && record.book.name
    },

    {
      title: "Action",
      align: "center",
      render: (_, record) => {
        return (
          <Row style={{ display: "flex", justifyContent: "center" }}>
            <Popconfirm
              placement="top"
              title={"Delete row?"}
              onConfirm={() => {
                handleOnDelete(record._id);
              }}
              okText="Yes"
              cancelText="No"
              disabled={record.received}
            >
              <Button type="danger" disabled={record.received}>
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
    <Card title="Quản lý đăng ký">
      {showModal && (
        <LocationModal
          visible={showModal}
          setShowModal={setShowModal}
          item={currentItem}
          setCurrentItem={setCurrentItem}
        />
      )}
      <Table
        dataSource={data}
        columns={columns}
        pagination={{ total, onChange: handleChangePage }}
      />
    </Card>
  );
};

export default Location;
