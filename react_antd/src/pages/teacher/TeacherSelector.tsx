import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Select, Table, TableProps} from 'antd';
import type {Teacher} from "@/types/resp/teacher";
import teacherApi from '@/api/teacherApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import FacultySelector from "@/pages/faculty/FacultySelector.tsx";


interface TeacherSelectorProps {
  visible: boolean;
  onTeacherSelected: (selectedTeacher: { teacherId?: number;teacherName?: string; }) => void;
  onCloseTeacherSelector: () => void;
}

const TeacherSelector: React.FC<TeacherSelectorProps> = ({visible, onTeacherSelected, onCloseTeacherSelector}) => {

  const [teacherSelectorForm] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    teacherSelectorForm.resetFields();
  };

  const [data, setData] = useState<Teacher[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<Teacher>> = await teacherApi.find(teacherSelectorForm.getFieldsValue())
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
  ];

  const handleRowDoubleClick = (row: Teacher) => {
    onTeacherSelected({
      teacherId: row.id,
      teacherName: row.name,
    })
  };

  const selectorFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onCloseTeacherSelector}>关闭</Button>
    </div>
  );

  useEffect(() => {
    if (visible) {
      onSearch();
    }
  }, [visible]);

  const [facultySelectorVisible, setFacultySelectorVisible] = useState(false);
  const findFaculty = () => {
    setFacultySelectorVisible(true);
  }
  const handleFacultySelected = (selectedFaculty: { facultyId?: number; facultyName?: string; }) => {
    setFacultySelectorVisible(false)
    if (selectedFaculty && 'facultyId' in selectedFaculty) {
      teacherSelectorForm.setFieldsValue(Object.assign(teacherSelectorForm.getFieldsValue(), {
      facultyId: selectedFaculty['facultyId'],
      facultyName: selectedFaculty['facultyName'],
      }));
    }
  };
  const handleCloseFacultySelector = () => {
    setFacultySelectorVisible(false)
  };

  return (
    <Modal title={"教师信息选择器(双击行选中)"} open={visible} onCancel={onCloseTeacherSelector} width={'var(--modal-width)'} footer={selectorFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={teacherSelectorForm} onFinish={onFinish} layout={"inline"}>
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
      </Form>
      <Table<Teacher> columns={columns} dataSource={data} size="small" rowKey={record => record.id}
                         pagination={{ position: ["bottomCenter"] }}
                         onRow={(row) => ({
                           onDoubleClick: (event) => {
                             event.preventDefault();
                             handleRowDoubleClick(row);
                           },
                         })}/>
      <FacultySelector visible={facultySelectorVisible} onFacultySelected={handleFacultySelected} onCloseFacultySelector={handleCloseFacultySelector} />
    </Modal>
  );
};

export default TeacherSelector;
