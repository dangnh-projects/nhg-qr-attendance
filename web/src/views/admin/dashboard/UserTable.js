import React from "react";
import { Modal, Row, Table } from "antd";
import intl from 'react-intl-universal';

const UserTable = ({ users = [], visible = false, setVisible }) => {
  return (
    <Modal
      visible={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      footer={false}
    >
      <Row>
        <Table
          rowKey="_id"
          columns={[
            {
              title: intl.get('DASHBOARD.NAME'),
              dataIndex: "name"
            },
            {
              title: "Department",
              render: (_, record) => record.department && record.department.name
            },

            {
              title: "School",
              render: (_, record) => record.school && record.school.name
            }
          ]}
          dataSource={users}
        />
      </Row>
    </Modal>
  );
};

export default UserTable;
