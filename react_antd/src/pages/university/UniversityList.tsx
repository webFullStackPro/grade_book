import React, {useCallback, useEffect, useState} from 'react';
import {Breadcrumb, Button, Form, Input, message, Modal, Space, Table, TableProps} from 'antd';
import {useNavigate} from "react-router-dom";
import type {University} from "@/types/resp/university";
import universityApi from '@/api/universityApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import UniversityAdd from "@/pages/university/UniversityAdd";
import UniversityView from "@/pages/university/UniversityView";


const UniversityList: React.FC = () => {

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const breadcrumbsItems = [
    {title: '首页', className: 'breadcrumbHome', onClick: () => handleClick('/Home')},
    {title: '学校信息列表'}
  ]

  const [form] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    form.resetFields();
  };

  const [data, setData] = useState<University[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<University>> = await universityApi.find(form.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<University> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<University>['columns'] = [
    {title: '学校名称', dataIndex: 'name', key: 'name'},
    {title: '成立日期', key: 'establishmentDate', render: (_, record) => (
      <div>{record.establishmentDate.format('YYYY-MM-DD')}</div>
    )},
    {title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone'},
    {title: '邮箱', dataIndex: 'email', key: 'email'},
    {title: '省', dataIndex: 'provinceName', key: 'province'},
    {title: '市', dataIndex: 'cityName', key: 'city'},
    {title: '区', dataIndex: 'areaName', key: 'area'},
    {title: '地址', dataIndex: 'location', key: 'location'},
    {title: '学校简介', dataIndex: 'universityDescription', key: 'universityDescription', ellipsis: true},
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

  const [universityAddVisible, setUniversityAddVisible] = useState(false);
  const [universityViewVisible, setUniversityViewVisible] = useState(false);
  const [selectedUniversityId, setSelectedUniversityId] = useState(0)
  const [selectedUniversity, setSelectedUniversity] = useState({})

  const onAdd = () => {
    setSelectedUniversityId(0)
    setUniversityAddVisible(true)
  };

  const editRow = (id: number) => {
    setSelectedUniversityId(id)
    setUniversityAddVisible(true)
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
      universityApi.del(id)
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

  const detailRow = (record: University) => {
    setSelectedUniversity(record)
    setUniversityViewVisible(true)
  };

  const handleCloseUniversityAdd = () => {
    setUniversityAddVisible(false)
  };

  const handleCloseUniversityView = () => {
    setUniversityViewVisible(false)
  };

  useEffect(() => {
    onSearch();

    return () => {
    };
  }, []);

  return (
    <div className="universityList">
      {messageContextHolder}
      {modalContextHolder}
      <Breadcrumb items={breadcrumbsItems} style={{marginBottom: 'var(--container-margin)'}} />
      <Form form={form} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="name" label="学校名称">
          <Input maxLength={64} placeholder="请输入学校名称"/>
        </Form.Item>
        <Form.Item name="location" label="地址">
          <Input maxLength={255} placeholder="请输入地址"/>
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
      <Table<University> columns={columns} dataSource={data} size="small" rowKey={record => record.id} pagination={{ position: ["bottomCenter"] }} style={{marginTop: 'var(--container-margin)'}} />
      <UniversityAdd visible={universityAddVisible} onCloseUniversityAdd={handleCloseUniversityAdd} id={selectedUniversityId} />
      <UniversityView visible={universityViewVisible} onCloseUniversityView={handleCloseUniversityView} viewRow={selectedUniversity} />
    </div>
  );
};

export default UniversityList;
