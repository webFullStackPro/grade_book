import React, {useCallback, useEffect, useState} from 'react';
import {Breadcrumb, Button, Form, Input, message, Modal, Select, Space, Table, TableProps} from 'antd';
import {useNavigate} from "react-router-dom";
import type {Teacher} from "@/types/resp/teacher";
import teacherApi from '@/api/teacherApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import TeacherAdd from "@/pages/teacher/TeacherAdd.tsx";
import TeacherView from "@/pages/teacher/TeacherView.tsx";
import FacultySelector from "@/pages/faculty/FacultySelector.tsx";
import { getTitleText, getGenderText } from "@/utils/dictTranslator"
import {exportToExcel} from "@/utils/exportUtil";


const TeacherList: React.FC = () => {

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const breadcrumbsItems = [
    {title: '首页', className: 'breadcrumbHome', onClick: () => handleClick('/Home')},
    {title: '教师信息列表'}
  ]

  const [form] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    form.resetFields();
  };

  const [data, setData] = useState<Teacher[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<Teacher>> = await teacherApi.find(form.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<Teacher> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<Teacher>['columns'] = [
    {title: '院系名称', dataIndex: 'facultyName', key: 'facultyName'},
    {title: '姓名', dataIndex: 'name', key: 'name'},
    {title: '密码', dataIndex: 'password', key: 'password'},
    {title: '职称', key: 'title', render: (_, record) => (
        <span>
        {(function () {
          if (record.title === 1) return '助教';
          else if (record.title === 2) return '讲师';
          else if (record.title === 3) return '副教授';
          else if (record.title === 4) return '教授';
          else return '未知';
        })()}
      </span>
      ),
    },
    {title: '性别', key: 'gender', render: (_, record) => (
        <span>
        {(function () {
          if (record.gender === 1) return '男';
          else if (record.gender === 2) return '女';
          else return '未知';
        })()}
      </span>
      ),
    },
    {title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone'},
    {title: '邮箱', dataIndex: 'email', key: 'email'},
    {title: '教师简介', dataIndex: 'profile', key: 'profile', ellipsis: true},
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

  const [teacherAddVisible, setTeacherAddVisible] = useState(false);
  const [teacherViewVisible, setTeacherViewVisible] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(0)
  const [selectedTeacher, setSelectedTeacher] = useState({})

  const onAdd = () => {
    setSelectedTeacherId(0)
    setTeacherAddVisible(true)
  };

  const editRow = (id: number) => {
    setSelectedTeacherId(id)
    setTeacherAddVisible(true)
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
      teacherApi.del(id)
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

  const detailRow = (record: Teacher) => {
    setSelectedTeacher(record)
    setTeacherViewVisible(true)
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

  const handleCloseTeacherAdd = () => {
    setTeacherAddVisible(false)
  };

  const handleCloseTeacherView = () => {
    setTeacherViewVisible(false)
  };

  const onExport = () => {
    const headers = ['院系名称', '姓名', '职称', '性别', '联系电话', '邮箱', '教师简介']
    teacherApi.find(form.getFieldsValue()).then(data => {
      if (!data || !data.data || data.data.list.length < 1) {
        messageApi.error('无数据导出')
        return
      }
      const exportData = []
      for (const d of data.data.list) {
        exportData.push([d.facultyName, d.name, getTitleText(d.title), getGenderText(d.gender), d.contactPhone, d.email, d.profile])
      }
      exportToExcel(headers, exportData)
    })
  }

  useEffect(() => {
    onSearch();

    return () => {
    };
  }, []);

  return (
    <div className="teacherList">
      {messageContextHolder}
      {modalContextHolder}
      <Breadcrumb items={breadcrumbsItems} style={{marginBottom: 'var(--container-margin)'}} />
      <Form form={form} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="facultyName" label="院系名称">
          <Input.Search placeholder="请选择院系名称" onSearch={findFaculty} readOnly={true} />
        </Form.Item>
        <Form.Item name="name" label="姓名">
          <Input maxLength={64} placeholder="请输入姓名"/>
        </Form.Item>
        <Form.Item name="title" label="职称">
          <Select placeholder="请选择职称" options={[
            { value: 1, label: <span>助教</span> },
            { value: 2, label: <span>讲师</span> },
            { value: 3, label: <span>副教授</span> },
            { value: 4, label: <span>教授</span> }
          ]} style={{width: 'var(--select-width)'}} />
        </Form.Item>
        <Form.Item name="gender" label="性别">
          <Select placeholder="请选择性别" options={[
            { value: 1, label: <span>男</span> },
            { value: 2, label: <span>女</span> }
          ]} style={{width: 'var(--select-width)'}} />
        </Form.Item>
        <Form.Item name="contactPhone" label="联系电话">
          <Input maxLength={64} placeholder="请输入联系电话"/>
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
        <Form.Item label={null}>
          <Button type="primary" onClick={onExport}>导出</Button>
        </Form.Item>
      </Form>
      <Table<Teacher> columns={columns} dataSource={data} size="small" rowKey={record => record.id} pagination={{ position: ["bottomCenter"] }} style={{marginTop: 'var(--container-margin)'}} />
      <FacultySelector visible={facultySelectorVisible} onFacultySelected={handleFacultySelected} onCloseFacultySelector={handleCloseFacultySelector} />
      <TeacherAdd visible={teacherAddVisible} onCloseTeacherAdd={handleCloseTeacherAdd} id={selectedTeacherId} />
      <TeacherView visible={teacherViewVisible} onCloseTeacherView={handleCloseTeacherView} viewRow={selectedTeacher} />
    </div>
  );
};

export default TeacherList;
