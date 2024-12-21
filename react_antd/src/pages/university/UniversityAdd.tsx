import React, {useEffect, useState} from "react";
import {Button, Cascader, CascaderProps, Col, DatePicker, Form, Input, message, Modal, Row} from "antd";
import type {Result} from "@/types/result";
import type {AreaOption} from "@/types/areaOption";
import areas from "@/locales/area.json"
import universityApi from "@/api/universityApi.ts";
import {University} from "@/types/resp/university";

interface UniversityAddProps {
  visible: boolean;
  id: number;
  onCloseUniversityAdd: () => void;
}

const UniversityAdd: React.FC<UniversityAddProps> = ({visible, id, onCloseUniversityAdd}) => {

  const [form] = Form.useForm<University>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    name: [
      { required: true, message: '请输入学校名称' }
    ],
    contactPhone: [
      { required: true, message: '请输入联系电话' }
    ],
    email: [
      { required: true, message: '请输入邮箱' }
    ],
    location: [
      { required: true, message: '请输入地址' }
    ],
  };

  let universityForm: Partial<University> = {}

  const [title, setTitle] = useState('新增学校信息');

  const provinceCityAreaOptions: AreaOption[] = areas.provinces

  useEffect(() => {
    if (!visible) {
      return
    }
    if (id) {
      setTitle('编辑学校信息')
      initUniversityFormById(id)
    } else {
      setTitle('新增学校信息')
      form.resetFields();
    }
  }, [visible]);

  const initUniversityFormById = async (id: number) => {
    const resp: Result<University> = await universityApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      universityForm = resp.data
      const provinceCityArea2 = []
      if (universityForm.province) {
        provinceCityArea2.push(universityForm.province)
      }
      if (universityForm.city) {
        provinceCityArea2.push(universityForm.city)
      }
      if (universityForm.area) {
        provinceCityArea2.push(universityForm.area)
      }
      form.setFieldsValue({...universityForm, provinceCityArea: provinceCityArea2});
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let university2Save:University = form.getFieldsValue()
      if (id) {
        university2Save = Object.assign(universityForm, university2Save)
      }
      const resp: Result<void> = await universityApi.save(university2Save);
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
    setTitle('新增学校信息')
    form.resetFields();
  };

  const onBack = () => {
    onCloseUniversityAdd()
  };

  const onAreaChange: CascaderProps<AreaOption>['onChange'] = (value) => {
    if (value && value.length > 0 && typeof value[0] === 'string') {
      universityForm.province = value[0]
    }
    if (value && value.length > 1 && typeof value[1] === 'string') {
      universityForm.city = value[1]
    }
    if (value && value.length > 2 && typeof value[2] === 'string') {
      universityForm.area = value[2]
    }
  };

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onSave}>保存</Button>
      <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>关闭</Button>
    </div>
  );

  return (
    <Modal title={title} open={visible} onCancel={onCloseUniversityAdd} width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      {messageContextHolder}
      <Form form={form} name="universityForm" labelCol={{span: 6}}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="name" label="学校名称" rules={rules.name}>
              <Input maxLength={64} placeholder="请输入学校名称"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="establishmentDate" label="成立日期">
              <DatePicker/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="contactPhone" label="联系电话" rules={rules.contactPhone}>
              <Input maxLength={64} placeholder="请输入联系电话"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="email" label="邮箱" rules={rules.email}>
              <Input maxLength={64} placeholder="请输入邮箱"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="provinceCityArea" label="省/市/区">
              <Cascader options={provinceCityAreaOptions} fieldNames={{ label: "name", value: "code" }} onChange={onAreaChange} placeholder="请选择省/市/区" />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="location" label="地址" rules={rules.location}>
              <Input maxLength={255} placeholder="请输入地址"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={22}>
            <Form.Item name="universityDescription" label="学校简介" labelCol={{span: 3}}>
              <Input.TextArea maxLength={65535} placeholder="请输入学校简介" autoSize={{ minRows: 5, maxRows: 5 }}/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default UniversityAdd;
