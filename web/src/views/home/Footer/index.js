import React from "react";
import { Layout, Row, Col, Icon } from "antd";

import "./style.scss";

const { Footer } = Layout;

const PageFooter = props => {
  return (
    <Footer className="page-footer">
      <Row type="flex" className="line-1">
        <Col xs={24} md={12}>
          <Row type="flex" className="address">
            <Col xs={24} md={8}>
              <img src="/image/logo-nhg-gold.png" />
            </Col>
            <Col xs={24} md={15} className="info">
              <p>Tập Đoàn Nguyễn Hoàng</p>
              <p>
                Lầu 9, Tòa nhà iTower, 49 Phạm Ngọc Thạch, Phường 6, Quận 3,
                TP.HCM
              </p>
              <p>Điện thoại: (84.28) 38 233 533</p>
              <p>Email: contact@nhg.vn</p>
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={12} className="connect-us">
          <Row type="flex">
            <Col className="item">Kết nối với NHG </Col>
            <Col className="item">
              <Icon type="facebook" theme="filled" /> Facebook
            </Col>
            <Col className="item">
              <Icon type="youtube" theme="filled" /> Youtube
            </Col>
          </Row>
        </Col>
      </Row>
      <Row type="flex" className="copyright">
        <Col xs={24} md={12} className="copyright-col">
          <p>Copyright © 2017 NHG. All rights reserved</p>
          <p>Updated in 2019</p>
        </Col>
        <Col xs={24} md={12} className="copyright-col">
          <Row className="short-link">
            <Col className="item">
              <a href="https://nhg.vn/" target="__blank">
                TRANG CHỦ
              </a>
            </Col>
            <Col className="item">
              <a href="https://nhg.vn/vi/lien-he" target="__blank">
                LIÊN HỆ
              </a>
            </Col>
            <Col className="item">
              <a href="https://nhg.vn/vi/so-do-website" target="__blank">
                SƠ ĐỒ WEBSITE
              </a>
            </Col>
          </Row>
        </Col>
      </Row>
    </Footer>
  );
};

export default PageFooter;
