import React, {useEffect, useState} from 'react';
import {Button, Form, Input, InputNumber, Modal, Select, Table, TableProps} from 'antd';
import type {Student} from "@/types/resp/student";
import studentApi from '@/api/studentApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import MajorSelector from "@/pages/major/MajorSelector.tsx";


interface StudentSelectorProps {
  visible: boolean;
  onStudentSelected: (selectedStudent: { studentId?: number;studentNumber?: string; }) => void;
  onCloseStudentSelector: () => void;
}

const StudentSelector: React.FC<StudentSelectorProps> = ({visible, onStudentSelected, onCloseStudentSelector}) => {

  const [studentSelectorForm] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    studentSelectorForm.resetFields();
  };

  const [data, setData] = useState<Student[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<Student>> = await studentApi.find(studentSelectorForm.getFieldsValue())
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
  ];

  const handleRowDoubleClick = (row: Student) => {
    onStudentSelected({
      studentId: row.id,
      studentNumber: row.studentNumber,
    })
  };

  const selectorFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onCloseStudentSelector}>关闭</Button>
    </div>
  );

  useEffect(() => {
    if (visible) {
      onSearch();
    }
  }, [visible]);

  const [majorSelectorVisible, setMajorSelectorVisible] = useState(false);
  const findMajor = () => {
    setMajorSelectorVisible(true);
  }
  const handleMajorSelected = (selectedMajor: { majorId?: number; majorName?: string; }) => {
    setMajorSelectorVisible(false)
    if (selectedMajor && 'majorId' in selectedMajor) {
      studentSelectorForm.setFieldsValue(Object.assign(studentSelectorForm.getFieldsValue(), {
      majorId: selectedMajor['majorId'],
      majorName: selectedMajor['majorName'],
      }));
    }
  };
  const handleCloseMajorSelector = () => {
    setMajorSelectorVisible(false)
  };

  return (
    <Modal title={"学生信息选择器(双击行选中)"} open={visible} onCancel={onCloseStudentSelector} width={'var(--modal-width)'} footer={selectorFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={studentSelectorForm} onFinish={onFinish} layout={"inline"}>
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
      </Form>
      <Table<Student> columns={columns} dataSource={data} size="small"
                      scroll={{ x: 'max-content' }}
                      rowKey={record => record.id}
                         pagination={{ position: ["bottomCenter"] }}
                         onRow={(row) => ({
                           onDoubleClick: (event) => {
                             event.preventDefault();
                             handleRowDoubleClick(row);
                           },
                         })}/>
      <MajorSelector visible={majorSelectorVisible} onMajorSelected={handleMajorSelected} onCloseMajorSelector={handleCloseMajorSelector} />
    </Modal>
  );
};

export default StudentSelector;
