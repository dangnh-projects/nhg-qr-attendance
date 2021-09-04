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

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

const UploadButton = ({ loading = false }) => (
  <div>
    <Icon type={loading ? "loading" : "plus"} />
    <div className="ant-upload-text">Upload</div>
  </div>
);

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }

  return false;
}

const LocationModal = props => {
  const [name, setName] = useState(props.item ? props.item.name : "");
  const [name_en, setNameEn] = useState(props.item ? props.item.name_en : "");
  const [author, setAuthor] = useState(props.item ? props.item.author : "");
  const [quote, setQuote] = useState(props.item ? props.item.quote : "");
  const [quote_en, setQuoteEn] = useState(
    props.item ? props.item.quote_en : ""
  );
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImage] = useState();
  const [quote_name, setQuoteName] = useState(
    props.item ? props.item.quote_name : ""
  );
  const [quote_name_en, setQuoteNameEn] = useState(
    props.item ? props.item.quote_name_en : ""
  );
  const [publisher, setPublisher] = useState(
    props.item ? props.item.publisher : ""
  );
  const [publisher_en, setPublisherEn] = useState(
    props.item ? props.item.publisher_en : ""
  );
  const [size, setSize] = useState(props.item ? props.item.size : "");
  const [description, setDescription] = useState(
    props.item ? props.item.description : ""
  );
  const [description_en, setDescriptionEn] = useState(
    props.item ? props.item.description_en : ""
  );

  const handleChange = info => {
    if (info && info.file) {
      // Get this url from response in real world.
      getBase64(info.file, imageUrl => {
        setImage(imageUrl);
        setLoading(false);
      });
    }
  };

  const handleOnSubmit = async () => {
    const data = {
      name,
      name_en,
      author,
      quote,
      quote_en,
      quote_name,
      quote_name_en,
      publisher,
      publisher_en,
      size,
      description
    };

    if (imageUrl) {
      data.image = imageUrl;
    }
    if (props.item && props.item._id) {
      await axios.put(
        process.env.REACT_APP_BACKEND_URL + "/book/" + props.item._id,
        data
      );

      props.setCurrentItem(null);
    } else {
      await axios.post(process.env.REACT_APP_BACKEND_URL + "/book", data);
    }

    props.setShowModal(false);
    props.getData && props.getData();
  };
  return (
    <Modal
      visible={props.visible}
      footer={null}
      onCancel={() => props.setShowModal(false)}
      width={800}
    >
      <Form>
        <Form.Item label="Image">
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            beforeUpload={beforeUpload}
            onChange={handleChange}
            multiple={false}
            showUploadList={false}
          >
            {!imageUrl && props.item && props.item.image && (
              <img
                src={
                  process.env.REACT_APP_BACKEND_URL +
                  "/images/" +
                  props.item.image
                }
                alt="avatar"
                style={{ width: "100%" }}
              />
            )}
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
            ) : (
              <UploadButton loading={loading} />
            )}
          </Upload>
        </Form.Item>
        <Row type="flex" gutter={16} style={{ width: "100%" }}>
          <Col xs={24} md={12}>
            <Form.Item label="Tên sách">
              <Input value={name} onChange={e => setName(e.target.value)} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Tên sách (tiếng Anh)">
              <Input
                value={name_en}
                onChange={e => setNameEn(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Tác giả">
          <Input value={author} onChange={e => setAuthor(e.target.value)} />
        </Form.Item>

        <Row type="flex" gutter={16} style={{ width: "100%" }}>
          <Col xs={24} md={12}>
            <Form.Item label="Trích dẫn">
              <TextArea
                value={quote}
                onChange={e => setQuote(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Trích dẫn (tiếng Anh)">
              <TextArea
                value={quote_en}
                onChange={e => setQuoteEn(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row type="flex" gutter={16} style={{ width: "100%" }}>
          <Col xs={24} md={12}>
            <Form.Item label="Người trích dẫn">
              <Input
                value={quote_name}
                onChange={e => setQuoteName(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Người trích dẫn (tiếng Anh)">
              <Input
                value={quote_name_en}
                onChange={e => setQuoteNameEn(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row type="flex" gutter={16} style={{ width: "100%" }}>
          <Col xs={24} md={12}>
            <Form.Item label="Nhà xuất bản">
              <Input
                value={publisher}
                onChange={e => setPublisher(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Nhà xuất bản (tiếng Anh)">
              <Input
                value={publisher_en}
                onChange={e => setPublisherEn(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Kích thước">
          <Input value={size} onChange={e => setSize(e.target.value)} />
        </Form.Item>

        <Form.Item label="Mô tả">
          <CKEditor
            editor={ClassicEditor}
            data={description}
            onChange={(event, editor) => {
              const data = editor.getData();
              setDescription(data);
            }}
          />
        </Form.Item>

        <Form.Item label="Mô tả (tiếng Anh)">
          <CKEditor
            editor={ClassicEditor}
            data={description_en}
            onChange={(event, editor) => {
              const data = editor.getData();
              setDescriptionEn(data);
            }}
          />
        </Form.Item>

        <Form.Item>
          <Button onClick={handleOnSubmit}>Gửi</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const BookLst = props => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const getData = async () => {
    const response = await axios(process.env.REACT_APP_BACKEND_URL + "/book");
    setData(response.data.data);
  };

  const handleOnDelete = async _id => {
    await axios.delete(process.env.REACT_APP_BACKEND_URL + "/book/" + _id);

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
      title: "Tác giả",
      dataIndex: "author"
    },
    {
      title: "Nhà xuất bản",
      dataIndex: "publisher"
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
      title="Quản lý sách"
      extra={[
        <Button key="add-new" onClick={() => setShowModal(true)}>
          Thêm sách
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
  return <BookLst />;
};

export default Location;
