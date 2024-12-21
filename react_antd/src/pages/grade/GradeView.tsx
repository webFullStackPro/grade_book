import React, {useEffect} from "react";
import {Button, Col, Form, Input, Modal, Row} from "antd";
import {Grade} from "@/types/resp/grade";

interface GradeViewProps {
  visible: boolean;
  viewRow: object;
  onCloseGradeView: () => void;
}

const GradeView: React.FC<GradeViewProps> = ({visible, viewRow, onCloseGradeView}) => {

  const [form] = Form.useForm<Grade>();

  const onBack = () => {
    onCloseGradeView()
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
    <Modal title={"成绩信息详情"} open={visible} onCancel={onCloseGradeView}
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
            <Form.Item name="grade" label="成绩">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="createTime" label="创建时间">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
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

export default GradeView;
