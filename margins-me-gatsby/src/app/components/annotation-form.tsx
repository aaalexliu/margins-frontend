import React from 'react';
import { Form, Input, InputNumber, Button, Row, Col, Select } from 'antd';
import { Rule } from 'antd/lib/form';

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

  const textValidator: Rule = ({ getFieldValue }) => ({
    validator(_, __) {
      const highlightText = getFieldValue('highlightText');
      const noteText = getFieldValue('noteText');
      if (!noteText && !highlightText) {
        return Promise.reject('Either Highlight or Note must have text')
      }
      return Promise.resolve();
    },
  });

  return ( 
    <Form
      layout="vertical"
      // onFinish={onFinish}
      form={form}
      initialValues={initialValues}
    >
      <Row gutter={[24,0]}>
        <Col span={6}>
          <Form.Item label="Section" name={['highlightLocation', 'section']}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Chapter" name={['highlightLocation', 'chapter']}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Page" name={['highlightLocation', 'page']}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Kindle Location" name={['highlightLocation', 'kindleLocation']}>
            <InputNumber />
          </Form.Item>
        </Col>
      </Row>
      
      <Form.Item label="Highlight" name="highlightText"
        rules={[textValidator]}
      >
        <TextArea
          placeholder="Higlight Text"
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      </Form.Item>
      <Form.Item name="color" label="Highlight Color" style={{width: 100}}>
        <Select options={colorOptions}/>
      </Form.Item>
      <Form.Item label="Note" name="noteText"
        rules={[textValidator]}
      >
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