import React, {useCallback, useEffect, useState} from 'react';
import {Breadcrumb, Button, Form, Input, message, Modal, Space, Table, TableProps} from 'antd';
import {useNavigate} from "react-router-dom";
import type {Faculty} from "@/types/resp/faculty";
import facultyApi from '@/api/facultyApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import FacultyAdd from "@/pages/faculty/FacultyAdd.tsx";
import FacultyView from "@/pages/faculty/FacultyView.tsx";
import UniversitySelector from "@/pages/university/UniversitySelector.tsx";


const FacultyList: React.FC = () => {

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const breadcrumbsItems = [
    {title: '首页', className: 'breadcrumbHome', onClick: () => handleClick('/Home')},
    {title: '院系信息列表'}
  ]

  const [form] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    form.resetFields();
  };

  const [data, setData] = useState<Faculty[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<Faculty>> = await facultyApi.find(form.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<Faculty> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<Faculty>['columns'] = [
    {title: '学校名称', dataIndex: 'universityName', key: 'universityName'},
    {title: '院系名称', dataIndex: 'name', key: 'name'},
    {title: '成立日期', key: 'establishmentDate', render: (_, record) => (
      <div>{record.establishmentDate.format('YYYY-MM-DD')}</div>
    )},
    {title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone'},
    {title: '邮箱', dataIndex: 'email', key: 'email'},
    {title: '办公地点', dataIndex: 'officeLocation', key: 'officeLocation'},
    {title: '院系网址', dataIndex: 'website', key: 'website'},
    {title: '院系简介', dataIndex: 'facultyDescription', key: 'facultyDescription', ellipsis: true},
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

  const [facultyAddVisible, setFacultyAddVisible] = useState(false);
  const [facultyViewVisible, setFacultyViewVisible] = useState(false);
  const [selectedFacultyId, setSelectedFacultyId] = useState(0)
  const [selectedFaculty, setSelectedFaculty] = useState({})

  const onAdd = () => {
    setSelectedFacultyId(0)
    setFacultyAddVisible(true)
  };

  const editRow = (id: number) => {
    setSelectedFacultyId(id)
    setFacultyAddVisible(true)
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
      facultyApi.del(id)
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

  const detailRow = (record: Faculty) => {
    setSelectedFaculty(record)
    setFacultyViewVisible(true)
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

  const handleCloseFacultyAdd = () => {
    setFacultyAddVisible(false)
  };

  const handleCloseFacultyView = () => {
    setFacultyViewVisible(false)
  };

  useEffect(() => {
    onSearch();

    return () => {
    };
  }, []);

  return (
    <div className="facultyList">
      {messageContextHolder}
      {modalContextHolder}
      <Breadcrumb items={breadcrumbsItems} style={{marginBottom: 'var(--container-margin)'}} />
      <Form form={form} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="universityName" label="学校名称">
          <Input.Search placeholder="请选择学校名称" onSearch={findUniversity} readOnly={true} />
        </Form.Item>
        <Form.Item name="name" label="院系名称">
          <Input maxLength={64} placeholder="请输入院系名称"/>
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
      <Table<Faculty> columns={columns} dataSource={data} size="small" rowKey={record => record.id} pagination={{ position: ["bottomCenter"] }} style={{marginTop: 'var(--container-margin)'}} />
      <UniversitySelector visible={universitySelectorVisible} onUniversitySelected={handleUniversitySelected} onCloseUniversitySelector={handleCloseUniversitySelector} />
      <FacultyAdd visible={facultyAddVisible} onCloseFacultyAdd={handleCloseFacultyAdd} id={selectedFacultyId} />
      <FacultyView visible={facultyViewVisible} onCloseFacultyView={handleCloseFacultyView} viewRow={selectedFaculty} />
    </div>
  );
};

export default FacultyList;
