import React, {useEffect} from "react";
import {Button, Col, Form, Input, Modal, Row, Select} from "antd";
import {Major} from "@/types/resp/major";

interface MajorViewProps {
  visible: boolean;
  viewRow: object;
  onCloseMajorView: () => void;
}

const MajorView: React.FC<MajorViewProps> = ({visible, viewRow, onCloseMajorView}) => {

  const [form] = Form.useForm<Major>();

  const onBack = () => {
    onCloseMajorView()
  };

  useEffect(() => {
    if (!visible) {
      return
    }
    if (viewRow) {
      form.setFieldsValue(viewRow);
    }
  }, [viewRow]);

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onBack}>关闭</Button>
    </div>
  );

  return (
    <Modal title={"专业信息详情"} open={visible} onCancel={onCloseMajorView} width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={form} labelCol={{span: 6}} disabled={true}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="facultyName" label="院系名称">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="name" label="专业名称">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="degreeType" label="学位类型">
              <Select placeholder="请选择学位类型" options={[
                { value: 1, label: <span>学士</span> },
                { value: 2, label: <span>硕士</span> },
                { value: 3, label: <span>博士</span> }
              ]} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="duration" label="学制(年)">
              <Input/>
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
            <Form.Item name="officeLocation" label="办公地点">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={22}>
            <Form.Item name="majorDescription" label="专业简介" labelCol={{span: 3}}>
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

export default MajorView;
