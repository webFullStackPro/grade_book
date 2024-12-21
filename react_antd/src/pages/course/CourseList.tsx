import React, {useCallback, useEffect, useState} from 'react';
import {Breadcrumb, Button, Form, Input, message, Modal, Space, Table, TableProps} from 'antd';
import {useNavigate} from "react-router-dom";
import type {Course} from "@/types/resp/course";
import courseApi from '@/api/courseApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import CourseAdd from "@/pages/course/CourseAdd.tsx";
import CourseView from "@/pages/course/CourseView.tsx";
import FacultySelector from "@/pages/faculty/FacultySelector.tsx";
import TeacherSelector from "@/pages/teacher/TeacherSelector.tsx";
import {exportToExcel} from "@/utils/exportUtil";


const CourseList: React.FC = () => {

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const breadcrumbsItems = [
    {title: '首页', className: 'breadcrumbHome', onClick: () => handleClick('/Home')},
    {title: '课程信息列表'}
  ]

  const [form] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    form.resetFields();
  };

  const [data, setData] = useState<Course[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<Course>> = await courseApi.find(form.getFieldsValue())
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

  const [courseAddVisible, setCourseAddVisible] = useState(false);
  const [courseViewVisible, setCourseViewVisible] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(0)
  const [selectedCourse, setSelectedCourse] = useState({})

  const onAdd = () => {
    setSelectedCourseId(0)
    setCourseAddVisible(true)
  };

  const editRow = (id: number) => {
    setSelectedCourseId(id)
    setCourseAddVisible(true)
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
      courseApi.del(id)
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

  const detailRow = (record: Course) => {
    setSelectedCourse(record)
    setCourseViewVisible(true)
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
  const [teacherSelectorVisible, setTeacherSelectorVisible] = useState(false);
  const findTeacher = () => {
    setTeacherSelectorVisible(true);
  }
  const handleTeacherSelected = (selectedTeacher: { teacherId?: number; teacherName?: string; }) => {
    setTeacherSelectorVisible(false)
    if (selectedTeacher && 'teacherId' in selectedTeacher) {
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
      teacherId: selectedTeacher['teacherId'],
      teacherName: selectedTeacher['teacherName'],
      }));
    }
  };
  const handleCloseTeacherSelector = () => {
    setTeacherSelectorVisible(false)
  };

  const handleCloseCourseAdd = () => {
    setCourseAddVisible(false)
  };

  const handleCloseCourseView = () => {
    setCourseViewVisible(false)
  };

  const onExport = () => {
    const headers = ['院系名称', '教师姓名', '课程代码', '课程名称', '学分', '课程描述']
    courseApi.find(form.getFieldsValue()).then(data => {
      if (!data || !data.data || data.data.list.length < 1) {
        messageApi.error('无数据导出')
        return
      }
      const exportData = []
      for (const d of data.data.list) {
        exportData.push([d.facultyName, d.teacherName, d.code, d.name, d.credit, d.courseDescription])
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
    <div className="courseList">
      {messageContextHolder}
      {modalContextHolder}
      <Breadcrumb items={breadcrumbsItems} style={{marginBottom: 'var(--container-margin)'}} />
      <Form form={form} onFinish={onFinish} layout={"inline"}>
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
        <Form.Item label={null}>
          <Button type="primary" onClick={onAdd}>新增</Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" onClick={onExport}>导出</Button>
        </Form.Item>
      </Form>
      <Table<Course> columns={columns} dataSource={data} size="small" rowKey={record => record.id} pagination={{ position: ["bottomCenter"] }} style={{marginTop: 'var(--container-margin)'}} />
      <FacultySelector visible={facultySelectorVisible} onFacultySelected={handleFacultySelected} onCloseFacultySelector={handleCloseFacultySelector} />
      <TeacherSelector visible={teacherSelectorVisible} onTeacherSelected={handleTeacherSelected} onCloseTeacherSelector={handleCloseTeacherSelector} />
      <CourseAdd visible={courseAddVisible} onCloseCourseAdd={handleCloseCourseAdd} id={selectedCourseId} />
      <CourseView visible={courseViewVisible} onCloseCourseView={handleCloseCourseView} viewRow={selectedCourse} />
    </div>
  );
};

export default CourseList;
