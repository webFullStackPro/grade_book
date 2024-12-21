import React, {useEffect, useState} from "react";
import {Button, Cascader, CascaderProps, Col, DatePicker, Form, Input, InputNumber, message, Row, Select} from "antd";
import type {Result} from "@/types/result";
import studentApi from "@/api/studentApi.ts";
import {Student} from "@/types/resp/student";
import MajorSelector from "@/pages/major/MajorSelector.tsx";
import type {AreaOption} from "@/types/areaOption.ts";
import areas from "@/locales/area.json";

const StudentAdd: React.FC = () => {

  const [form] = Form.useForm<Student>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    studentNumber: [
      { required: true, message: '请输入学号' }
    ],
    name: [
      { required: true, message: '请输入姓名' }
    ],
    password: [
      { required: true, message: '请输入密码' }
    ],
    gender: [
      { required: true, message: '请输入性别' }
    ],
    birthDate: [
      { required: true, message: '请输入出生日期' }
    ],
    majorName: [
      { required: true, message: '请输入专业名称' }
    ],
    grade: [
      { required: true, message: '请输入年级' }
    ],
    contactPhone: [
      { required: true, message: '请输入联系电话' }
    ],
    email: [
      { required: true, message: '请输入邮箱' }
    ],
  };

  let studentForm: Partial<Student> = {}

  const provinceCityAreaOptions: AreaOption[] = areas.provinces

  useEffect(() => {
    initStudentFormById(1)
  }, []);

  const initStudentFormById = async (id: number) => {
    const resp: Result<Student> = await studentApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      studentForm = resp.data
      const provinceCityArea2 = []
      if (studentForm.province) {
        provinceCityArea2.push(studentForm.province)
      }
      if (studentForm.city) {
        provinceCityArea2.push(studentForm.city)
      }
      if (studentForm.area) {
        provinceCityArea2.push(studentForm.area)
      }
      form.setFieldsValue({...studentForm, provinceCityArea: provinceCityArea2});
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let student2Save:Student = form.getFieldsValue()
      student2Save = Object.assign(studentForm, student2Save)
      const resp: Result<void> = await studentApi.save(student2Save);
      if (!resp || resp.code !== 1) {
        messageApi.error('保存失败:' + (resp.msg ? resp.msg : '未知异常'));
        return
      }
      messageApi.success('保存成功');
    } catch (error) {
      console.error('There was an error submitting the form!', error);
    }
  };

  const onReset = () => {
    form.resetFields();
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

  const onAreaChange: CascaderProps<AreaOption>['onChange'] = (value) => {
    if (value && value.length > 0 && typeof value[0] === 'string') {
      studentForm.province = value[0]
    }
    if (value && value.length > 1 && typeof value[1] === 'string') {
      studentForm.city = value[1]
    }
    if (value && value.length > 2 && typeof value[2] === 'string') {
      studentForm.area = value[2]
    }
  };

  return (
    <div>
      {messageContextHolder}
      <Form form={form} name="studentForm" labelCol={{span: 6}}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="studentNumber" label="学号" rules={rules.studentNumber}>
              <Input maxLength={20} placeholder="请输入学号"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="name" label="姓名" rules={rules.name}>
              <Input maxLength={64} placeholder="请输入姓名"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="password" label="密码" rules={rules.password}>
              <Input maxLength={255} placeholder="请输入密码"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="gender" label="性别" rules={rules.gender}>
              <Select placeholder="请选择性别" options={[
                {value: 1, label: <span>男</span>},
                {value: 2, label: <span>女</span>}
              ]}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="birthDate" label="出生日期" rules={rules.birthDate}>
              <DatePicker/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="majorName" label="专业名称" rules={rules.majorName}>
              <Input.Search placeholder="请选择专业名称" onSearch={findMajor} readOnly={true}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="grade" label="年级" rules={rules.grade}>
              <InputNumber min={2000} max={2100}/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="contactPhone" label="联系电话" rules={rules.contactPhone}>
              <Input maxLength={64} placeholder="请输入联系电话"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="email" label="邮箱" rules={rules.email}>
              <Input maxLength={64} placeholder="请输入邮箱"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="provinceCityArea" label="省/市/区">
              <Cascader options={provinceCityAreaOptions} fieldNames={{ label: "name", value: "code" }} onChange={onAreaChange} placeholder="请选择省/市/区" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="address" label="家庭地址">
              <Input maxLength={255} placeholder="请输入家庭地址"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="enrollmentDate" label="入学日期">
              <DatePicker/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="graduationDate" label="毕业日期">
              <DatePicker/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className='custom-footer'>
        <Button type="primary" onClick={onSave}>保存</Button>
        <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      </div>
      <MajorSelector visible={majorSelectorVisible} onMajorSelected={handleMajorSelected}
                     onCloseMajorSelector={handleCloseMajorSelector}/>
    </div>
  )
}

export default StudentAdd;
