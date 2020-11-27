import React from "react"

import feature from "../images/feature.png";
import importFeature from '../images/import-cloud.png';
import SectionHeader from './section-header';
import { Row, Col } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
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
  margin: auto;
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
  <div css={{ padding: "4rem 1rem", textAlign: "center" }} className='page1'>
    <SectionHeader
      title="Features"
      description="margins.me makes it easy to import, organize, and view your annotations"
    />
    {/* <div
      css={{
        display: "grid",
        alignItems: "center",
        justifyContent: "center",
        width: '75%',
        maxWidth: '700px',
        gridTemplateColumns: "minmax(240px, 1fr) minmax(240px, 1fr)",
        // gridTemplateRows: "repeat(100px)"
      }}
    > */}
      <Row align='middle'>
        <Col sm={24} md={12}>
          <h3>Import</h3>
          <p>
            Email your annotations directly from the Kindle app
          </p>
        </Col>
        <Col sm={24} md={12}>
          <img src={importFeature} alt="a blank card floating over colorful graphics" />
        </Col>
      </Row>
      <Row align='middle'>
        <Col sm={24} md={{order: 2, span: 12}}>
          <h3>Organize</h3>
          <p>
            Tag your annotations, view your publications by author, change highlight color
          </p>
        </Col>
        <Col sm={24} md={{order: 1, span: 12}}>
          {/* <div css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff',
            position: 'relative',
            zIndex: 1,
            borderRadius: '100%',
            boxShadow: `0px 6px 12px ${blue[3]}`,
            width: '100px',
            height: '100px',
            margin: 'auto',
            transition: 'box-shadow .3s ease-out,transform .3s ease-out',
          }}> */}
          <FeatureIcon>
            <CloudUploadOutlined
                css={{
                  fontSize: '50px',
                  color: blue[3]
                }}
              />
          </FeatureIcon>
          {/* </div> */}
        </Col>
      </Row>
      <Row align='middle'>
        <Col sm={24} md={12}>
          <h3>View</h3>
          <p>
            Search for individual annotations, or view them automatically arranged by location metadata
          </p>
        </Col>
        <Col sm={24} md={12}>
          <img src={feature} alt="a blank card floating over colorful graphics" />
        </Col>
      </Row>
    </div>
  // </div>
  );
}

export default Content