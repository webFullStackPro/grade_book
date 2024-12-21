import React, {useEffect} from "react";
import {Button, Col, DatePicker, Form, Input, Modal, Row} from "antd";
import {Faculty} from "@/types/resp/faculty";

interface FacultyViewProps {
  visible: boolean;
  viewRow: object;
  onCloseFacultyView: () => void;
}

const FacultyView: React.FC<FacultyViewProps> = ({visible, viewRow, onCloseFacultyView}) => {

  const [form] = Form.useForm<Faculty>();

  const onBack = () => {
    onCloseFacultyView()
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
    <Modal title={"院系信息详情"} open={visible} onCancel={onCloseFacultyView} width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={form} labelCol={{span: 6}} disabled={true}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="universityName" label="学校名称">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="name" label="院系名称">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="establishmentDate" label="成立日期">
              <DatePicker/>
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
            <Form.Item name="officeLocation" label="办公地点">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="website" label="院系网址">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={22}>
            <Form.Item name="facultyDescription" label="院系简介" labelCol={{span: 3}}>
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

export default FacultyView;
