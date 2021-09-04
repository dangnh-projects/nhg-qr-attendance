import React from "react";
import { Modal, Row, Col } from "antd";
import "./style.scss";

const BookModal = ({ visible, setShowModal, book = {} }) => {
  return (
    <Modal
      visible={visible}
      cancelText="Close"
      onCancel={() => setShowModal(false)}
      // width={640}
      centered
      footer={null}
    >
      <Row type="flex" justify="center">
        <img
          alt={book.name}
          src={`${process.env.REACT_APP_BACKEND_ROOT}/images/${book.image}`}
          style={{ width: "auto", height: "auto", maxHeight: 230 }}
        />
      </Row>
      <Row style={{ padding: 24 }}>
        <Row type="flex" style={{ marginTop: 12 }}>
          <Col
            xs={24}
            style={{ color: "#246B00", fontSize: 20, fontWeight: "bold" }}
          >
            {book.name}
          </Col>
        </Row>

        <Row style={{ marginTop: 12 }}>
          Tác giả: <b style={{ color: "#7b7b7b" }}>{book.author}</b>
        </Row>

        <Row style={{ marginTop: 12 }}>
          Đơn vị xuất bản: <b style={{ color: "#7b7b7b" }}>{book.publisher}</b>
        </Row>

        <Row
          style={{ borderTop: "3px solid #246B00", width: 38, marginTop: 12 }}
        />

        <Row type="flex" style={{ marginTop: 12 }}>
          <Col
            className="description-area"
            style={{ maxHeight: 200, overflow: "scroll", overflowX: "hidden" }}
          >
            <div dangerouslySetInnerHTML={{ __html: book.description }} />
          </Col>
        </Row>
      </Row>
    </Modal>
  );
};

export default BookModal;
