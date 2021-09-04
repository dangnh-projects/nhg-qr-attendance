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
  Tabs,
  Select
} from "antd";
import Province from "./province";
import { navigate } from "@reach/router";

const { TabPane } = Tabs;
const { Option } = Select;

const LocationModal = props => {
  const [provinces, setProvinces] = useState([]);
  const [name, setName] = useState(props.item ? props.item.name : "");
  const [address, setAddress] = useState(props.item ? props.item.address : "");
  const [province, setProvince] = useState(
    props.item && props.item.province ? props.item.province._id : ""
  );

  const getProvinces = async () => {
    const response = await axios(
      process.env.REACT_APP_BACKEND_URL + "/province"
    );
    setProvinces(response.data.data);
  };

  useEffect(() => {
    getProvinces();
  }, []);
  const handleOnSubmit = async () => {
    if (!name) {
      notification.error({ message: "Hãy nhập tên địa điểm" });
      return;
    }
    if (!address) {
      notification.error({ message: "Hãy nhập địa chỉ" });
      return;
    }
    if (!province) {
      notification.error({ message: "Hãy chọn tỉnh/thành" });
      return;
    }
    if (props.item && props.item._id) {
      await axios.put(
        process.env.REACT_APP_BACKEND_URL + "/location/" + props.item._id,
        {
          name,
          address,
          province
        }
      );

      props.setCurrentItem(null);
    } else {
      await axios.post(process.env.REACT_APP_BACKEND_URL + "/location", {
        name,
        address,
        province
      });
    }

    props.setShowModal(false);
    props.getData && props.getData();
  };
  return (
    <Modal
      visible={props.visible}
      footer={null}
      onCancel={() => props.setShowModal(false)}
    >
      <Form>
        <Form.Item label="Tỉnh/Thành phố">
          <Select
            defaultValue={
              props.item && props.item.province && props.item.province._id
            }
            onChange={val => setProvince(val)}
          >
            {provinces.map(province => (
              <Option key={province._id}>{province.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Tên">
          <Input value={name} onChange={e => setName(e.target.value)} />
        </Form.Item>

        <Form.Item label="Địa chỉ">
          <Input value={address} onChange={e => setAddress(e.target.value)} />
        </Form.Item>

        <Form.Item>
          <Button onClick={handleOnSubmit}>Gửi</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const LocationLst = props => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const getData = async () => {
    const response = await axios(
      process.env.REACT_APP_BACKEND_URL + "/location"
    );
    setData(response.data.data);
  };

  const handleOnDelete = async _id => {
    await axios.delete(process.env.REACT_APP_BACKEND_URL + "/location/" + _id);

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
      title: "Tỉnh thành",
      render: (_, record) => {
        return record.province && record.province.name;
      }
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
      title="Quản lý địa điểm"
      extra={[
        <Button key="add-new" onClick={() => setShowModal(true)}>
          Thêm địa điểm
        </Button>
      ]}
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
      <Table dataSource={data} columns={columns} />
    </Card>
  );
};

export const Location = props => {
  return (
    <Tabs defaultActiveKey={1}>
      <TabPane tab="Địa điểm" key="1">
        <LocationLst />
      </TabPane>
      <TabPane tab="Tỉnh/thành" key="2">
        <Province />
      </TabPane>
    </Tabs>
  );
};

export default Location;
