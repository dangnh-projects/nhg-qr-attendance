import React, { useState, useRef, useEffect } from "react";
import { Row, Col } from "antd";
import "./style.scss";

const Invitation = ({ img, id, name, desc }) => (
  <Col
    xs={24}
    md={8}
    style={{ padding: 12, display: "flex", flexDirection: "column" }}
  >
    <Row>
      <Col xs={24} sm={12} md={24}>
        <img
          className="invitation-img"
          src={img}
          style={{
            width: "100%",
            height: "auto",
            marginBottom: 12
          }}
        />
      </Col>
      <Col xs={24} sm={12} md={24} className="invitation-info">
        <Col xs={4} lg={3} style={{ display: "flex" }}>
          <Row
            style={{
              backgroundColor: "white",
              color: "#246B00",
              padding: "4px 10px",
              maxWidth: "min-content",
              marginTop: 4
            }}
          >
            {id}
          </Row>
        </Col>
        <Col xs={18} style={{ textAlign: "left" }}>
          <Row style={{ fontWeight: "bold" }}>{name}</Row>
          <Row>{desc}</Row>
        </Col>
      </Col>
    </Row>
    <Row style={{ width: 250 }}></Row>
  </Col>
);

const InvitationSection = () => (
  <Row>
    <Col
      style={{
        width: "100vw",
        minHeight: "max-content",
        backgroundImage: "url('/image/speaker-bg.png')",
        color: "white",
        position: "relative",
        minHeight: 260,
        backgroundSize: "cover"
      }}
    >
      <div
        style={{
          backgroundImage: 'url("/image/speaker-bg-pattern.png")',
          position: "absolute",
          width: 230,
          height: "100%",
          top: 0,
          left: 0,
          backgroundSize: "cover"
        }}
      />
      <Row type="flex" justify="center" style={{ marginTop: 100 }}>
        <Col className="invitation-container" xs={24} sm={20} md={20} lg={16}>
          <Invitation
            img="/image/manhcuong.jpg"
            id={1}
            name="TS. Đỗ Mạnh Cường"
            desc="Phó Tổng Giám đốc phụ trách chuyên môn khối K-12 NHG"
          />
          <Invitation
            img="/image/nguyen-van-phuoc.jpg"
            id={2}
            name="Ông Nguyễn Văn Phước"
            desc="Người sáng lập First News"
          />
          <Invitation
            img="/image/thu-ha.jpg"
            id={3}
            name="Nhà báo Thu Hà"
            desc="Tác giả quyển sách nổi tiếng 
        “Con nghĩ đi, mẹ không biết”"
          />
        </Col>
        <Col xs={24} sm={20} md={20} lg={16} style={{ padding: 12 }}>
          <Row style={{ display: "flex", flexDirection: "column" }}>
            <Col
              xs={24}
              style={{
                borderLeft: "8px solid white",
                textAlign: "left",
                paddingLeft: 20,
                textTransform: "uppercase",
                fontWeight: "bold",
                paddingTop: 4,
                paddingBottom: 4,
                fontSize: 24
              }}
            >
              Họp báo
            </Col>
            <Col
              xs={24}
              style={{
                textAlign: "left",
                paddingLeft: 28,
                marginTop: 8,
                marginBottom: 20
              }}
            >
              Thời gian: <b>10h - 12h - 03/12/2019</b> <br /> Địa điểm:{" "}
              <b>Hội trường Betthoven - Trường ĐH Quốc tế Hồng Bàng</b> | 215
              Điện Biên Phủ, P.15, Bình Thạnh, TP.HCM
            </Col>
          </Row>
        </Col>
      </Row>
    </Col>
  </Row>
);

export default InvitationSection;
