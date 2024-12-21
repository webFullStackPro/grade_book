import React, {useEffect, useState} from "react";
import {Button, Col, DatePicker, Form, Input, message, Modal, Row, Select} from "antd";
import type {Result} from "@/types/result";
import attendanceApi from "@/api/attendanceApi.ts";
import {Attendance} from "@/types/resp/attendance";
import CourseSelector from "@/pages/course/CourseSelector.tsx";
import StudentSelector from "@/pages/student/StudentSelector.tsx";

interface AttendanceAddProps {
  visible: boolean;
  id: number;
  onCloseAttendanceAdd: () => void;
}

const AttendanceAdd: React.FC<AttendanceAddProps> = ({visible, id, onCloseAttendanceAdd}) => {

  const [form] = Form.useForm<Attendance>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    courseName: [
      { required: true, message: '请输入课程名称' }
    ],
    studentNumber: [
      { required: true, message: '请输入学生学号' }
    ],
    attendanceDate: [
      { required: true, message: '请输入考勤日期' }
    ],
    status: [
      { required: true, message: '请输入状态' }
    ],
  };

  let attendanceForm: Partial<Attendance> = {}

  const [title, setTitle] = useState('新增考勤信息');

  useEffect(() => {
    if (!visible) {
      return
    }
    if (id) {
      setTitle('编辑考勤信息')
      initAttendanceFormById(id)
    } else {
      setTitle('新增考勤信息')
      form.resetFields();
    }
  }, [visible]);

  const initAttendanceFormById = async (id: number) => {
    const resp: Result<Attendance> = await attendanceApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      attendanceForm = resp.data
      form.setFieldsValue(resp.data);
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let attendance2Save:Attendance = form.getFieldsValue()
      if (id) {
        attendance2Save = Object.assign(attendanceForm, attendance2Save)
      }
      const resp: Result<void> = await attendanceApi.save(attendance2Save);
      if (!resp || resp.code !== 1) {
        messageApi.error('保存失败:' + (resp.msg ? resp.msg : '未知异常'));
        return
      }
      messageApi.success('保存成功');
      onBack()
    } catch (error) {
      console.error('There was an error submitting the form!', error);
    }
  };

  const onReset = () => {
    setTitle('新增考勤信息')
    form.resetFields();
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

  const onBack = () => {
    onCloseAttendanceAdd()
  };

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onSave}>保存</Button>
      <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>关闭</Button>
    </div>
  );

  return (
    <Modal title={title} open={visible} onCancel={onCloseAttendanceAdd} width={'var(--modal-width)'}
        footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      {messageContextHolder}
      <Form form={form} name="attendanceForm" labelCol={{span: 6}}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="courseName" label="课程名称" rules={rules.courseName}>
              <Input.Search placeholder="请选择课程名称" onSearch={findCourse} readOnly={true} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="studentNumber" label="学生学号" rules={rules.studentNumber}>
              <Input.Search placeholder="请选择学生学号" onSearch={findStudent} readOnly={true} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="attendanceDate" label="考勤日期" rules={rules.attendanceDate}>
              <DatePicker/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="status" label="状态" rules={rules.status}>
              <Select placeholder="请选择状态" options={[
                { value: 10, label: <span>出勤</span> },
                { value: 20, label: <span>缺勤</span> },
                { value: 30, label: <span>迟到</span> }
              ]} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <CourseSelector visible={courseSelectorVisible} onCourseSelected={handleCourseSelected} onCloseCourseSelector={handleCloseCourseSelector} />
      <StudentSelector visible={studentSelectorVisible} onStudentSelected={handleStudentSelected} onCloseStudentSelector={handleCloseStudentSelector} />
    </Modal>
  )
}

export default AttendanceAdd;
