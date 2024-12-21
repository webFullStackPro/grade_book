import React, {useEffect} from "react";
import {Button, Col, Form, Input, Modal, Row} from "antd";
import {Course} from "@/types/resp/course";

interface CourseViewProps {
  visible: boolean;
  viewRow: object;
  onCloseCourseView: () => void;
}

const CourseView: React.FC<CourseViewProps> = ({visible, viewRow, onCloseCourseView}) => {

  const [form] = Form.useForm<Course>();

  const onBack = () => {
    onCloseCourseView()
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
    <Modal title={"课程信息详情"} open={visible} onCancel={onCloseCourseView}
        width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={form} labelCol={{span: 6}} disabled={true}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="facultyName" label="院系名称">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="teacherName" label="姓名">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="code" label="课程代码">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="name" label="课程名称">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="credit" label="学分">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={22}>
            <Form.Item name="courseDescription" label="课程描述" labelCol={{span: 3}}>
              <Input.TextArea autoSize={{ minRows: 5, maxRows: 5 }}/>
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

export default CourseView;
