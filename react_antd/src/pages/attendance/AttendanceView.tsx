import React, {useEffect} from "react";
import {Button, Col, DatePicker, Form, Input, Modal, Row, Select} from "antd";
import {Attendance} from "@/types/resp/attendance";

interface AttendanceViewProps {
  visible: boolean;
  viewRow: object;
  onCloseAttendanceView: () => void;
}

const AttendanceView: React.FC<AttendanceViewProps> = ({visible, viewRow, onCloseAttendanceView}) => {

  const [form] = Form.useForm<Attendance>();

  const onBack = () => {
    onCloseAttendanceView()
  };

  useEffect(() => {
    if (!visible) {
      return
    }
    if (viewRow) {
      form.setFieldsValue(viewRow);
    }
  }, [viewRow]);

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onBack}>关闭</Button>
    </div>
  );

  return (
    <Modal title={"考勤信息详情"} open={visible} onCancel={onCloseAttendanceView}
        width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={form} labelCol={{span: 6}} disabled={true}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="courseName" label="课程名称">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="studentNumber" label="学号">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="attendanceDate" label="考勤日期">
              <DatePicker/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="status" label="状态">
              <Select placeholder="请选择状态" options={[
                { value: 10, label: <span>出勤</span> },
                { value: 20, label: <span>缺勤</span> },
                { value: 30, label: <span>迟到</span> }
              ]} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="createTime" label="创建时间">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="modifyTime" label="最后修改时间">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default AttendanceView;
