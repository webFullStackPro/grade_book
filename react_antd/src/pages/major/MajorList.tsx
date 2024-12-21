import React, {useCallback, useEffect, useState} from 'react';
import {Breadcrumb, Button, Form, Input, message, Modal, Select, Space, Table, TableProps} from 'antd';
import {useNavigate} from "react-router-dom";
import type {Major} from "@/types/resp/major";
import majorApi from '@/api/majorApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import MajorAdd from "@/pages/major/MajorAdd.tsx";
import MajorView from "@/pages/major/MajorView.tsx";
import FacultySelector from "@/pages/faculty/FacultySelector.tsx";


const MajorList: React.FC = () => {

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const breadcrumbsItems = [
    {title: '首页', className: 'breadcrumbHome', onClick: () => handleClick('/Home')},
    {title: '专业信息列表'}
  ]

  const [form] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    form.resetFields();
  };

  const [data, setData] = useState<Major[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<Major>> = await majorApi.find(form.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<Major> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<Major>['columns'] = [
    {title: '院系名称', dataIndex: 'facultyName', key: 'facultyName'},
    {title: '专业名称', dataIndex: 'name', key: 'name'},
    {title: '学位类型', key: 'degreeType', render: (_, record) => (
        <span>
        {(function () {
          if (record.degreeType === 1) return '学士';
          else if (record.degreeType === 2) return '硕士';
          else if (record.degreeType === 3) return '博士';
          else return '未知';
        })()}
      </span>
      ),
    },
    {title: '学制(年)', dataIndex: 'duration', key: 'duration'},
    {title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone'},
    {title: '邮箱', dataIndex: 'email', key: 'email'},
    {title: '办公地点', dataIndex: 'officeLocation', key: 'officeLocation'},
    {title: '专业简介', dataIndex: 'majorDescription', key: 'majorDescription', ellipsis: true},
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

  const [majorAddVisible, setMajorAddVisible] = useState(false);
  const [majorViewVisible, setMajorViewVisible] = useState(false);
  const [selectedMajorId, setSelectedMajorId] = useState(0)
  const [selectedMajor, setSelectedMajor] = useState({})

  const onAdd = () => {
    setSelectedMajorId(0)
    setMajorAddVisible(true)
  };

  const editRow = (id: number) => {
    setSelectedMajorId(id)
    setMajorAddVisible(true)
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
      majorApi.del(id)
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

  const detailRow = (record: Major) => {
    setSelectedMajor(record)
    setMajorViewVisible(true)
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

  const handleCloseMajorAdd = () => {
    setMajorAddVisible(false)
  };

  const handleCloseMajorView = () => {
    setMajorViewVisible(false)
  };

  useEffect(() => {
    onSearch();

    return () => {
    };
  }, []);

  return (
    <div className="majorList">
      {messageContextHolder}
      {modalContextHolder}
      <Breadcrumb items={breadcrumbsItems} style={{marginBottom: 'var(--container-margin)'}} />
      <Form form={form} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="facultyName" label="院系名称">
          <Input.Search placeholder="请选择院系名称" onSearch={findFaculty} readOnly={true} />
        </Form.Item>
        <Form.Item name="name" label="专业名称">
          <Input maxLength={64} placeholder="请输入专业名称"/>
        </Form.Item>
        <Form.Item name="degreeType" label="学位类型">
          <Select placeholder="请选择学位类型" options={[
            { value: 1, label: <span>学士</span> },
            { value: 2, label: <span>硕士</span> },
            { value: 3, label: <span>博士</span> }
          ]} style={{width: 'var(--select-width)'}} />
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
      <Table<Major> columns={columns} dataSource={data} size="small" rowKey={record => record.id} pagination={{ position: ["bottomCenter"] }} style={{marginTop: 'var(--container-margin)'}} />
      <FacultySelector visible={facultySelectorVisible} onFacultySelected={handleFacultySelected} onCloseFacultySelector={handleCloseFacultySelector} />
      <MajorAdd visible={majorAddVisible} onCloseMajorAdd={handleCloseMajorAdd} id={selectedMajorId} />
      <MajorView visible={majorViewVisible} onCloseMajorView={handleCloseMajorView} viewRow={selectedMajor} />
    </div>
  );
};

export default MajorList;
