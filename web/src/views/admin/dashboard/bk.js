const NumStatByDate = props => {
  const [count, setCount] = useState([]);

  const getCount = async () => {
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/dashboard/by-date"
    );

    const { receivedByDate, registrationByDate } = response.data;
    const obj = {};

    receivedByDate.forEach(({ date, count }) => {
      if (!obj[date]) {
        obj[date] = {};
      }

      obj[date].received = count;
    });

    registrationByDate.forEach(({ date, count }) => {
      if (!obj[date]) {
        obj[date] = {};
      }

      obj[date].registration = count;
    });

    let keys = [],
      registrations = [],
      receiveds = [];

    Object.keys(obj).forEach(key => {
      keys.push(key);
      registrations.push(obj[key].registration || 0);
      receiveds.push(obj[key].received || 0);
    });

    setCount({ keys, registrations, receiveds });
  };

  useEffect(() => {
    getCount();
  }, []);

  const options = {
    chart: {
      type: "column"
    },
    title: {
      text: "Số lượng đăng ký và nhận sách theo ngày"
    },
    xAxis: {
      categories: count.keys,
      crosshair: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [
      {
        name: "Đăng ký",
        data: count.registrations
      },
      {
        name: "Nhận sách",
        data: count.receiveds
      }
    ]
  };
  return <ChartWrapper options={options} />;
};

const StatByLocation = props => {
  const [count, setCount] = useState([]);

  const getCount = async () => {
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/dashboard/by-province"
    );

    setCount(response.data);
  };

  useEffect(() => {
    getCount();
  }, []);
  const options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie"
    },
    title: {
      text: "Số lượng đăng ký theo địa điểm"
    },
    tooltip: {
      pointFormat: "{point.y}"
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "{point.name}: {point.percentage:.1f}%"
        }
        // showInLegend: true
      }
    },
    series: [
      {
        colorByPoint: true,
        data: count.map(cnt => ({
          name: cnt.name,
          y: cnt.count
        }))
      }
    ]
  };
  return <ChartWrapper options={options} />;
};

const StatByType = props => {
  const [count, setCount] = useState([]);

  const getCount = async () => {
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/dashboard/by-type"
    );

    setCount(response.data);
  };

  useEffect(() => {
    getCount();
  }, []);
  const options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie"
    },
    title: {
      text: "Số lượng đăng ký theo loại người dùng"
    },
    tooltip: {
      pointFormat: "{point.y}"
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "{point.name}: {point.percentage:.1f}%"
        }
      }
    },
    series: [
      {
        colorByPoint: true,
        data: [
          {
            name: "Sinh viên",
            y: count ? count.countStudent : 0
          },
          {
            name: "Phụ huynh",
            y: count ? count.countParent : 0
          },
          {
            name: "Giáo viên",
            y: count ? count.countTeacher : 0
          }
        ]
      }
    ]
  };
  return <ChartWrapper options={options} />;
};

const StatByRegistrationAndReceived = ({ received = 0, notReceived = 0 }) => {
  const options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false
    },
    title: {
      text: "% nhận sách",
      align: "center",
      verticalAlign: "middle",
      y: 60
    },
    tooltip: {
      pointFormat: "{point.y}%"
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          // distance: -50,
          format: "{point.name}: {point.percentage:.1f}%"
        },
        startAngle: -90,
        endAngle: 90,
        center: ["50%", "75%"]

        // size: "110%"
      }
    },
    series: [
      {
        type: "pie",
        innerSize: "50%",
        colorByPoint: true,
        data: [
          { name: "Nhận sách", y: received },
          { name: "Chưa nhận sách", y: notReceived }
        ]
      }
    ]
  };
  return <ChartWrapper options={options} />;
};
