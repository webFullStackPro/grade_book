import React, {useEffect} from "react";
import {Button, Col, Form, Input, Modal, Row} from "antd";
import {Admin} from "@/types/resp/admin";

interface AdminViewProps {
  visible: boolean;
  viewRow: object;
  onCloseAdminView: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({visible, viewRow, onCloseAdminView}) => {

  const [form] = Form.useForm<Admin>();

  const onBack = () => {
    onCloseAdminView()
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

  // open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
  return (
    <Modal title={"管理员详情"} open={visible} onCancel={onCloseAdminView} width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={form} labelCol={{span: 6}} disabled={true}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="username" label="用户名">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="password" label="密码">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="name" label="姓名">
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

export default AdminView;
