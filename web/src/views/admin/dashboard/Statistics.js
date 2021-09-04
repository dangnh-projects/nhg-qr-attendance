import React, { memo, Fragment } from "react";
import { Row, Col, Card } from "antd";
import intl from "react-intl-universal";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const defaultColors = [
  "#004D40",
  "#FF6D00",
  "#3E2723",
  "#546E7A",
  "#673ab7",
  "#009688",
  "#4caf50",
  "#03A9F4",
  "#ffc107",
  "#396cc6",
  "#F07077",
  "#9c27b0",
  "#263238",
  "#3e2723",
  "#ffd600",
  "#33691e",
  "#40c4ff",
  "#3f51b5",
  "#d81b60",
  "#ef9a9a",
  "#9ccc65"
];

const ChartWrapper = ({ options, colors = defaultColors }) => {
  const opts = Object.assign({}, options, {
    colors,
    credits: {
      enabled: false
    }
  });

  return <HighchartsReact highcharts={Highcharts} options={opts} />;
};

const AttendanceByDepartmentColumn = memo(
  ({ session, setUsers, setShowUserModal }) => {
    const { attends, notAttends } = session;
    const deptObj = {};

    attends.forEach(attend => {
      const { user } = attend;
      if (user) {
        const { department } = user;
        if (department) {
          if (!deptObj[department._id]) {
            deptObj[department._id] = {
              department,
              attends: []
            };
          }

          deptObj[department._id].attends.push(user);
        }
      }
    });

    notAttends.forEach(attend => {
      const { user } = attend;
      if (user) {
        const { department } = user;
        if (department) {
          if (!deptObj[department._id]) {
            deptObj[department._id] = {
              department,
              notAttends: []
            };
          }

          if (!deptObj[department._id].notAttends) {
            deptObj[department._id].notAttends = [];
          }

          deptObj[department._id].notAttends.push(user);
        }
      }
    });

    const attendVal = [];
    const notAttendVal = [];
    const deptUsers = {};

    Object.keys(deptObj).forEach(key => {
      attendVal.push(deptObj[key].attends ? deptObj[key].attends.length : 0);
      notAttendVal.push(
        deptObj[key].notAttends ? deptObj[key].notAttends.length : 0
      );
      // ({
      //   name: deptObj[key].department.name,
      //   data: [
      //     deptObj[key].attends ? deptObj[key].attends.length : 0,
      //     deptObj[key].notAttends ? deptObj[key].notAttends.length : 0
      //   ]
      // })
      let deptName = deptObj[key].department.name;
      if (!deptUsers[deptName]) {
        deptUsers[deptName] = {
          attends: deptObj[key].attends,
          notAttends: deptObj[key].notAttends
        };
      }
    });

    const options = {
      chart: {
        type: "bar",
        height: 500
      },
      title: {
        text: ""
      },
      xAxis: {
        categories: Object.keys(deptObj).map(
          key => deptObj[key].department.name
        )
        // categories: ["Attend", "Absent"]
      },
      yAxis: {
        min: 0,
        tickInterval: 1,
        title: {
          text: ""
        }
      },
      legend: {
        reversed: true
      },
      tooltip: {
        pointFormat:
          '<span style="color:{point.color}">●</span> {series.name} {point.y} ({point.percentage:.1f}%)'
      },
      plotOptions: {
        series: {
          stacking: "normal"
        },
        bar: {
          events: {
            click: e => {
              const { category, colorIndex } = e.point;
              if (category && colorIndex !== undefined) {
                let users =
                  colorIndex === 0
                    ? deptUsers[category].attends
                    : deptUsers[category].notAttends;
                setUsers(users);
                setShowUserModal(true);
              }
            }
          }
        }
      },
      series: [
        {
          name: intl.get("DASHBOARD.ATTEND"),
          data: attendVal
        },
        { name: intl.get("DASHBOARD.ABSENT"), data: notAttendVal }
      ]
    };
    return <ChartWrapper options={options} colors={["#396cc6", "#F07077"]} />;
  }
);

