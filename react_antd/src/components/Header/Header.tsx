import React, {useCallback, useState, useRef} from 'react';
import styles from '@/components/Header/Header.module.less';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Modal, Space, Form, Input, Button, message } from 'antd';
import {useNavigate} from "react-router-dom";
import {UpdatePassForm} from "@/types/req/updatePassForm";


interface HeaderProps {
  title: string;
}

// 定义校验规则
const rules = {
  oldPassword: [
    { required: true, message: '请输入原密码' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码' }
  ],
  confirmNewPassword: [
    { required: true, message: '请再次输入新密码' }
  ]
};

const initialUpdatePassForm: UpdatePassForm = {
  oldPass: '',
  newPass: '',
  newPass2: ''
}

const Header: React.FC<HeaderProps> = ({title}) => {

  const navigate = useNavigate();

  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleLogout = useCallback(async () => {
    const confirmed = await modal.confirm({
      title: '提示',
      content: (
        <>
          确定要退出吗?
        </>
      ),
      okText: '确定',
      cancelText: '取消',
      type: 'warning'
    });

    if (confirmed) {
      sessionStorage.removeItem('loginToken')
      sessionStorage.removeItem('type')
      sessionStorage.removeItem('uid')
      sessionStorage.removeItem('username')
      navigate('/Login');
    }
  }, [modal]);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: '修改密码',
      onClick: () => handleUpdatePass()
    },
    {
      key: '2',
      label: '退出',
      onClick: () => handleLogout()
    },
  ];

  const username = sessionStorage.getItem('username')

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdatePass = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const formRef = useRef<any>(null);
  const [updatePassForm, setUpdatePassForm] = useState(initialUpdatePassForm);
  const setOldPass = (oldPass: string) => {
    setUpdatePassForm({ ...updatePassForm, oldPass });
  };
  const setNewPass = (newPass: string) => {
    setUpdatePassForm({ ...updatePassForm, newPass });
  };
  const setNewPass2 = (newPass2: string) => {
    setUpdatePassForm({ ...updatePassForm, newPass2 });
  };


  const handleOk = async () => {
    if (formRef.current) {
      try {
        await formRef.current.validateFields();
        if (updatePassForm.newPass !== updatePassForm.newPass2) {
          // 显示成功消息
          messageApi.error('两次密码输入不一致');
          return
        }
        // 显示成功消息
        messageApi.success('操作成功');

        setIsModalOpen(false);
      } catch (error) {
        console.error('There was an error submitting the form!', error);
      }
    } else {
      console.log('这里进不来')
    }
  };

  const customFooter = (
    <div className='custom-footer'>
      <Button key="custom-ok" type="primary" onClick={handleOk}>
        保存
      </Button>
      <Button key="custom-cancel" style={{marginLeft: 'var(--button-margin-left)'}} onClick={handleCancel}>
        取消
      </Button>
    </div>
  );


  return (
    <header className={styles.header}>
      {messageContextHolder}
      {modalContextHolder}
      <div className={styles.headerTitle}>{title}</div>
      <div className={styles.middle}><span>版权所有 &copy; 2024 - 2026 <a href="http://www.52ejn.com" target="_blank">源码学习网</a></span><a href="http://beian.miit.gov.cn" target="_blank">粤ICP备2024308896号-1</a></div>
      <div className={styles.headerNav}>
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()} className={styles.headerNavContent}>
            <Space>
              {username}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
      <Modal title="修改密码" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={'50%'} footer={customFooter}>
        <Form
          name="changePassword"
          initialValues={{ remember: true }}
          ref={formRef}
          autoComplete="off">
          <Form.Item
            name="oldPass"
            label="原密码"
            rules={rules.oldPassword}
            labelCol={{ span: 4 }} // 设置标签的宽度为 6 列
            wrapperCol={{ span: 20 }} // 设置输入框的宽度为 18 列
          >
            <Input.Password value={updatePassForm.oldPass} onChange={(e) => setOldPass(e.target.value)}/>
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="新密码"
            rules={rules.newPassword}
            labelCol={{ span: 4 }} // 设置标签的宽度为 6 列
            wrapperCol={{ span: 20 }} // 设置输入框的宽度为 18 列
          >
            <Input.Password value={updatePassForm.newPass} onChange={(e) => setNewPass(e.target.value)}/>
          </Form.Item>

          <Form.Item
            name="confirmNewPassword"
            label="新密码确认"
            dependencies={['newPassword']}
            rules={rules.confirmNewPassword}
            labelCol={{ span: 4 }} // 设置标签的宽度为 6 列
            wrapperCol={{ span: 20 }} // 设置输入框的宽度为 18 列
          >
            <Input.Password value={updatePassForm.newPass2} onChange={(e) => setNewPass2(e.target.value)}/>
          </Form.Item>
        </Form>
      </Modal>
    </header>
  );
};

export default Header;