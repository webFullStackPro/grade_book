import React, {useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import userApi from '@/api/userApi'
import type {LoginForm} from '@/types/req/loginForm'
import type {Result} from '@/types/result'
import type {LoginSession} from '@/types/resp/loginSession'
import {Button, Form, Input, message, Radio} from 'antd';
import Captcha from '@/components/Captcha';
import {useTranslation} from "react-i18next";
import '@/assets/styles/login.css'
import {generateCaptcha} from "@/utils/verificationCode.ts";
import {ADMIN_USERNAME, PASSWORD, STUDENT_USERNAME, TEACHER_USERNAME} from "@/const";

type MessageType = 'success' | 'warning' | 'error';

// 定义校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名' },
  ],
  password: [
    { required: true, message: '请输入密码' }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码' }
  ]
};

const Login: React.FC = () => {
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

  const handleLoginSuccess = (type: MessageType, msg: string) => {
    openNotification(type, msg, () => {
      const lastPath = sessionStorage.getItem('lastPath')
      if (lastPath && lastPath.trim() !== '') {
        sessionStorage.removeItem('lastPath')
        navigate(lastPath);
      } else {
        navigate('/Home');
      }
    });
  };
  const handleLoginError = (type: MessageType, msg: string) => {
    openNotification(type, msg);
  };

  const [searchParams] = useSearchParams();
  let type = 1
  if (searchParams.get('type')) {
    type = Number(searchParams.get('type'))
  }
  const initialLoginForm: LoginForm = {
    username: ADMIN_USERNAME,
    password: PASSWORD,
    type: type,
    verificationCode: ''
  }

  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loginForm, setLoginForm] = useState(initialLoginForm);

  // 当表单值改变时更新 loginForm 状态
  const handleValuesChange = (changedValues: Partial<LoginForm>) => {
    setLoginForm((prevState) => ({
      ...prevState,
      ...changedValues
    }));
  };
  const handleTypeChange = (newType: number) => {
    let username = ADMIN_USERNAME
    if (newType === 2) {
      username = TEACHER_USERNAME
    }
    if (newType === 3) {
      username = STUDENT_USERNAME
    }
    const formObj = {
      username: username,
      type: newType,
      password: initialLoginForm.password,
      verificationCode: ''
    }
    setLoginForm(formObj);
    form.setFieldsValue(formObj);
  };

  const [generatedCaptcha, setGeneratedCaptcha] = useState(generateCaptcha());

  const refreshCaptcha = () => {
    const newCaptcha = generateCaptcha();
    setGeneratedCaptcha(newCaptcha);
  };

  const handleLogin = async () => {
    try {
      await form.validateFields()
      if (loginForm.verificationCode.toUpperCase() !== generatedCaptcha.toUpperCase()) {
        openNotification('error', '验证码不正确')
        refreshCaptcha()
        handleTypeChange(loginForm.type)
        return
      }

        // 假设这里有一个验证登录的函数，返回true或false
      const resp: Result<LoginSession> = await userApi.login(loginForm);
      if (!resp || resp.code !== 1) {
        const errorMsg = resp && resp.msg ? resp.msg : '操作异常'
        handleLoginError('error', errorMsg)
        refreshCaptcha()
        handleTypeChange(loginForm.type)
        return
      }
      const loginSession: LoginSession | undefined = resp.data
      if (loginSession) {
        sessionStorage.setItem('loginToken', loginSession.token)
        sessionStorage.setItem('type', String(loginSession.type))
        sessionStorage.setItem('uid', String(loginSession.uid))
        sessionStorage.setItem('username', loginSession.username)
      }
      handleLoginSuccess('success', '登录成功')
    } catch (error) {
      console.error('There was an error submitting the form!', error);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // 防止默认行为
      handleLogin();
    }
  };

  const handleTeacherRegister = () => {
    navigate('/TeacherRegister')
  }

  const handleStudentRegister = () => {
    navigate('/StudentRegister')
  }

  return (
    <div className="login-page">
      {messageContextHolder}
      <div className="login">
        <div className="title">
          {t('title')}
        </div>
        <Form form={form} autoComplete="off" initialValues={initialLoginForm} onValuesChange={handleValuesChange}>
          <Form.Item name="username" rules={rules.username}>
            <Input placeholder={'请输入用户名'}/>
          </Form.Item>

          <Form.Item name="password" rules={rules.password}>
            <Input.Password placeholder={'请输入密码'}/>
          </Form.Item>

          <Form.Item name="verificationCode" rules={rules.verificationCode}>
            <Input placeholder={'请输入验证码'} onKeyUp={handleKeyPress}/>
          </Form.Item>

          <Captcha captcha={generatedCaptcha} onRefresh={refreshCaptcha}/>

          <div style={{marginTop: 20, display: 'flex', justifyContent: 'center'}}>
            <Radio.Group value={loginForm.type} onChange={(e) => handleTypeChange(e.target.value)}>
              <Radio value={1}>管理员</Radio>
              <Radio value={2}>教师</Radio>
              <Radio value={3}>学生</Radio>
            </Radio.Group>
          </div>
        </Form>
        <div className="btn-container">
          <Button type="primary" onClick={handleLogin}>登录</Button>
          {loginForm.type === 2 && <Button type="primary" style={{marginLeft: 'var(--button-margin-left)'}}
                                           onClick={handleTeacherRegister}>注册</Button>}
          {loginForm.type === 3 && <Button type="primary" style={{marginLeft: 'var(--button-margin-left)'}}
                                           onClick={handleStudentRegister}>注册</Button>}
        </div>
      </div>
      <div className="footer">
        <span>版权所有 &copy; 2024 - 2026 <a href="http://www.52ejn.com" target="_blank">源码学习网</a></span><a
        href="http://beian.miit.gov.cn" target="_blank">粤ICP备2024308896号-1</a>
      </div>
    </div>
  );
};

export default Login;