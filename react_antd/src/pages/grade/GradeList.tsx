import React, {useCallback, useEffect, useState} from 'react';
import {Breadcrumb, Button, Form, Input, message, Modal, Space, Table, TableProps} from 'antd';
import {useNavigate} from "react-router-dom";
import type {Grade} from "@/types/resp/grade";
import gradeApi from '@/api/gradeApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import GradeAdd from "@/pages/grade/GradeAdd.tsx";
import GradeView from "@/pages/grade/GradeView.tsx";
import CourseSelector from "@/pages/course/CourseSelector.tsx";
import StudentSelector from "@/pages/student/StudentSelector.tsx";
import {exportToExcel} from "@/utils/exportUtil";


const GradeList: React.FC = () => {

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const breadcrumbsItems = [
    {title: '首页', className: 'breadcrumbHome', onClick: () => handleClick('/Home')},
    {title: '成绩信息列表'}
  ]

  const [form] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    form.resetFields();
  };

  const [data, setData] = useState<Grade[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<Grade>> = await gradeApi.find(form.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<Grade> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<Grade>['columns'] = [
    {title: '课程名称', dataIndex: 'courseName', key: 'courseName'},
    {title: '学生学号', dataIndex: 'studentNumber', key: 'studentNumber'},
    {title: '成绩', dataIndex: 'grade', key: 'grade'},
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

  const [gradeAddVisible, setGradeAddVisible] = useState(false);
  const [gradeViewVisible, setGradeViewVisible] = useState(false);
  const [selectedGradeId, setSelectedGradeId] = useState(0)
  const [selectedGrade, setSelectedGrade] = useState({})

  const onAdd = () => {
    setSelectedGradeId(0)
    setGradeAddVisible(true)
  };

  const editRow = (id: number) => {
    setSelectedGradeId(id)
    setGradeAddVisible(true)
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
      gradeApi.del(id)
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

  const detailRow = (record: Grade) => {
    setSelectedGrade(record)
    setGradeViewVisible(true)
  };

  const [courseSelectorVisible, setCourseSelectorVisible] = useState(false);
  const findCourse = () => {
    setCourseSelectorVisible(true);
  }
  const handleCourseSelected = (selectedCourse: { courseId?: number; courseName?: string; }) => {
    setCourseSelectorVisible(false)
    if (selectedCourse && 'courseId' in selectedCourse) {
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
      courseId: selectedCourse['courseId'],
      courseName: selectedCourse['courseName'],
      }));
    }
  };
  const handleCloseCourseSelector = () => {
    setCourseSelectorVisible(false)
  };
  const [studentSelectorVisible, setStudentSelectorVisible] = useState(false);
  const findStudent = () => {
    setStudentSelectorVisible(true);
  }
  const handleStudentSelected = (selectedStudent: { studentId?: number; studentNumber?: string; }) => {
    setStudentSelectorVisible(false)
    if (selectedStudent && 'studentId' in selectedStudent) {
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
      studentId: selectedStudent['studentId'],
      studentNumber: selectedStudent['studentNumber'],
      }));
    }
  };
  const handleCloseStudentSelector = () => {
    setStudentSelectorVisible(false)
  };

  const handleCloseGradeAdd = () => {
    setGradeAddVisible(false)
  };

  const handleCloseGradeView = () => {
    setGradeViewVisible(false)
  };

  const onExport = () => {
    const headers = ['课程名称', '学生学号', '成绩']
    gradeApi.find(form.getFieldsValue()).then(data => {
      if (!data || !data.data || data.data.list.length < 1) {
        messageApi.error('无数据导出')
        return
      }
      const exportData = []
      for (const d of data.data.list) {
        exportData.push([d.courseName, d.studentNumber, d.grade])
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
    <div className="gradeList">
      {messageContextHolder}
      {modalContextHolder}
      <Breadcrumb items={breadcrumbsItems} style={{marginBottom: 'var(--container-margin)'}} />
      <Form form={form} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="courseName" label="课程名称">
          <Input.Search placeholder="请选择课程名称" onSearch={findCourse} readOnly={true} />
        </Form.Item>
        <Form.Item name="studentNumber" label="学生学号">
          <Input.Search placeholder="请选择学生学号" onSearch={findStudent} readOnly={true} />
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
      <Table<Grade> columns={columns} dataSource={data} size="small" rowKey={record => record.id} pagination={{ position: ["bottomCenter"] }} style={{marginTop: 'var(--container-margin)'}} />
      <CourseSelector visible={courseSelectorVisible} onCourseSelected={handleCourseSelected} onCloseCourseSelector={handleCloseCourseSelector} />
      <StudentSelector visible={studentSelectorVisible} onStudentSelected={handleStudentSelected} onCloseStudentSelector={handleCloseStudentSelector} />
      <GradeAdd visible={gradeAddVisible} onCloseGradeAdd={handleCloseGradeAdd} id={selectedGradeId} />
      <GradeView visible={gradeViewVisible} onCloseGradeView={handleCloseGradeView} viewRow={selectedGrade} />
    </div>
  );
};

export default GradeList;
