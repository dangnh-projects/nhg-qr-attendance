import React, { useState, useEffect } from "react";
import intl from 'react-intl-universal';
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
  Upload,
  message,
  Col
} from "antd";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const { TextArea } = Input;

const LocationModal = props => {
  const [name, setName] = useState(props.item ? props.item.name : "");

  const handleOnSubmit = async () => {
    const data = {
      name
    };

    if (props.item && props.item._id) {
      await axios.put(
        process.env.REACT_APP_BACKEND_URL + "/department/" + props.item._id,
        data
      );

      props.setCurrentItem(null);
    } else {
      await axios.post(process.env.REACT_APP_BACKEND_URL + "/department", data);
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
        <Form.Item label={intl.get('DEPARTMENT.NAME')}>
          <Input value={name} onChange={e => setName(e.target.value)} />
        </Form.Item>

        <Form.Item>
          <Button onClick={handleOnSubmit}>{intl.get('DEPARTMENT.SUBMIT')}</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const DepartmentList = props => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const getData = async () => {
    const response = await axios(
      process.env.REACT_APP_BACKEND_URL + "/department"
    );
    setData(response.data.data);
  };

  const handleOnDelete = async _id => {
    await axios.delete(
      process.env.REACT_APP_BACKEND_URL + "/department/" + _id
    );

    notification.success({
      message: intl.get('DEPARTMENT.MSG_DELETE_SUCCESS')
    });

    getData();
  };

  const columns = [
    {
      title: intl.get('DEPARTMENT.NAME'),
      dataIndex: "name"
    },

    {
      title: intl.get('DEPARTMENT.ACTION'),
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
      title={intl.get('DEPARTMENT.DEPARTMENT_MNGT')}
      extra={[
        <Button key="add-new" onClick={() => setShowModal(true)}>
          {intl.get('DEPARTMENT.ADD')}
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
  return <DepartmentList />;
};

export default Location;
