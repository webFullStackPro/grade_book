import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import type {Result} from '@/types/result'
import {Button, Col, Form, Input, message, Row, Select} from 'antd';
import Captcha from '@/components/Captcha';
import {useTranslation} from "react-i18next";
import '@/assets/styles/register.css'
import teacherApi from "@/api/teacherApi.ts";
import {Teacher} from "@/types/resp/teacher";
import FacultySelector from "@/pages/faculty/FacultySelector.tsx";
import {generateCaptcha} from "@/utils/verificationCode.ts";


type MessageType = 'success' | 'warning' | 'error';

// 定义校验规则
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
  password2: [
    { required: true, message: '请确认密码' }
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
  verificationCode: [
    { required: true, message: '验证码不能为空' }
  ]
};

const initialTeacherForm: Partial<Teacher> = {
  facultyId: 0,
  gender: 1
}

const TeacherRegister: React.FC = () => {
  const navigate = useNavigate();

  const [messageApi, messageContextHolder] = message.useMessage();

  const openNotification = (messageType: MessageType, msg: string, onCloseCallback?: () => void) => {
    messageApi.open({
      type: messageType,
      content: msg,
      duration: 1,
      onClose: () => {
        if (onCloseCallback) {
          onCloseCallback(); // 如果提供了回调，则执行它
        }
      }
    });
  };

  const handleRegisterSuccess = (type: MessageType, msg: string) => {
    openNotification(type, msg, () => {
      navigate(`/Login?type=2` );
    });
  };
  const handleRegisterError = (type: MessageType, msg: string) => {
    openNotification(type, msg);
  };

  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [teacherForm] = useState(initialTeacherForm)

  const [generatedCaptcha, setGeneratedCaptcha] = useState(generateCaptcha());

  const refreshCaptcha = () => {
    const newCaptcha = generateCaptcha();
    setGeneratedCaptcha(newCaptcha);
  };

  const handleRegister = async () => {
    try {
      await form.validateFields()
      const teacher2Save:Teacher = Object.assign(teacherForm, form.getFieldsValue())
      if (teacher2Save.password !== teacher2Save.password2) {
        messageApi.error('两次输入的密码不一致，请重新输入')
        refreshCaptcha()
        teacher2Save.password = ''
        teacher2Save.password2 = ''
        form.setFieldsValue(teacher2Save);
        return
      }
      if (teacher2Save.verificationCode && teacher2Save.verificationCode.toUpperCase() !== generatedCaptcha.toUpperCase()) {
        openNotification('error', '验证码不正确')
        refreshCaptcha()
        teacher2Save.verificationCode = ''
        form.setFieldsValue(teacher2Save);
        return
      }

      const resp: Result<void> = await teacherApi.save(teacher2Save)
      if (!resp || resp.code !== 1) {
        const errorMsg = resp && resp.msg ? resp.msg : '操作异常'
        handleRegisterError('error', errorMsg)
        refreshCaptcha()
        return
      }
      handleRegisterSuccess('success', '注册成功')
    } catch (error) {
      console.error('There was an error submitting the form!', error);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  const onBack = () => {
    navigate(`/Login?type=2` );
  }


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
    <div className="register-page">
      {messageContextHolder}
      <div className="register">
        <div className="login-title">{t('title')}</div>
        <div className="login-subtitle">{t('teacherRegisterTitle')}</div>
        <Form form={form} initialValues={initialTeacherForm} labelCol={{span: 6}}>
          <Row gutter={10}>
            <Col span={8}>
              <Form.Item name="facultyName" label="院系名称" rules={rules.facultyName}>
                <Input.Search placeholder="请选择院系名称" onSearch={findFaculty} readOnly={true}/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="name" label="姓名" rules={rules.name}>
                <Input maxLength={64} placeholder="请输入姓名"/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="gender" label="性别" rules={rules.gender}>
                <Select placeholder="请选择性别" options={[
                  {value: 1, label: <span>男</span>},
                  {value: 2, label: <span>女</span>}
                ]}/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={8}>
              <Form.Item name="password" label="密码" rules={rules.password}>
                <Input maxLength={255} placeholder="请输入密码"/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="password2" label="确认密码" rules={rules.password2}>
                <Input maxLength={255} placeholder="请确认密码"/>
              </Form.Item>
            </Col>
            <Col span={8}>
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
            <Col span={8}>
              <Form.Item name="contactPhone" label="联系电话" rules={rules.contactPhone}>
                <Input maxLength={64} placeholder="请输入联系电话"/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="email" label="邮箱" rules={rules.email}>
                <Input maxLength={64} placeholder="请输入邮箱"/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={24}>
              <Form.Item name="profile" label="教师简介" labelCol={{span: 2}}>
                <Input.TextArea maxLength={65535} placeholder="请输入教师简介" autoSize={{minRows: 4, maxRows: 4}}/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={8}>
              <Form.Item name="verificationCode" label="验证码" rules={rules.verificationCode}>
                <Input maxLength={6} placeholder="请输入验证码"/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Captcha captcha={generatedCaptcha} onRefresh={refreshCaptcha}/>
            </Col>
          </Row>
        </Form>
        <div className="custom-footer" style={{marginTop: 20}}>
          <Button type="primary" onClick={handleRegister}>注册</Button>
          <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
          <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>返回登录</Button>
        </div>
      </div>
      <div className="footer">
        <span>版权所有 &copy; 2024 - 2026 <a href="http://www.52ejn.com" target="_blank">源码学习网</a></span>
        <a href="http://beian.miit.gov.cn" target="_blank">粤ICP备2024308896号-1</a>
      </div>
      <FacultySelector visible={facultySelectorVisible} onFacultySelected={handleFacultySelected}
                       onCloseFacultySelector={handleCloseFacultySelector}/>
    </div>
  );
};

export default TeacherRegister;