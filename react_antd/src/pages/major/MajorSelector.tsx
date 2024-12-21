import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Select, Table, TableProps} from 'antd';
import type {Major} from "@/types/resp/major";
import majorApi from '@/api/majorApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import FacultySelector from "@/pages/faculty/FacultySelector.tsx";


interface MajorSelectorProps {
  visible: boolean;
  onMajorSelected: (selectedMajor: { majorId?: number;majorName?: string; }) => void;
  onCloseMajorSelector: () => void;
}

const MajorSelector: React.FC<MajorSelectorProps> = ({visible, onMajorSelected, onCloseMajorSelector}) => {

  const [majorSelectorForm] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    majorSelectorForm.resetFields();
  };

  const [data, setData] = useState<Major[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<Major>> = await majorApi.find(majorSelectorForm.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<Major> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<Major>['columns'] = [
    {title: '院系名称', dataIndex: 'facultyName', key: 'facultyName'},
    {title: '专业名称', dataIndex: 'name', key: 'name'},
    {title: '学位类型', key: 'degreeType', render: (_, record) => (
        <span>
        {(function () {
          if (record.degreeType === 1) return '学士';
          else if (record.degreeType === 2) return '硕士';
          else if (record.degreeType === 3) return '博士';
          else return '未知';
        })()}
      </span>
      ),
    },
    {title: '学制(年)', dataIndex: 'duration', key: 'duration'},
    {title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone'},
    {title: '邮箱', dataIndex: 'email', key: 'email'},
    {title: '办公地点', dataIndex: 'officeLocation', key: 'officeLocation'},
    {title: '专业简介', dataIndex: 'majorDescription', key: 'majorDescription', ellipsis: true},
  ];

  const handleRowDoubleClick = (row: Major) => {
    onMajorSelected({
      majorId: row.id,
      majorName: row.name,
    })
  };

  const selectorFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onCloseMajorSelector}>关闭</Button>
    </div>
  );

  useEffect(() => {
    if (visible) {
      onSearch();
    }
  }, [visible]);

  const [facultySelectorVisible, setFacultySelectorVisible] = useState(false);
  const findFaculty = () => {
    setFacultySelectorVisible(true);
  }
  const handleFacultySelected = (selectedFaculty: { facultyId?: number; facultyName?: string; }) => {
    setFacultySelectorVisible(false)
    if (selectedFaculty && 'facultyId' in selectedFaculty) {
      majorSelectorForm.setFieldsValue(Object.assign(majorSelectorForm.getFieldsValue(), {
      facultyId: selectedFaculty['facultyId'],
      facultyName: selectedFaculty['facultyName'],
      }));
    }
  };
  const handleCloseFacultySelector = () => {
    setFacultySelectorVisible(false)
  };

  return (
    <Modal title={"专业信息选择器(双击行选中)"} open={visible} onCancel={onCloseMajorSelector} width={'var(--modal-width)'} footer={selectorFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={majorSelectorForm} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="facultyName" label="院系名称">
          <Input.Search placeholder="请选择院系名称" onSearch={findFaculty} readOnly={true} />
        </Form.Item>
        <Form.Item name="name" label="专业名称">
          <Input maxLength={64} placeholder="请输入专业名称"/>
        </Form.Item>
        <Form.Item name="degreeType" label="学位类型">
          <Select placeholder="请选择学位类型" options={[
            { value: 1, label: <span>学士</span> },
            { value: 2, label: <span>硕士</span> },
            { value: 3, label: <span>博士</span> }
          ]} style={{width: 'var(--select-width)'}} />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">查询</Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button onClick={onReset}>重置</Button>
        </Form.Item>
      </Form>
      <Table<Major> columns={columns} dataSource={data} size="small" rowKey={record => record.id}
                         pagination={{ position: ["bottomCenter"] }}
                         onRow={(row) => ({
                           onDoubleClick: (event) => {
                             event.preventDefault();
                             handleRowDoubleClick(row);
                           },
                         })}/>
      <FacultySelector visible={facultySelectorVisible} onFacultySelected={handleFacultySelected} onCloseFacultySelector={handleCloseFacultySelector} />
    </Modal>
  );
};

export default MajorSelector;
