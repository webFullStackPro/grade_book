import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, InputNumber, message, Modal, Row, Select} from "antd";
import type {Result} from "@/types/result";
import majorApi from "@/api/majorApi.ts";
import {Major} from "@/types/resp/major";
import FacultySelector from "@/pages/faculty/FacultySelector.tsx";

interface MajorAddProps {
  visible: boolean;
  id: number;
  onCloseMajorAdd: () => void;
}

const MajorAdd: React.FC<MajorAddProps> = ({visible, id, onCloseMajorAdd}) => {

  const [form] = Form.useForm<Major>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    facultyName: [
      { required: true, message: '请输入院系名称' }
    ],
    name: [
      { required: true, message: '请输入专业名称' }
    ],
    degreeType: [
      { required: true, message: '请输入学位类型' }
    ],
    duration: [
      { required: true, message: '请输入学制(年)' }
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

  let majorForm: Partial<Major> = {}

  const [title, setTitle] = useState('新增专业信息');

  useEffect(() => {
    if (!visible) {
      return
    }
    if (id) {
      setTitle('编辑专业信息')
      initMajorFormById(id)
    } else {
      setTitle('新增专业信息')
      form.resetFields();
    }
  }, [visible]);

  const initMajorFormById = async (id: number) => {
    const resp: Result<Major> = await majorApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      majorForm = resp.data
      form.setFieldsValue(resp.data);
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let major2Save:Major = form.getFieldsValue()
      if (id) {
        major2Save = Object.assign(majorForm, major2Save)
      }
      const resp: Result<void> = await majorApi.save(major2Save);
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
    setTitle('新增专业信息')
    form.resetFields();
  };
  
  const [facultySelectorVisible, setFacultySelectorVisible] = useState(false);
  const findFaculty = () => {
    setFacultySelectorVisible(true);
  }
  const handleFacultySelected = (selectedFaculty: { facultyId?: number; facultyName?: string; }) => {
    setFacultySelectorVisible(false)
    if (selectedFaculty && 'facultyId' in selectedFaculty) {
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
      facultyId: selectedFaculty['facultyId'],
      facultyName: selectedFaculty['facultyName'],
      }));
    }
  };
  const handleCloseFacultySelector = () => {
    setFacultySelectorVisible(false)
  };

  const onBack = () => {
    onCloseMajorAdd()
  };

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onSave}>保存</Button>
      <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>关闭</Button>
    </div>
  );

  return (
    <Modal title={title} open={visible} onCancel={onCloseMajorAdd} width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      {messageContextHolder}
      <Form form={form} name="majorForm" labelCol={{span: 6}}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="facultyName" label="院系名称" rules={rules.facultyName}>
              <Input.Search placeholder="请选择院系名称" onSearch={findFaculty} readOnly={true} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="name" label="专业名称" rules={rules.name}>
              <Input maxLength={64} placeholder="请输入专业名称"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="degreeType" label="学位类型" rules={rules.degreeType}>
              <Select placeholder="请选择学位类型" options={[
                { value: 1, label: <span>学士</span> },
                { value: 2, label: <span>硕士</span> },
                { value: 3, label: <span>博士</span> }
              ]} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="duration" label="学制(年)" rules={rules.duration}>
              <InputNumber min={1} max={10} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="contactPhone" label="联系电话" rules={rules.contactPhone}>
              <Input maxLength={64} placeholder="请输入联系电话"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="email" label="邮箱" rules={rules.email}>
              <Input maxLength={64} placeholder="请输入邮箱"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="officeLocation" label="办公地点" rules={rules.officeLocation}>
              <Input maxLength={255} placeholder="请输入办公地点"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={22}>
            <Form.Item name="majorDescription" label="专业简介" labelCol={{span: 3}}>
              <Input.TextArea maxLength={65535} placeholder="请输入专业简介" autoSize={{ minRows: 5, maxRows: 5 }}/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <FacultySelector visible={facultySelectorVisible} onFacultySelected={handleFacultySelected} onCloseFacultySelector={handleCloseFacultySelector} />
    </Modal>
  )
}

export default MajorAdd;
