import React, { useRef } from "react";
import { Modal, Row, Icon, Button } from "antd";
import QRCode from "qrcode-react";

const QRModal = ({ visible, attendee, setShowQRModal }) => {
  const qrRef = useRef();
  const downloadQr = (name = "qr-code") => {
    let lnk = document.createElement("a"),
      e;
    lnk.download = name;
    const canvas = qrRef.current.refs.canvas;
    const context = canvas.getContext("2d");
    const newCanvas = document.createElement("canvas");
    const destCtx = newCanvas.getContext("2d");

    destCtx.canvas.width = context.canvas.width + 48;
    destCtx.canvas.height = context.canvas.height + 48;

    destCtx.fillStyle = "white";
    destCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);

    destCtx.drawImage(canvas, 24, 24);

    lnk.href = newCanvas.toDataURL("image/png;base64");

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
    <Modal
      visible={visible}
      onCancel={() => setShowQRModal(false)}
      onOk={() => setShowQRModal(false)}
    >
      <Row
        type="flex"
        style={{ width: "100%", alignItems: "center", flexDirection: "column" }}
      >
        <QRCode
          logo="/nhg-logo-small.jpg"
          ref={qrRef}
          fgColor="#22a54f"
          value={attendee ? attendee.qr_code : "hello"}
          logoWidth={64}
          size={256}
        />
        <Row type="flex" style={{ flexDirection: "row", marginTop: 12 }}>
          <Button onClick={() => downloadQr()} style={{ marginRight: 8 }}>
            <Icon type="cloud-download" /> Download
          </Button>
        </Row>
      </Row>
    </Modal>
  );
};

export default QRModal;
