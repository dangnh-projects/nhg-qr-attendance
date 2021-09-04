import React, { useState, useRef } from "react";
import { Row, Col, Card, Input, Icon, Button } from "antd";
import QRCode from "qrcode-react";

const Tools = props => {
  const [text, setText] = useState("");
  const qrRef = useRef();
  const downloadQr = (name = "qr-code") => {
    let lnk = document.createElement("a"),
      e;
    lnk.download = name;
    lnk.href = qrRef.current.refs.canvas.toDataURL("image/png;base64");

    if (document.createEvent) {
      e = document.createEvent("MouseEvents");
      e.initMouseEvent(
        "click",
        true,
        true,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );

      lnk.dispatchEvent(e);
    } else if (lnk.fireEvent) {
      lnk.fireEvent("onclick");
    }
  };
  return (
    <Card>
      <Row>
        <Input onChange={e => setText(e.target.value)} />
      </Row>
      <Row style={{ marginTop: 24 }}>
        <QRCode
          logo="/nhg-logo-small.jpg"
          ref={qrRef}
          value={text}
          logoWidth={64}
          size={196}
        />
      </Row>
      <Row
        type="flex"
        style={{
          flexDirection: "row",
          marginTop: 12,
          justifyContent: "center"
        }}
      >
        <Button onClick={() => downloadQr()} style={{ marginRight: 8 }}>
          <Icon type="cloud-download" /> Download
        </Button>
      </Row>
    </Card>
  );
};

export default Tools;
