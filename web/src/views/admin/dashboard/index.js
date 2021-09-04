import React, { useState, useEffect, Suspense, memo, lazy } from "react";
import { Row, Col, Card, Icon, Spin, Table, Progress, Modal } from "antd";
import intl from "react-intl-universal";

import axios from "axios";
import moment from "moment";

const UserTable = lazy(() => import("./UserTable"));
const AttendanceStatistics = lazy(() => import("./Statistics"));

const SessionTable = ({ sessions, setCurrentSession }) => {
  const columns = [
    { title: intl.get("DASHBOARD.NAME"), dataIndex: "name" },
    {
      title: intl.get("DASHBOARD.DATE"),
      render: (_, record) => moment(record.date).format("DD/MM/YYYY")
    },
    {
      align: "center",
      title: intl.get("DASHBOARD.ATTENDANCE_STATUS"),
      render: (_, record) => {
        const { attends, notAttends } = record;
        const sum = attends.length + notAttends.length;
        return (
          <Progress
            percent={sum > 0 ? (attends.length / sum) * 100 : 0}
            size="small"
            format={() => `${attends.length} / ${sum}`}
          />
        );
      }
    }
  ];

  return (
    <Card title={intl.get("DASHBOARD.SESSIONS")}>
      <Row>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={sessions}
          onRow={(record, rowIndex) => {
            return {
              onClick: event => {
                setCurrentSession(record);
              }
            };
          }}
        />
      </Row>
    </Card>
  );
};

const Dashboard = prosp => {
  const [sessions, setSessions] = useState([]);
  const [currenstSession, setCurrentSession] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [users, setUsers] = useState([]);
  const getSessions = async () => {
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/dashboard/stat"
    );

    setSessions(response.data.sessions);
  };

  useEffect(() => {
    getSessions();
    return () => {
      console.log("Dashboard disappear");
    };
  }, []);

  return (
    <Row gutter={[16, 16]}>
      <Suspense fallback={<Spin />}>
        <UserTable
          users={users}
          visible={showUserModal}
          setVisible={setShowUserModal}
        />
      </Suspense>
      <Col xs={24} md={24}>
        <SessionTable
          sessions={sessions}
          setCurrentSession={setCurrentSession}
        />
      </Col>

      {currenstSession && (
        <div>
          <Col xs={24}>
            <Suspense fallback={<Spin />}>
              <AttendanceStatistics
                session={currenstSession}
                setShowUserModal={setShowUserModal}
                setUsers={setUsers}
              />
            </Suspense>
          </Col>
        </div>
      )}
    </Row>
  );
};

export default Dashboard;
