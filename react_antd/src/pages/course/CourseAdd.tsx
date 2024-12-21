import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, InputNumber, message, Modal, Row} from "antd";
import type {Result} from "@/types/result";
import courseApi from "@/api/courseApi.ts";
import {Course} from "@/types/resp/course";
import FacultySelector from "@/pages/faculty/FacultySelector.tsx";
import TeacherSelector from "@/pages/teacher/TeacherSelector.tsx";

interface CourseAddProps {
  visible: boolean;
  id: number;
  onCloseCourseAdd: () => void;
}

const CourseAdd: React.FC<CourseAddProps> = ({visible, id, onCloseCourseAdd}) => {

  const [form] = Form.useForm<Course>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    facultyName: [
      { required: true, message: '请输入院系名称' }
    ],
    teacherName: [
      { required: true, message: '请输入教师姓名' }
    ],
    code: [
      { required: true, message: '请输入课程代码' }
    ],
    name: [
      { required: true, message: '请输入课程名称' }
    ],
    credit: [
      { required: true, message: '请输入学分' }
    ],
  };

  let courseForm: Partial<Course> = {}

  const [title, setTitle] = useState('新增课程信息');

  useEffect(() => {
    if (!visible) {
      return
    }
    if (id) {
      setTitle('编辑课程信息')
      initCourseFormById(id)
    } else {
      setTitle('新增课程信息')
      form.resetFields();
    }
  }, [visible]);

  const initCourseFormById = async (id: number) => {
    const resp: Result<Course> = await courseApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      courseForm = resp.data
      form.setFieldsValue(resp.data);
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let course2Save:Course = form.getFieldsValue()
      if (id) {
        course2Save = Object.assign(courseForm, course2Save)
      }
      const resp: Result<void> = await courseApi.save(course2Save);
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
    setTitle('新增课程信息')
    form.resetFields();
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

  const onBack = () => {
    onCloseCourseAdd()
  };

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onSave}>保存</Button>
      <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>关闭</Button>
    </div>
  );

  return (
    <Modal title={title} open={visible} onCancel={onCloseCourseAdd} width={'var(--modal-width)'}
        footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      {messageContextHolder}
      <Form form={form} name="courseForm" labelCol={{span: 6}}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="facultyName" label="院系名称" rules={rules.facultyName}>
              <Input.Search placeholder="请选择院系名称" onSearch={findFaculty} readOnly={true} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="teacherName" label="教师姓名" rules={rules.teacherName}>
              <Input.Search placeholder="请选择教师姓名" onSearch={findTeacher} readOnly={true} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="code" label="课程代码" rules={rules.code}>
              <Input maxLength={32} placeholder="请输入课程代码"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="name" label="课程名称" rules={rules.name}>
              <Input maxLength={64} placeholder="请输入课程名称"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="credit" label="学分" rules={rules.credit}>
              <InputNumber min={1} max={10} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={22}>
            <Form.Item name="courseDescription" label="课程描述" labelCol={{span: 3}}>
              <Input.TextArea maxLength={65535} placeholder="请输入课程描述" autoSize={{ minRows: 5, maxRows: 5 }}/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <FacultySelector visible={facultySelectorVisible} onFacultySelected={handleFacultySelected} onCloseFacultySelector={handleCloseFacultySelector} />
      <TeacherSelector visible={teacherSelectorVisible} onTeacherSelected={handleTeacherSelected} onCloseTeacherSelector={handleCloseTeacherSelector} />
    </Modal>
  )
}

export default CourseAdd;
