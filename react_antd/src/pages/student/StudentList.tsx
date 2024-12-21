import React, {useCallback, useEffect, useState} from 'react';
import {Breadcrumb, Button, Form, Input, InputNumber, message, Modal, Select, Space, Table, TableProps} from 'antd';
import {useNavigate} from "react-router-dom";
import type {Student} from "@/types/resp/student";
import studentApi from '@/api/studentApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import StudentAdd from "@/pages/student/StudentAdd.tsx";
import StudentView from "@/pages/student/StudentView.tsx";
import MajorSelector from "@/pages/major/MajorSelector.tsx";
import {getGenderText} from "@/utils/dictTranslator"
import {exportToExcel} from "@/utils/exportUtil";


const StudentList: React.FC = () => {

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const breadcrumbsItems = [
    {title: '首页', className: 'breadcrumbHome', onClick: () => handleClick('/Home')},
    {title: '学生信息列表'}
  ]

  const [form] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    form.resetFields();
  };

  const [data, setData] = useState<Student[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<Student>> = await studentApi.find(form.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<Student> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<Student>['columns'] = [
    {title: '学号', dataIndex: 'studentNumber', key: 'studentNumber', width: 60},
    {title: '姓名', dataIndex: 'name', key: 'name', width: 60},
    {title: '密码', dataIndex: 'password', key: 'password', width: 60},
    {title: '性别', key: 'gender', width: 40, render: (_, record) => (
        <span>
        {(function () {
          if (record.gender === 1) return '男';
          else if (record.gender === 2) return '女';
          else return '未知';
        })()}
      </span>
      ),
    },
    {title: '出生日期', key: 'birthDate', width: 90, render: (_, record) => (
      <div>{record.birthDate.format('YYYY-MM-DD')}</div>
    )},
    {title: '专业名称', dataIndex: 'majorName', key: 'majorName', width: 120},
    {title: '年级', dataIndex: 'grade', key: 'grade', width: 50},
    {title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone', width: 120},
    {title: '邮箱', dataIndex: 'email', key: 'email', width: 120},
    {title: '省', dataIndex: 'provinceName', key: 'province', width: 100},
    {title: '市', dataIndex: 'cityName', key: 'city', width: 100},
    {title: '区', dataIndex: 'areaName', key: 'area', width: 100},
    {title: '家庭地址', dataIndex: 'address', key: 'address', width: 140},
    {title: '入学日期', key: 'enrollmentDate', width: 90, render: (_, record) => (
      <div>{record.enrollmentDate.format('YYYY-MM-DD')}</div>
    )},
    {title: '毕业日期', key: 'graduationDate', width: 90, render: (_, record) => (
      <div>{record.graduationDate.format('YYYY-MM-DD')}</div>
    )},
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

  const [studentAddVisible, setStudentAddVisible] = useState(false);
  const [studentViewVisible, setStudentViewVisible] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(0)
  const [selectedStudent, setSelectedStudent] = useState({})

  const onAdd = () => {
    setSelectedStudentId(0)
    setStudentAddVisible(true)
  };

  const editRow = (id: number) => {
    setSelectedStudentId(id)
    setStudentAddVisible(true)
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
      studentApi.del(id)
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

  const detailRow = (record: Student) => {
    setSelectedStudent(record)
    setStudentViewVisible(true)
  };

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

  const handleCloseStudentAdd = () => {
    setStudentAddVisible(false)
  };

  const handleCloseStudentView = () => {
    setStudentViewVisible(false)
  };

  const onExport = () => {
    const headers = ['学号', '姓名', '性别', '出生日期', '专业名称', '年级', '联系电话', '邮箱', '省', '市', '区', '家庭地址', '入学日期', '毕业日期']
    studentApi.find(form.getFieldsValue()).then(data => {
      if (!data || !data.data || data.data.list.length < 1) {
        messageApi.error('无数据导出')
        return
      }
      const exportData = []
      for (const d of data.data.list) {
        exportData.push([d.studentNumber, d.name, getGenderText(d.gender), d.birthDate, d.majorName, d.grade, d.contactPhone, d.email,
          d.provinceName, d.cityName, d.areaName, d.address, d.enrollmentDate, d.graduationDate])
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
    <div className="studentList">
      {messageContextHolder}
      {modalContextHolder}
      <Breadcrumb items={breadcrumbsItems} style={{marginBottom: 'var(--container-margin)'}} />
      <Form form={form} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="studentNumber" label="学号">
          <Input maxLength={20} placeholder="请输入学号"/>
        </Form.Item>
        <Form.Item name="gender" label="性别">
          <Select placeholder="请选择性别" options={[
            { value: 1, label: <span>男</span> },
            { value: 2, label: <span>女</span> }
          ]} style={{width: 'var(--select-width)'}} />
        </Form.Item>
        <Form.Item name="majorName" label="专业名称">
          <Input.Search placeholder="请选择专业名称" onSearch={findMajor} readOnly={true} />
        </Form.Item>
        <Form.Item name="grade" label="年级">
          <InputNumber min={2000} max={2100} />
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
      <Table<Student> columns={columns} dataSource={data} size="small" rowKey={record => record.id}
                      pagination={{ position: ["bottomCenter"] }}
                      scroll={{ x: 'max-content' }}
                      style={{marginTop: 'var(--container-margin)'}} />
      <MajorSelector visible={majorSelectorVisible} onMajorSelected={handleMajorSelected} onCloseMajorSelector={handleCloseMajorSelector} />
      <StudentAdd visible={studentAddVisible} onCloseStudentAdd={handleCloseStudentAdd} id={selectedStudentId} />
      <StudentView visible={studentViewVisible} onCloseStudentView={handleCloseStudentView} viewRow={selectedStudent} />
    </div>
  );
};

export default StudentList;
