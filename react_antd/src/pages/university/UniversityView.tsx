import React, {useEffect} from "react";
import {Button, Cascader, Col, DatePicker, Form, Input, Modal, Row} from "antd";
import {University} from "@/types/resp/university";
import type {AreaOption} from "@/types/areaOption.ts";
import areas from "@/locales/area.json";

interface UniversityViewProps {
  visible: boolean;
  viewRow: object;
  onCloseUniversityView: () => void;
}

const UniversityView: React.FC<UniversityViewProps> = ({visible, viewRow, onCloseUniversityView}) => {

  const [form] = Form.useForm<University>();

  const provinceCityAreaOptions: AreaOption[] = areas.provinces

  const onBack = () => {
    onCloseUniversityView()
  };

  useEffect(() => {
    if (!visible) {
      return
    }
    if (viewRow) {
      const provinceCityArea2 = []
      if ('province' in viewRow && typeof viewRow.province === 'string') {
        provinceCityArea2.push(viewRow.province)
      }
      if ('city' in viewRow && typeof viewRow.city === 'string') {
        provinceCityArea2.push(viewRow.city)
      }
      if ('area' in viewRow && typeof viewRow.area === 'string') {
        provinceCityArea2.push(viewRow.area)
      }
      form.setFieldsValue({...viewRow, provinceCityArea: provinceCityArea2});
    }
  }, [viewRow]);

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onBack}>关闭</Button>
    </div>
  );

  return (
    <Modal title={"学校信息详情"} open={visible} onCancel={onCloseUniversityView} width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={form} labelCol={{span: 6}} disabled={true}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="name" label="学校名称">
              <Input/>
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
            <Form.Item name="contactPhone" label="联系电话">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="email" label="邮箱">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="provinceCityArea" label="省/市/区">
              <Cascader options={provinceCityAreaOptions} fieldNames={{ label: "name", value: "code" }} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="location" label="地址">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={22}>
            <Form.Item name="universityDescription" label="学校简介" labelCol={{span: 3}}>
              <Input.TextArea autoSize={{ minRows: 5, maxRows: 5 }}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="createTime" label="创建时间">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="modifyTime" label="最后修改时间">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default UniversityView;