const AttendanceBySchoolColumn = memo(
  ({ session, setUsers, setShowUserModal }) => {
    const { attends, notAttends } = session;
    const schoolObj = {};

    attends.forEach(attend => {
      const { user } = attend;
      if (user) {
        const { school } = user;
        if (school) {
          if (!schoolObj[school._id]) {
            schoolObj[school._id] = {
              school,
              attends: []
            };
          }

          schoolObj[school._id].attends.push(user);
        }
      }
    });

    notAttends.forEach(notAttend => {
      const { user } = notAttend;
      if (user) {
        const { school } = user;
        if (school) {
          if (!schoolObj[school._id]) {
            schoolObj[school._id] = {
              school,
              notAttends: []
            };
          }

          if (!schoolObj[school._id].notAttends) {
            schoolObj[school._id].notAttends = [];
          }

          schoolObj[school._id].notAttends.push(user);
        }
      }
    });

    const attendChartVal = [];
    const absentChartVal = [];
    const schoolUsers = {};

    Object.keys(schoolObj).forEach(key => {
      attendChartVal.push(
        schoolObj[key].attends ? schoolObj[key].attends.length : 0
      );
      absentChartVal.push(
        schoolObj[key].notAttends ? schoolObj[key].notAttends.length : 0
      );
      const schoolName = schoolObj[key].school.name;
      if (!schoolUsers[schoolName]) {
        schoolUsers[schoolName] = {
          attends: schoolObj[key].attends,
          notAttends: schoolObj[key].notAttends
        };
      }
    });

    const options = {
      chart: {
        type: "bar",
        height: 500
      },
      title: {
        text: ""
      },
      tooltip: {
        pointFormat:
          '<span style="color:{point.color}">●</span> {series.name} {point.y} ({point.percentage:.1f}%)'
      },
      xAxis: {
        height: 400,
        categories: Object.keys(schoolObj).map(
          key => schoolObj[key].school.name
        ),
        labels: {
          style: {
            fontWeight: "bold",
            fontSize: "13px"
          }
        }
      },
      yAxis: {
        tickInterval: 1,
        min: 0,
        title: {
          text: ""
        }
      },
      legend: {
        reversed: true
      },
      plotOptions: {
        bar: {
          events: {
            click: e => {
              const { category, colorIndex } = e.point;
              if (category && colorIndex !== undefined) {
                let users =
                  colorIndex === 0
                    ? schoolUsers[category].attends
                    : schoolUsers[category].notAttends;
                setUsers(users);
                setShowUserModal(true);
              }
            }
          }
        },
        series: {
          stacking: "normal"
        }
      },
      series: [
        {
          name: intl.get("DASHBOARD.ATTEND"),
          data: attendChartVal
        },
        {
          name: intl.get("DASHBOARD.ABSENT"),
          data: absentChartVal
        }
      ]
    };

    return <ChartWrapper options={options} colors={["#396cc6", "#F07077"]} />;
  }
);

const AttendanceStatistics = memo(({ session, setUsers, setShowUserModal }) => {
  const { attends, notAttends } = session;
  const deptObj = {};
  const noDeptObj = {};
  attends.forEach(attend => {
    const { user } = attend;
    if (user) {
      const { department } = user;
      if (department) {
        if (!deptObj[department._id]) {
          deptObj[department._id] = {
            department,
            users: []
          };
        }

        deptObj[department._id].users.push(user);
      }
    }
  });

  notAttends.forEach(attend => {
    const { user } = attend;
    if (user) {
      const { department } = user;
      if (department) {
        if (!noDeptObj[department._id]) {
          noDeptObj[department._id] = {
            department,
            users: []
          };
        }

        noDeptObj[department._id].users.push(user);
      }
    }
  });

  const options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie"
    },
    title: {
      text: intl.get("DASHBOARD.ATTENDANCE")
    },
    tooltip: {
      pointFormat: "Attendance: {point.y} ({point.percentage:.1f}%)"
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          distance: -50,
          style: {
            fontWeight: "bold",
            color: "white"
          },
          format: "{point.y}"
        },
        showInLegend: true
      }
    },
    series: [
      {
        colorByPoint: true,
        data: Object.keys(deptObj)
          .sort()
          .map(deptId => {
            return {
              name: deptObj[deptId].department.name,
              y: deptObj[deptId].users.length,
              id: deptId
            };
          }),
        events: {
          click: e => {
            const { id } = e.point;
            if (id) {
              setUsers(deptObj[id].users);
              setShowUserModal(true);
            }
          }
        }
      }
    ]
  };

  const options2 = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie"
    },
    title: {
      text: intl.get("DASHBOARD.ABSENT")
    },
    tooltip: {
      pointFormat: "Absent: {point.y} ({point.percentage:.1f}%)"
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          distance: -50,
          style: {
            fontWeight: "bold",
            color: "white"
          },
          format: "{point.y}"
        },
        showInLegend: true
      }
    },
    series: [
      {
        colorByPoint: true,
        data: Object.keys(noDeptObj)
          .sort()
          .map(deptId => {
            return {
              name: noDeptObj[deptId].department.name,
              y: noDeptObj[deptId].users.length,
              id: deptId
            };
          }),
        events: {
          click: e => {
            const { id } = e.point;
            if (id) {
              setUsers(noDeptObj[id].users);
              setShowUserModal(true);
            }
          }
        }
      }
    ]
  };

  return (
    <Fragment>
      <Card
        title={intl.get("DASHBOARD.ATTENDANCE_ABSENT_BY_DEPARTMENT")}
        headStyle={{ fontWeight: "bold" }}
      >
        <Row type="flex" gutter={[12, 12]}>
          <Col xs={24} md={12}>
            <ChartWrapper options={options} />
          </Col>
          <Col xs={24} md={12}>
            <ChartWrapper options={options2} />
          </Col>
        </Row>
      </Card>

      <Card
        title={intl.get("DASHBOARD.ATTENDANCE_BY_SCHOOL")}
        headStyle={{ fontWeight: "bold" }}
        style={{ marginTop: 24 }}
      >
        <Row>
          <Col xs={24}>
            <Row type="flex" align="center">
              <Col span={24}>
                <AttendanceBySchoolColumn
                  session={session}
                  setUsers={setUsers}
                  setShowUserModal={setShowUserModal}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <Card
        title={intl.get("DASHBOARD.ATTENDANCE_BY_DEPARTMENT")}
        headStyle={{ fontWeight: "bold" }}
        style={{ marginTop: 24 }}
      >
        <Row>
          <Col xs={24}>
            <Row type="flex" align="center">
              <Col span={24}>
                <AttendanceByDepartmentColumn
                  session={session}
                  setUsers={setUsers}
                  setShowUserModal={setShowUserModal}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </Fragment>
  );
});

export default AttendanceStatistics;
