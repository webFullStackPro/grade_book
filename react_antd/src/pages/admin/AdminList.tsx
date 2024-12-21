import React, {useCallback, useEffect, useState} from 'react';
import {Breadcrumb, Button, Form, Input, message, Modal, Space, Table, TableProps} from 'antd';
import {useNavigate} from "react-router-dom";
import type {Admin} from "@/types/resp/admin";
import adminApi from '@/api/adminApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import AdminAdd from "@/pages/admin/AdminAdd";
import AdminView from "@/pages/admin/AdminView";


const AdminList: React.FC = () => {

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const breadcrumbsItems = [
    {title: '首页', className: 'breadcrumbHome', onClick: () => handleClick('/Home')},
    {title: '管理员列表'}
  ]

  const [form] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    form.resetFields();
  };

  const [data, setData] = useState<Admin[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<Admin>> = await adminApi.find(form.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<Admin> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<Admin>['columns'] = [
    {title: '用户名', dataIndex: 'username', key: 'username'},
    {title: '密码', dataIndex: 'password', key: 'password'},
    {title: '姓名', dataIndex: 'name', key: 'name'},
    {
      title: '操作',
      key: 'action',
      width: '250px',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => editRow(record.id)}>编辑</Button>
          <Button danger onClick={() => delRow(record.id)}>删除</Button>
          <Button color="primary" variant="outlined" onClick={() => detailRow(record)}>详情</Button>
        </Space>
      ),
    },
  ];

  const [adminAddVisible, setAdminAddVisible] = useState(false);
  const [adminViewVisible, setAdminViewVisible] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(0)
  const [selectedAdmin, setSelectedAdmin] = useState({})

  const onAdd = () => {
    setSelectedAdminId(0)
    setAdminAddVisible(true)
  };

  const editRow = (id: number) => {
    setSelectedAdminId(id)
    setAdminAddVisible(true)
  };

  const delRow = useCallback(async (id: number) => {
    const confirmed = await modal.confirm({
      title: '删除提示',
      content: (
        <>
          确定要删除吗?
        </>
      ),
      okText: '确定',
      cancelText: '取消',
      type: 'warning'
    });

    if (confirmed) {
      adminApi.del(id)
        .then((resp) => {
          if (resp && resp.code === 1) {
            messageApi.success('删除成功!')
            onSearch()
          } else {
            messageApi.error('操作失败:' + (resp.msg ? resp.msg : '原因未知'))
          }
        })
        .catch(error => {
          console.error('操作失败:', error)
        })
    }
  }, [modal]);

  const detailRow = (record: Admin) => {
    setSelectedAdmin(record)
    setAdminViewVisible(true)
  };

  const handleCloseAdminAdd = () => {
    setAdminAddVisible(false)
  };

  const handleCloseAdminView = () => {
    setAdminViewVisible(false)
  };

  useEffect(() => {
    onSearch();

    return () => {
    };
  }, []);

  return (
    <div className="adminList">
      {messageContextHolder}
      {modalContextHolder}
      <Breadcrumb items={breadcrumbsItems} style={{marginBottom: 'var(--container-margin)'}} />
      <Form form={form} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="username" label="用户名">
          <Input maxLength={64} placeholder="请输入用户名"/>
        </Form.Item>
        <Form.Item name="name" label="姓名">
          <Input maxLength={64} placeholder="请输入姓名"/>
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">查询</Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button onClick={onReset}>重置</Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" onClick={onAdd}>新增</Button>
        </Form.Item>
      </Form>
      <Table<Admin> columns={columns} dataSource={data} size="small" rowKey={record => record.id} pagination={{ position: ["bottomCenter"] }} style={{marginTop: 'var(--container-margin)'}} />
      <AdminAdd visible={adminAddVisible} onCloseAdminAdd={handleCloseAdminAdd} id={selectedAdminId} />
      <AdminView visible={adminViewVisible} onCloseAdminView={handleCloseAdminView} viewRow={selectedAdmin} />
    </div>
  );
};

export default AdminList;
