import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Table, TableProps} from 'antd';
import type {Course} from "@/types/resp/course";
import courseApi from '@/api/courseApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import FacultySelector from "@/pages/faculty/FacultySelector.tsx";
import TeacherSelector from "@/pages/teacher/TeacherSelector.tsx";


interface CourseSelectorProps {
  visible: boolean;
  onCourseSelected: (selectedCourse: { courseId?: number;courseName?: string; }) => void;
  onCloseCourseSelector: () => void;
}

const CourseSelector: React.FC<CourseSelectorProps> = ({visible, onCourseSelected, onCloseCourseSelector}) => {

  const [courseSelectorForm] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    courseSelectorForm.resetFields();
  };

  const [data, setData] = useState<Course[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<Course>> = await courseApi.find(courseSelectorForm.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<Course> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<Course>['columns'] = [
    {title: '院系名称', dataIndex: 'facultyName', key: 'facultyName'},
    {title: '教师姓名', dataIndex: 'teacherName', key: 'teacherName'},
    {title: '课程代码', dataIndex: 'code', key: 'code'},
    {title: '课程名称', dataIndex: 'name', key: 'name'},
    {title: '学分', dataIndex: 'credit', key: 'credit'},
    {title: '课程描述', dataIndex: 'courseDescription', key: 'courseDescription', ellipsis: true},
  ];

  const handleRowDoubleClick = (row: Course) => {
    onCourseSelected({
      courseId: row.id,
      courseName: row.name,
    })
  };

  const selectorFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onCloseCourseSelector}>关闭</Button>
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
      courseSelectorForm.setFieldsValue(Object.assign(courseSelectorForm.getFieldsValue(), {
      facultyId: selectedFaculty['facultyId'],
      facultyName: selectedFaculty['facultyName'],
      }));
    }
  };
  const handleCloseFacultySelector = () => {
    setFacultySelectorVisible(false)
  };
  const [teacherSelectorVisible, setTeacherSelectorVisible] = useState(false);
  const findTeacher = () => {
    setTeacherSelectorVisible(true);
  }
  const handleTeacherSelected = (selectedTeacher: { teacherId?: number; teacherName?: string; }) => {
    setTeacherSelectorVisible(false)
    if (selectedTeacher && 'teacherId' in selectedTeacher) {
      courseSelectorForm.setFieldsValue(Object.assign(courseSelectorForm.getFieldsValue(), {
      teacherId: selectedTeacher['teacherId'],
      teacherName: selectedTeacher['teacherName'],
      }));
    }
  };
  const handleCloseTeacherSelector = () => {
    setTeacherSelectorVisible(false)
  };

  return (
    <Modal title={"课程信息选择器(双击行选中)"} open={visible} onCancel={onCloseCourseSelector}
        width={'var(--modal-width)'} footer={selectorFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={courseSelectorForm} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="facultyName" label="院系名称">
          <Input.Search placeholder="请选择院系名称" onSearch={findFaculty} readOnly={true} />
        </Form.Item>
        <Form.Item name="teacherName" label="教师姓名">
          <Input.Search placeholder="请选择教师姓名" onSearch={findTeacher} readOnly={true} />
        </Form.Item>
        <Form.Item name="name" label="课程名称">
          <Input maxLength={64} placeholder="请输入课程名称"/>
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">查询</Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button onClick={onReset}>重置</Button>
        </Form.Item>
      </Form>
      <Table<Course> columns={columns} dataSource={data} size="small" rowKey={record => record.id}
                         pagination={{ position: ["bottomCenter"] }}
                         onRow={(row) => ({
                           onDoubleClick: (event) => {
                             event.preventDefault();
                             handleRowDoubleClick(row);
                           },
                         })}/>
      <FacultySelector visible={facultySelectorVisible} onFacultySelected={handleFacultySelected} onCloseFacultySelector={handleCloseFacultySelector} />
      <TeacherSelector visible={teacherSelectorVisible} onTeacherSelected={handleTeacherSelected} onCloseTeacherSelector={handleCloseTeacherSelector} />
    </Modal>
  );
};

export default CourseSelector;
