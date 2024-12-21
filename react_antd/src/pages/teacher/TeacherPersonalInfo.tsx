import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, message, Row, Select} from "antd";
import type {Result} from "@/types/result";
import teacherApi from "@/api/teacherApi.ts";
import {Teacher} from "@/types/resp/teacher";
import FacultySelector from "@/pages/faculty/FacultySelector.tsx";

const TeacherAdd: React.FC = () => {

  const [form] = Form.useForm<Teacher>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    facultyName: [
      { required: true, message: '请输入院系名称' }
    ],
    name: [
      { required: true, message: '请输入姓名' }
    ],
    password: [
      { required: true, message: '请输入密码' }
    ],
    title: [
      { required: true, message: '请输入职称' }
    ],
    gender: [
      { required: true, message: '请输入性别' }
    ],
    contactPhone: [
      { required: true, message: '请输入联系电话' }
    ],
    email: [
      { required: true, message: '请输入邮箱' }
    ],
  };

  let teacherForm: Partial<Teacher> = {}

  useEffect(() => {
    initTeacherFormById(1)
  }, []);

  const initTeacherFormById = async (id: number) => {
    const resp: Result<Teacher> = await teacherApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      teacherForm = resp.data
      form.setFieldsValue(resp.data);
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let teacher2Save:Teacher = form.getFieldsValue()
      teacher2Save = Object.assign(teacherForm, teacher2Save)
      const resp: Result<void> = await teacherApi.save(teacher2Save);
      if (!resp || resp.code !== 1) {
        messageApi.error('保存失败:' + (resp.msg ? resp.msg : '未知异常'));
        return
      }
      messageApi.success('保存成功');
    } catch (error) {
      console.error('There was an error submitting the form!', error);
    }
  };

  const onReset = () => {
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

  return (
    <div>
      {messageContextHolder}
      <Form form={form} name="teacherForm" labelCol={{span: 6}}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="facultyName" label="院系名称" rules={rules.facultyName}>
              <Input.Search placeholder="请选择院系名称" onSearch={findFaculty} readOnly={true}/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="name" label="姓名" rules={rules.name}>
              <Input maxLength={64} placeholder="请输入姓名"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="password" label="密码" rules={rules.password}>
              <Input maxLength={255} placeholder="请输入密码"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="title" label="职称" rules={rules.title}>
              <Select placeholder="请选择职称" options={[
                {value: 1, label: <span>助教</span>},
                {value: 2, label: <span>讲师</span>},
                {value: 3, label: <span>副教授</span>},
                {value: 4, label: <span>教授</span>}
              ]}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="gender" label="性别" rules={rules.gender}>
              <Select placeholder="请选择性别" options={[
                {value: 1, label: <span>男</span>},
                {value: 2, label: <span>女</span>}
              ]}/>
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
        </Row>
        <Row gutter={10}>
          <Col span={22}>
            <Form.Item name="profile" label="教师简介" labelCol={{span: 3}}>
              <Input.TextArea maxLength={65535} placeholder="请输入教师简介" autoSize={{minRows: 5, maxRows: 5}}/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className='custom-footer'>
        <Button type="primary" onClick={onSave}>保存</Button>
        <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      </div>
      <FacultySelector visible={facultySelectorVisible} onFacultySelected={handleFacultySelected}
                       onCloseFacultySelector={handleCloseFacultySelector}/>
    </div>
  )
}

export default TeacherAdd;
