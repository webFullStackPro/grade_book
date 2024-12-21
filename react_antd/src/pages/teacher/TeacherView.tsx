import React, {useEffect} from "react";
import {Button, Col, Form, Input, Modal, Row, Select} from "antd";
import {Teacher} from "@/types/resp/teacher";

interface TeacherViewProps {
  visible: boolean;
  viewRow: object;
  onCloseTeacherView: () => void;
}

const TeacherView: React.FC<TeacherViewProps> = ({visible, viewRow, onCloseTeacherView}) => {

  const [form] = Form.useForm<Teacher>();

  const onBack = () => {
    onCloseTeacherView()
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
    <Modal title={"教师信息详情"} open={visible} onCancel={onCloseTeacherView} width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={form} labelCol={{span: 6}} disabled={true}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="facultyName" label="院系名称">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="name" label="姓名">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="password" label="密码">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="title" label="职称">
              <Select placeholder="请选择职称" options={[
                { value: 1, label: <span>助教</span> },
                { value: 2, label: <span>讲师</span> },
                { value: 3, label: <span>副教授</span> },
                { value: 4, label: <span>教授</span> }
              ]} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="gender" label="性别">
              <Select placeholder="请选择性别" options={[
                { value: 1, label: <span>男</span> },
                { value: 2, label: <span>女</span> }
              ]} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="contactPhone" label="联系电话">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="email" label="邮箱">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="profile" label="教师简介">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={22}>
            <Form.Item name="profile" label="教师简介" labelCol={{span: 3}}>
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

export default TeacherView;
