import React from "react"

import feature from "../images/feature.png";
import importFeature from '../images/import-cloud.png';
import SectionHeader from './section-header';
import { Row, Col } from 'antd';
import {
  CloudUploadOutlined,
  RocketOutlined,
  FileSearchOutlined
} from '@ant-design/icons';
// import KindleIcon from '../images/icon-amazon-kindle.inline.svg';
import { blue } from "@ant-design/colors";
import styled from '@emotion/styled';

const FeatureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  position: relative;
  z-index: 1;
  border-radius: 100%;
  box-shadow: 0px 6px 12px #69c0ff;
  width: 100px;
  height: 100px;
  margin: 50px auto;
  transition: box-shadow .3s ease-out,transform .3s ease-out;
`;

const Content = () => {

  // const pointChild = [
  //   'point-ring left', 'point-ring point-ring-0 right',
  //   'point-0', 'point-2', 'point-1', 'point-3', 'point-2',
  // ].map((className, ii) => (
  //   <i
  //     className={className}
  //     key={ii.toString()}
  //     style={{
  //       background: blue[3],
  //       borderColor: blue[3],
  //     }}
  //   />
  // ));

  return (
  <div 
    css={{
      padding: "4rem 1rem",
      textAlign: "center",
      width: '75%',
      maxWidth: '700px',
      margin: 'auto'
    }}
    className='page1'
  >
    <SectionHeader
      title="Features"
      description="Make collecting and retrieving your notes effortless"
    />
      <Row align='middle'>
        <Col sm={24} md={12}>
          <h3>Import</h3>
          <p>
            Email your annotations straight from the Kindle app, and automatically tag your annotations with inline #️⃣ tags. #nice
          </p>
        </Col>
        <Col sm={24} md={12}>
          <FeatureIcon>
            <CloudUploadOutlined
                css={{
                  fontSize: '50px',
                  color: blue[3]
                }}
              />
            </FeatureIcon>
        </Col>
      </Row>
      <Row align='middle'
      >
        <Col sm={24} md={{order: 2, span: 12}}>
          <h3>Organize</h3>
          <p>
            Tag your annotations, view your publications by author, change highlight color, and more 🌟.
          </p>
        </Col>
        <Col sm={24} md={{order: 1, span: 12}}>
          <FeatureIcon>
            <RocketOutlined
                css={{
                  fontSize: '50px',
                  color: blue[3],
                }}
                rotate={30}
              />
          </FeatureIcon>
        </Col>
      </Row>
      <Row align='middle'>
        <Col sm={24} md={12}>
          <h3>View</h3>
          <p>
            Search 🔍 for individual annotations, or view them automatically arranged by location metadata
          </p>
        </Col>
        <Col sm={24} md={12}>
          <FeatureIcon>
            <FileSearchOutlined
                css={{
                  fontSize: '50px',
                  color: blue[3]
                }}
              />
            </FeatureIcon>
        </Col>
      </Row>
    </div>
  );
}

export default Content