import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Table, TableProps} from 'antd';
import type {University} from "@/types/resp/university";
import universityApi from '@/api/universityApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";


interface UniversitySelectorProps {
  visible: boolean;
  onUniversitySelected: (selectedUniversity: { universityId?: number; universityName?: string }) => void;
  onCloseUniversitySelector: () => void;
}

const UniversitySelector: React.FC<UniversitySelectorProps> = ({visible, onUniversitySelected, onCloseUniversitySelector}) => {

  const [universitySelectorForm] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    universitySelectorForm.resetFields();
  };

  const [data, setData] = useState<University[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<University>> = await universityApi.find(universitySelectorForm.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<University> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<University>['columns'] = [
    {title: '学校名称', dataIndex: 'name', key: 'name'},
    {title: '成立日期', key: 'establishmentDate', render: (_, record) => (
        <div>{record.establishmentDate.format('YYYY-MM-DD')}</div>
      )},
    {title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone'},
    {title: '邮箱', dataIndex: 'email', key: 'email'},
    {title: '省', dataIndex: 'provinceName', key: 'province'},
    {title: '市', dataIndex: 'cityName', key: 'city'},
    {title: '区', dataIndex: 'areaName', key: 'area'},
    {title: '地址', dataIndex: 'location', key: 'location'},
    {title: '学校简介', dataIndex: 'universityDescription', key: 'universityDescription', ellipsis: true}
  ];

// 行双击事件处理器
  const handleRowDoubleClick = (row: University) => {
    onUniversitySelected({
      universityId: row.id,
      universityName: row.name,
    })
  };

  const selectorFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onCloseUniversitySelector}>关闭</Button>
    </div>
  );

  useEffect(() => {
    if (visible) {
      onSearch();
    }
  }, [visible]);

  return (
    <Modal title={"学校信息选择器(双击行选中)"} open={visible} onCancel={onCloseUniversitySelector} width={'var(--modal-width)'} footer={selectorFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={universitySelectorForm} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="name" label="学校名称">
          <Input maxLength={64} placeholder="请输入学校名称"/>
        </Form.Item>
        <Form.Item name="location" label="地址">
          <Input maxLength={255} placeholder="请输入地址"/>
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">查询</Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button onClick={onReset}>重置</Button>
        </Form.Item>
      </Form>
      <Table<University> columns={columns} dataSource={data} size="small" rowKey={record => record.id}
                         pagination={{ position: ["bottomCenter"] }}
                         onRow={(row) => ({
                           onDoubleClick: (event) => {
                             event.preventDefault();
                             handleRowDoubleClick(row);
                           },
                         })}/>
    </Modal>
  );
};

export default UniversitySelector;
