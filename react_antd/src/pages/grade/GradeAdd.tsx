import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, InputNumber, message, Modal, Row} from "antd";
import type {Result} from "@/types/result";
import gradeApi from "@/api/gradeApi.ts";
import {Grade} from "@/types/resp/grade";
import CourseSelector from "@/pages/course/CourseSelector.tsx";
import StudentSelector from "@/pages/student/StudentSelector.tsx";

interface GradeAddProps {
  visible: boolean;
  id: number;
  onCloseGradeAdd: () => void;
}

const GradeAdd: React.FC<GradeAddProps> = ({visible, id, onCloseGradeAdd}) => {

  const [form] = Form.useForm<Grade>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    courseName: [
      { required: true, message: '请输入课程名称' }
    ],
    studentNumber: [
      { required: true, message: '请输入学生学号' }
    ],
  };

  let gradeForm: Partial<Grade> = {}

  const [title, setTitle] = useState('新增成绩信息');

  useEffect(() => {
    if (!visible) {
      return
    }
    if (id) {
      setTitle('编辑成绩信息')
      initGradeFormById(id)
    } else {
      setTitle('新增成绩信息')
      form.resetFields();
    }
  }, [visible]);

  const initGradeFormById = async (id: number) => {
    const resp: Result<Grade> = await gradeApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      gradeForm = resp.data
      form.setFieldsValue(resp.data);
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let grade2Save:Grade = form.getFieldsValue()
      if (id) {
        grade2Save = Object.assign(gradeForm, grade2Save)
      }
      const resp: Result<void> = await gradeApi.save(grade2Save);
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
    setTitle('新增成绩信息')
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
    onCloseGradeAdd()
  };

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onSave}>保存</Button>
      <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>关闭</Button>
    </div>
  );

  return (
    <Modal title={title} open={visible} onCancel={onCloseGradeAdd} width={'var(--modal-width)'}
        footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      {messageContextHolder}
      <Form form={form} name="gradeForm" labelCol={{span: 6}}>
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
            <Form.Item name="grade" label="成绩">
              <InputNumber min={1} max={999} precision={2} step={0.1} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <CourseSelector visible={courseSelectorVisible} onCourseSelected={handleCourseSelected} onCloseCourseSelector={handleCloseCourseSelector} />
      <StudentSelector visible={studentSelectorVisible} onStudentSelected={handleStudentSelected} onCloseStudentSelector={handleCloseStudentSelector} />
    </Modal>
  )
}

export default GradeAdd;
