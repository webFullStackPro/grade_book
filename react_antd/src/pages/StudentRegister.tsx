import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import type {Result} from '@/types/result'
import {Button, Cascader, CascaderProps, Col, DatePicker, Form, Input, InputNumber, message, Row, Select} from 'antd';
import Captcha from '@/components/Captcha';
import {useTranslation} from "react-i18next";
import '@/assets/styles/register.css'
import studentApi from "@/api/studentApi.ts";
import MajorSelector from "@/pages/major/MajorSelector.tsx";
import {Student} from "@/types/resp/student";
import type {AreaOption} from "@/types/areaOption.ts";
import areas from "@/locales/area.json";
import {generateCaptcha} from "@/utils/verificationCode.ts";


type MessageType = 'success' | 'warning' | 'error';

// 定义校验规则
const rules = {
  studentNumber: [
    { required: true, message: '请输入学号' }
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
  gender: [
    { required: true, message: '请输入性别' }
  ],
  birthDate: [
    { required: true, message: '请输入出生日期' }
  ],
  majorName: [
    { required: true, message: '请输入专业名称' }
  ],
  grade: [
    { required: true, message: '请输入年级' }
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

const initialStudentForm: Partial<Student> = {
  gender: 1,
  majorId: 0,
  grade: 2000
}

const StudentRegister: React.FC = () => {
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
      navigate(`/Login?type=3` );
    });
  };
  const handleRegisterError = (type: MessageType, msg: string) => {
    openNotification(type, msg);
  };

  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [studentForm] = useState(initialStudentForm)

  const [generatedCaptcha, setGeneratedCaptcha] = useState(generateCaptcha());

  const refreshCaptcha = () => {
    const newCaptcha = generateCaptcha();
    setGeneratedCaptcha(newCaptcha);
  };

  const handleRegister = async () => {
    try {
      await form.validateFields()
      const student2Save:Student = Object.assign(studentForm, form.getFieldsValue())
      if (student2Save.password !== student2Save.password2) {
        messageApi.error('两次输入的密码不一致，请重新输入')
        refreshCaptcha()
        student2Save.password = ''
        student2Save.password2 = ''
        form.setFieldsValue(student2Save);
        return
      }
      if (student2Save.verificationCode && student2Save.verificationCode.toUpperCase() !== generatedCaptcha.toUpperCase()) {
        openNotification('error', '验证码不正确')
        refreshCaptcha()
        student2Save.verificationCode = ''
        form.setFieldsValue(student2Save);
        return
      }

      const resp: Result<void> = await studentApi.save(student2Save)
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
    navigate(`/Login?type=3` );
  }

  const [majorSelectorVisible, setMajorSelectorVisible] = useState(false);
  const findMajor = () => {
    setMajorSelectorVisible(true);
  }
  const handleMajorSelected = (selectedMajor: { majorId?: number; majorName?: string; }) => {
    setMajorSelectorVisible(false)
    if (selectedMajor && 'majorId' in selectedMajor) {
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
        majorId: selectedMajor['majorId'],
        majorName: selectedMajor['majorName'],
      }));
    }
  };
  const handleCloseMajorSelector = () => {
    setMajorSelectorVisible(false)
  };

  const provinceCityAreaOptions: AreaOption[] = areas.provinces

  const onAreaChange: CascaderProps<AreaOption>['onChange'] = (value) => {
    if (value && value.length > 0 && typeof value[0] === 'string') {
      studentForm.province = value[0]
    }
    if (value && value.length > 1 && typeof value[1] === 'string') {
      studentForm.city = value[1]
    }
    if (value && value.length > 2 && typeof value[2] === 'string') {
      studentForm.area = value[2]
    }
  };

  return (
    <div className="register-page">
      {messageContextHolder}
      <div className="register">
        <div className="login-title">{t('title')}</div>
        <div className="login-subtitle">{t('studentRegisterTitle')}</div>
        <Form form={form} initialValues={initialStudentForm} labelCol={{span: 6}}>
          <Row gutter={10}>
            <Col span={8}>
              <Form.Item name="studentNumber" label="学号" rules={rules.studentNumber}>
                <Input maxLength={20} placeholder="请输入学号"/>
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
                  { value: 1, label: <span>男</span> },
                  { value: 2, label: <span>女</span> }
                ]} />
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
                <Input maxLength={255} placeholder="请输入确认密码"/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="birthDate" label="出生日期" rules={rules.birthDate}>
                <DatePicker/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={8}>
              <Form.Item name="majorName" label="专业名称" rules={rules.majorName}>
                <Input.Search placeholder="请选择专业名称" onSearch={findMajor} readOnly={true} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="grade" label="年级" rules={rules.grade}>
                <InputNumber min={2000} max={2100} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="enrollmentDate" label="入学日期">
                <DatePicker/>
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
            <Col span={8}>
              <Form.Item name="graduationDate" label="毕业日期">
                <DatePicker/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={8}>
              <Form.Item name="provinceCityArea" label="省/市/区">
                <Cascader options={provinceCityAreaOptions} fieldNames={{ label: "name", value: "code" }} onChange={onAreaChange} placeholder="请选择省/市/区" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="verificationCode" label="验证码" rules={rules.verificationCode}>
                <Input maxLength={6} placeholder="请输入验证码"/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Captcha captcha={generatedCaptcha} onRefresh={refreshCaptcha}/>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={8}>
              <Form.Item name="address" label="家庭地址">
                <Input maxLength={255} placeholder="请输入家庭地址"/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div className="custom-footer">
          <Button type="primary" onClick={handleRegister}>注册</Button>
          <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
          <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>返回登录</Button>
        </div>
      </div>
      <MajorSelector visible={majorSelectorVisible} onMajorSelected={handleMajorSelected} onCloseMajorSelector={handleCloseMajorSelector} />
    </div>
  );
};

export default StudentRegister;