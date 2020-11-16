import React from 'react';
import { Form, Input, Button, Row, Col, Select } from 'antd';

const { TextArea } = Input;

interface AnnotationFormProps {
  form: any,
  initialValues?: any
}

export const AnnotationForm: React.FC<AnnotationFormProps> = ({ form = undefined, initialValues = {} }) => {
  // const onFinish = (values: any) => {
  //   console.log('submitted form');
  //   console.log(values);
  // }

  const colors = ['none', 'yellow', 'blue', 'pink', 'orange'];

  const colorOptions = colors.map(color => {return {label: color, value: color}});
  return ( 
    <Form
      layout="vertical"
      // onFinish={onFinish}
      form={form}
      initialValues={initialValues}
    >
      <Row gutter={[24,0]}>
        <Col span={6}>
          <Form.Item label="Section" name={['location', 'section']}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Chapter" name={['location', 'chapter']}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Page" name={['location', 'page']}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Kindle Location" name={['location', 'kindleLocation']}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      
      <Form.Item label="Highlight" name="highlightText" >
        <TextArea
          placeholder="Higlight Text"
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      </Form.Item>
      <Form.Item name="highlightColor" label="Highlight Color" style={{width: 100}}>
        <Select options={colorOptions}/>
      </Form.Item>
      <Form.Item label="Note" name="noteText">
        <TextArea
          placeholder="Note Text"
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      </Form.Item>
      {/* <Form.Item >
        <Button type="primary" htmlType="submit">
          Submit</Button>
      </Form.Item> */}
    </Form>
  )
}

export default AnnotationForm;