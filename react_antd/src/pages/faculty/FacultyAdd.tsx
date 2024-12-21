import React, {useEffect, useState} from "react";
import {Button, Col, DatePicker, Form, Input, message, Modal, Row} from "antd";
import type {Result} from "@/types/result";
import facultyApi from "@/api/facultyApi.ts";
import {Faculty} from "@/types/resp/faculty";
import UniversitySelector from "@/pages/university/UniversitySelector.tsx";

interface FacultyAddProps {
  visible: boolean;
  id: number;
  onCloseFacultyAdd: () => void;
}

const FacultyAdd: React.FC<FacultyAddProps> = ({visible, id, onCloseFacultyAdd}) => {

  const [form] = Form.useForm<Faculty>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    universityName: [
      { required: true, message: '请输入学校名称' }
    ],
    name: [
      { required: true, message: '请输入院系名称' }
    ],
    contactPhone: [
      { required: true, message: '请输入联系电话' }
    ],
    email: [
      { required: true, message: '请输入邮箱' }
    ],
    officeLocation: [
      { required: true, message: '请输入办公地点' }
    ],
  };

  let facultyForm: Partial<Faculty> = {}

  const [title, setTitle] = useState('新增院系信息');

  useEffect(() => {
    if (!visible) {
      return
    }
    if (id) {
      setTitle('编辑院系信息')
      initFacultyFormById(id)
    } else {
      setTitle('新增院系信息')
      form.resetFields();
    }
  }, [visible]);

  const initFacultyFormById = async (id: number) => {
    const resp: Result<Faculty> = await facultyApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      facultyForm = resp.data
      form.setFieldsValue(resp.data);
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let faculty2Save:Faculty = form.getFieldsValue()
      if (id) {
        faculty2Save = Object.assign(facultyForm, faculty2Save)
      }
      const resp: Result<void> = await facultyApi.save(faculty2Save);
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
    setTitle('新增院系信息')
    form.resetFields();
  };
  
  const [universitySelectorVisible, setUniversitySelectorVisible] = useState(false);
  const findUniversity = () => {
    setUniversitySelectorVisible(true);
  }
  const handleUniversitySelected = (selectedUniversity: { universityId?: number; universityName?: string; }) => {
    setUniversitySelectorVisible(false)
    if (selectedUniversity && 'universityId' in selectedUniversity) {
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
      universityId: selectedUniversity['universityId'],
      universityName: selectedUniversity['universityName'],
      }));
    }
  };
  const handleCloseUniversitySelector = () => {
    setUniversitySelectorVisible(false)
  };

  const onBack = () => {
    onCloseFacultyAdd()
  };

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onSave}>保存</Button>
      <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>关闭</Button>
    </div>
  );

  return (
    <Modal title={title} open={visible} onCancel={onCloseFacultyAdd} width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      {messageContextHolder}
      <Form form={form} name="facultyForm" labelCol={{span: 6}}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="universityName" label="学校名称" rules={rules.universityName}>
              <Input.Search placeholder="请选择学校名称" onSearch={findUniversity} readOnly={true} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="name" label="院系名称" rules={rules.name}>
              <Input maxLength={64} placeholder="请输入院系名称"/>
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
            <Form.Item name="contactPhone" label="联系电话" rules={rules.contactPhone}>
              <Input maxLength={64} placeholder="请输入联系电话"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="email" label="邮箱" rules={rules.email}>
              <Input maxLength={64} placeholder="请输入邮箱"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="officeLocation" label="办公地点" rules={rules.officeLocation}>
              <Input maxLength={255} placeholder="请输入办公地点"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="website" label="院系网址">
              <Input maxLength={255} placeholder="请输入院系网址"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={22}>
            <Form.Item name="facultyDescription" label="院系简介" labelCol={{span: 3}}>
              <Input.TextArea maxLength={65535} placeholder="请输入院系简介" autoSize={{ minRows: 5, maxRows: 5 }}/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <UniversitySelector visible={universitySelectorVisible} onUniversitySelected={handleUniversitySelected} onCloseUniversitySelector={handleCloseUniversitySelector} />
    </Modal>
  )
}

export default FacultyAdd;
