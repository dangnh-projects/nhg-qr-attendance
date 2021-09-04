import React, { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import moment from "moment";
import XLSX from "xlsx";

import fileDownload from "react-file-download";
import intl from "react-intl-universal";
import {
  Card,
  Button,
  Table,
  Row,
  Col,
  Icon,
  Popconfirm,
  notification,
  Spin,
  Modal,
  Input
} from "antd";
import QRModal from "./QRModal";
import slugify from "slugify";

const AddAttendeeModal = lazy(() => import("./AddAtendeeModal"));

const { Search } = Input;

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

const RegistrationModal = props => {
  const { id } = props;
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showQrModal, setShowQRModal] = useState(false);

  const [searchedData, setSearchedData] = useState([]);
  const [isSeach, setSetIsSearch] = useState(false);

  const getData = async page => {
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/session/" + id + "/attendees"
    );

    let data = response.data.data;
    data = data.sort((a, b) => (a.user.name < b.user.name ? -1 : 1));
    setData(data);
    setTotal(data.length);
  };

  const handleOnDelete = async _id => {
    await axios.delete(process.env.REACT_APP_BACKEND_URL + "/attendee/" + _id);

    notification.success({
      message: "Delete successfully"
    });

    getData();
  };

  const downloadFile = async () => {
    const wopts = { bookType: "xlsx", bookSST: false, type: "binary" };
    // console.log(data);
    const output = [];
    let dt = isSeach ? searchedData : data;
    if (dt && dt.length === 0) {
      notification({
        message: "No data"
      });

      return;
    }

    const session = dt[0].session;

    dt.forEach((attendance, idx) => {
      const item = {};
      item[intl.get("USER.ID")] = idx + 1;
      item[intl.get("USER.NAME")] = attendance.user.name;
      item[intl.get("USER.EMAIL")] = attendance.user.email;
      item[intl.get("USER.DEPARTMENT")] = attendance.user.department
        ? attendance.user.department.name
        : "";
      item[intl.get("USER.SCHOOL")] = attendance.user.school
        ? attendance.user.school.name
        : "";

      if (attendance.isAttend) {
        item[intl.get("USER.CODE")] = attendance.code;
        item[intl.get("USER.CHECKIN_TIME")] = moment(attendance.attendDate).format("DD/MM/YYYY HH:mm:ss");
      }
      output.push(item);
    });

    const wb = {
      Sheets: {
        report: XLSX.utils.json_to_sheet(output)
      },
      SheetNames: ["report"]
    };

    const wbout = XLSX.write(wb, wopts);

    let name = session && session.name.toLowerCase();

    if (name.length > 0) {
      name = name
        .split(" ")
        .map(ent => {
          ent = ent.split("");
          ent[0] = ent[0].toLocaleUpperCase();
          return ent.join("");
        })
        .join(" ");

      // name = slugify(name);
      name = name.replace(/ /g, "");
    }

    fileDownload(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
      `${name}-${moment().format("DD-MM-YYYY")}.xlsx`
    );
  };

  const handleChangePage = page => getData(page);

  const columns = [
    {
      title: intl.get("USER.NAME"),
      render: (_, record) => record.user && record.user.name
    },

    {
      title: intl.get("USER.EMAIL"),
      render: (_, record) => record.user && record.user.email
    },
    {
      title: intl.get("USER.CODE"),
      dataIndex: "code"
    },

    {
      title: intl.get("USER.CHECKIN_TIME"),
      render: (_, record) =>
        record.attendDate &&
        moment(record.attendDate).format("DD/MM/YYYY HH:mm:ss")
    },

    {
      title: "",
      align: "center",
      render: (_, record) => {
        return (
          <Row type="flex" gutter={16} justify="center">
            {/* <Col>
              <Button
                onClick={() => {
                  setCurrentItem(record);
                  setShowQRModal(true);
                }}
              >
                <Icon type="qrcode" />
              </Button>
            </Col> */}
            <Popconfirm
              placement="top"
              title={"Delete row?"}
              onConfirm={() => {
                handleOnDelete(record._id);
              }}
              okText="Yes"
              cancelText="No"
              disabled={record.attendDate}
            >
              <Button disabled={record.attendDate} type="danger">
                <Icon type="delete" />
              </Button>
            </Popconfirm>
          </Row>
        );
      }
    }
  ];

  const rowSelection = {
    onChange: (_, selectedRows) => {
      setSelectedRows(selectedRows);
    }
  };

  const handleOnSendQR = () => {
    Modal.info({
      title: "Send QR Code to Attendees",
      maskClosable: true,
      width: 600,
      content: (
        <Row>
          <Col>Are you sure to send Email to following people?</Col>
          <ul style={{ padding: 18 }}>
            {selectedRows.map(row => (
              <li key={row._id} style={{ padding: 8 }}>
                <strong>{row.user && row.user.name}</strong> -{" "}
                {row.user && row.user.email}
              </li>
            ))}
          </ul>
        </Row>
      ),
      onOk: async () => {
        const info = selectedRows.map(row => row._id);
        await axios.post(
          process.env.REACT_APP_BACKEND_URL + "/session/" + id + "/email",
          {
            attendees: info
          }
        );

        notification.success({ message: "Success!" });
      }
    });
  };

  useEffect(() => {
    if (id) {
      // get Atterndees
      getData();
    }
  }, [id]);

  const handleOnSearch = term => {
    term = slugify(term.toLowerCase(), " ");
    const filtered = data.filter(
      item =>
        slugify(item.user.name.toLowerCase(), " ").includes(term) ||
        item.user.email.includes(term)
    );

    setSetIsSearch(true);
    setSearchedData(filtered);
  };
  return (
    <Card
      title="Training Session Attendees"
      extra={[
        <Row gutter={16} type="flex">
          <Col>
            <Search onSearch={handleOnSearch} />
          </Col>
          <Col>
            <Button key="btn-add" onClick={() => setShowModal(true)}>
              Add
            </Button>
          </Col>
          <Col>
            <Button key="btn-send-qr" onClick={handleOnSendQR}>
              Send code{/* Send <Icon type="qrcode" /> */}
            </Button>
          </Col>
          <Col>
            <Button key="btn-send-qr" onClick={downloadFile}>
              Export <Icon type="cloud-download" />
            </Button>
          </Col>
        </Row>
      ]}
    >
      {showModal && (
        <Suspense fallback={<Spin />}>
          <AddAttendeeModal
            visible={showModal}
            setShowModal={setShowModal}
            item={currentItem}
            setCurrentItem={setCurrentItem}
            getData={getData}
            sessionId={id}
          />
        </Suspense>
      )}

      {showQrModal && (
        <QRModal
          attendee={currentItem}
          visible={showQrModal}
          setShowQRModal={setShowQRModal}
        />
      )}
      <Table
        rowSelection={rowSelection}
        rowKey="_id"
        dataSource={isSeach ? searchedData : data}
        columns={columns}
        pagination={{
          total: isSeach ? searchedData.length : data.length,
          onChange: handleChangePage
        }}
      />
    </Card>
  );
};

export default RegistrationModal;
