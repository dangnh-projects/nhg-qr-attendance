import React, { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import moment from "moment";
import {
  Card,
  Button,
  Popconfirm,
  Input,
  Icon,
  Row,
  Table,
  notification,
  Col,
  Spin
} from "antd";
import { navigate } from "@reach/router";
import intl from "react-intl-universal";
import slugify from "slugify";

const { Search } = Input;

const SessionModal = lazy(() => import("./SessionModal"));

export const Session = props => {
  const [data, setData] = useState([]);
  const [searchedData, setSearchedData] = useState([]);
  const [isSeach, setSetIsSearch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const getData = async page => {
    const response = await axios(
      process.env.REACT_APP_BACKEND_URL + "/session?offset=" + currentPage * 10
    );

    const data = response.data.data;
    setData(data);
    setTotal(data.length);
  };

  const handleOnDelete = async _id => {
    await axios.delete(process.env.REACT_APP_BACKEND_URL + "/session/" + _id);

    notification.success({
      message: "Delete successfully"
    });

    getData();
  };

  const handleChangePage = page => getData(page);

  const columns = [
    {
      title: intl.get("SESSION.NAME"),
      dataIndex: "name"
    },
    {
      title: intl.get("SESSION.CODE"),
      dataIndex: "code"
    },

    {
      title: intl.get("SESSION.DATE"),
      render: (_, record) => moment(record.date).format("DD/MM/YYYY")
    },

    {
      title: intl.get("SESSION.START_TIME"),
      render: (_, record) => moment(record.startTime).format("HH:mm")
    },

    {
      title: intl.get("SESSION.END_TIME"),
      render: (_, record) => moment(record.endTime).format("HH:mm")
    },

    {
      title: intl.get("SESSION.ACTION"),
      align: "center",
      render: (_, record) => {
        return (
          <Row type="flex" gutter={16} justify="center">
            <Col>
              <Button
                onClick={() =>
                  navigate("/session/" + record._id + "/registration")
                }
              >
                <Icon type="profile" />
              </Button>
            </Col>
            <Col>
              <Button
                onClick={() =>
                  navigate(
                    "/dashboard/session/" + record._id + "/registrations"
                  )
                }
              >
                <Icon type="team" />
              </Button>
            </Col>
            <Col>
              <Button
                onClick={() => {
                  setCurrentItem(record);
                  setShowModal(true);
                }}
              >
                <Icon type="form" />
              </Button>
            </Col>
            {/* <Popconfirm
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
            </Popconfirm> */}
          </Row>
        );
      }
    }
  ];

  useEffect(() => {
    getData();
  }, []);

  const handlOnSearch = term => {
    term = slugify(term.toLowerCase(), " ");
    const filtered = data.filter(item =>
      slugify(item.name.toLowerCase(), " ").includes(term)
    );

    setSetIsSearch(true);
    setSearchedData(filtered);
  };

  return (
    <Card
      title={intl.get("SESSION.SESSION_MNGT")}
      extra={[
        <Row gutter={16} type="flex">
          <Col>
            <Search key="search-input" onSearch={handlOnSearch} />
          </Col>
          <Col>
            <Button key="btn-add" onClick={() => setShowModal(true)}>
              {intl.get("SESSION.ADD")}
            </Button>
          </Col>
        </Row>
      ]}
    >
      {showModal && (
        <Suspense fallback={<Spin />}>
          <SessionModal
            visible={showModal}
            setShowModal={setShowModal}
            item={currentItem}
            setCurrentItem={setCurrentItem}
            getData={getData}
          />
        </Suspense>
      )}
      <Table
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

export default Session;
