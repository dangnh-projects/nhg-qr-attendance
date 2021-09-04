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

const ProvinceModal = props => {
  const [name, setName] = useState(props.item ? props.item.name : "");
  const handleOnSubmit = async () => {
    try {
      if (props.item && props.item._id) {
        await axios.put(
          process.env.REACT_APP_BACKEND_URL + "/province/" + props.item._id,
          {
            name
          }
        );

        props.setCurrentItem(null);
      } else {
        await axios.post(process.env.REACT_APP_BACKEND_URL + "/province", {
          name
        });
      }

      props.setShowModal(false);
      props.getData && props.getData();
    } catch (error) {
      // console.log(error.response);
      if (error.response && error.response.data) {
        notification.error({ message: error.response.data.message });
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
        <Form.Item label="Tên">
          <Input value={name} onChange={e => setName(e.target.value)} />
        </Form.Item>

        <Form.Item>
          <Button onClick={handleOnSubmit}>Gửi</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const Location = props => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const getData = async () => {
    const response = await axios(
      process.env.REACT_APP_BACKEND_URL + "/province"
    );
    setData(response.data.data);
  };

  const handleOnDelete = async _id => {
    await axios.delete(process.env.REACT_APP_BACKEND_URL + "/province/" + _id);

    notification.success({
      message: "Delete successfully"
    });

    getData();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name"
    },

    {
      title: "Action",
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
      title="Quản lý tỉnh/thành"
      extra={[
        <Button key="add-new" onClick={() => setShowModal(true)}>
          Thêm tỉnh/thành
        </Button>
      ]}
    >
      {showModal && (
        <ProvinceModal
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

export default Location;
