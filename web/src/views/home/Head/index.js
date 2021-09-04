import React from "react";
import { Layout, Row, Col } from "antd";
import "./style.scss";
const { Header } = Layout;

const HeadTool = props => {
  return (
    <Row type="flex" className="head-tools">
      <Col className="item">
        <img alt="home" src="/image/icon-home.png" />
      </Col>
      <Col className="item">
        <img alt="head-1" src="/image/flag-en.jpg" />
      </Col>
      <Col alt="head-2" className="item">
        <img src="/image/flag-vi.jpg" />
      </Col>
    </Row>
  );
};

const HeadMenu = props => {
  return (
    <Row className="head-menu">
      <Col className="head-menu-item">
        <a href="https://nhg.vn/vi/tong-quan" target="__black">
          Giới thiệu
        </a>
      </Col>
      <Col className="head-menu-item">
        <a href="https://nhg.vn/vi/thanh-vien" target="__blank">
          thành viên
        </a>
      </Col>
      <Col className="head-menu-item">
        <a href="https://nhg.vn/vi/tin-tuc" target="__blank">
          Tin tức và sự kiện
        </a>
      </Col>
      <Col className="head-menu-item">
        <a href="https://nhg.vn/vi/hoat-dong-cong-dong" target="__blank">
          Hoạt động cộng đồng
        </a>
      </Col>
      <Col className="head-menu-item">
        <a href="https://nhg.vn/vi/nghe-nghiep" target="__blank">
          nghề nghiệp
        </a>
      </Col>
      <Col className="head-menu-item">
        <a href="https://nhg.vn/vi/lien-he" target="__blank">
          liên hệ
        </a>
      </Col>
    </Row>
  );
};

const Head = props => {
  return (
    <Header className="home-header">
      <Row type="flex" className="home-header-container">
        <Col>
          <img src="/image/nhg-home-logo.png" style={{ height: 40 }} />
        </Col>
        <Col className="header-tool-menu" style={{}}>
          <HeadTool />
          <HeadMenu />
        </Col>
      </Row>
    </Header>
  );
};

export default Head;
