import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, message, Modal, Row} from "antd";
import type {Result} from "@/types/result";
import adminApi from "@/api/adminApi.ts";
import {Admin} from "@/types/resp/admin";

interface AdminAddProps {
  visible: boolean;
  id: number;
  onCloseAdminAdd: () => void;
}

const AdminAdd: React.FC<AdminAddProps> = ({visible, id, onCloseAdminAdd}) => {

  const [form] = Form.useForm<Admin>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    username: [
      { required: true, message: '请输入用户名' }
    ],
    password: [
      { required: true, message: '请输入密码' }
    ],
    name: [
      { required: true, message: '请输入姓名' }
    ],
  };

  let adminForm = {}

  const [title, setTitle] = useState('新增管理员');

  useEffect(() => {
    if (!visible) {
      return
    }
    if (id) {
      setTitle('编辑管理员')
      initAdminFormById(id)
    } else {
      setTitle('新增管理员')
      form.resetFields();
    }
  }, [visible]);

  const initAdminFormById = async (id: number) => {
    const resp: Result<Admin> = await adminApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      adminForm = resp.data
      form.setFieldsValue(resp.data);
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let admin2Save:Admin = form.getFieldsValue()
      if (id) {
        admin2Save = Object.assign(adminForm, admin2Save)
      }
      const resp: Result<void> = await adminApi.save(admin2Save);
      if (!resp || resp.code !== 1) {
        messageApi.error('保存失败:' + (resp.msg ? resp.msg : '未知异常'));
        return
      }
      messageApi.success('保存成功');
      onBack()
    } catch (error) {
      console.error('There was an error submitting the form!', error);
    }
  };

  const onReset = () => {
    setTitle('新增管理员')
    form.resetFields();
  };

  const onBack = () => {
    onCloseAdminAdd()
  };

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onSave}>保存</Button>
      <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>关闭</Button>
    </div>
  );

  // open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
  return (
    <Modal title={title} open={visible} onCancel={onCloseAdminAdd} width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      {messageContextHolder}
      <Form form={form} name="adminForm" labelCol={{span: 6}}>
      
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="username" label="用户名" rules={rules.username}>
              <Input maxLength={64} placeholder="请输入用户名"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="password" label="密码" rules={rules.password}>
              <Input maxLength={255} placeholder="请输入密码"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="name" label="姓名" rules={rules.name}>
              <Input maxLength={64} placeholder="请输入姓名"/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default AdminAdd;
