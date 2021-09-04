import React, { Component, useState, useEffect } from "react";
import intl from "react-intl-universal";
import http from "axios";
// import lodash from './lodash_find';
import { navigate } from "@reach/router";
import { Layout, Menu, Icon } from "antd";
const { Header, Content, Footer } = Layout;

require("intl/locale-data/jsonp/en");
require("intl/locale-data/jsonp/vi");

const SUPPOER_LOCALES = [
  {
    name: "English",
    value: "en-US"
  },
  {
    name: "Tiếng Việt",
    value: "vi-VN"
  }
];

const Admin1 = props => {
  const [initDone, setInitDone] = useState(false);

  const onSelectLocale = param => {
    let lang = param.key === "9-1" ? "en-US" : "vi-VN";
    window.location.search = `?lang=${lang}`;
  };

  const loadLocales = async () => {
    let currentLocale = intl.determineLocale({
      urlLocaleKey: "lang",
      cookieLocaleKey: "lang"
    });

    // if (!lodash.find(SUPPOER_LOCALES, {value: currentLocale})) {
    if (!SUPPOER_LOCALES.find(({ value }) => value === currentLocale)) {
      currentLocale = "vi-VN";
    }

    const res = await http.get(`/locales/${currentLocale}.json`);

    console.log("Locale data: ", res.data);
    intl.init({
      currentLocale,
      locales: {
        [currentLocale]: res.data
      }
    });
    setInitDone(true);
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      navigate("/login");
    }
    loadLocales();
  }, []);

  return (
    initDone && (
      <Layout style={{ minHeight: "100vh" }}>
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
            style={{ lineHeight: "64px", margin: 0 }}
          >
            <Menu.Item onClick={() => navigate("/dashboard")} key="1">
              {intl.get("MENU.DASHBOARD")} <Icon type="dashboard" />
            </Menu.Item>
            <Menu.Item onClick={() => navigate("/dashboard/check-in")} key="2">
              {intl.get("MENU.CHECKIN")} <Icon type="check" />
            </Menu.Item>
            <Menu.Item
              onClick={() => navigate("/dashboard/department")}
              key="3"
            >
              {intl.get("MENU.DEPARTMENT")} <Icon type="apartment" />
            </Menu.Item>
            <Menu.Item onClick={() => navigate("/dashboard/school")} key="8">
              {intl.get("MENU.SCHOOL")} <Icon type="cluster" />
            </Menu.Item>
            <Menu.Item onClick={() => navigate("/dashboard/session")} key="4">
              {intl.get("MENU.SESSION")} <Icon type="schedule" />
            </Menu.Item>
            <Menu.Item onClick={() => navigate("/dashboard/user")} key="6">
              {intl.get("MENU.USER")} <Icon type="user" />
            </Menu.Item>
            {/* <Menu.Item onClick={() => navigate("/dashboard/tool")} key="7">
              {intl.get("MENU.QR_TOOL")} <Icon type="tool" />
            </Menu.Item> */}
            <Menu.SubMenu
              onClick={onSelectLocale}
              title={intl.get("LANGUAGE")}
              key="9"
            >
              <Menu.Item key="9-1">English</Menu.Item>
              <Menu.Item key="9-2">Tiếng Việt</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Header>
        <Content style={{ padding: 24, flex: 1 }}>{props.children}</Content>
        <Footer></Footer>
      </Layout>
    )
  );
};

export default Admin1;
