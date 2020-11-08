import React, { useState} from 'react';
import { Section } from '../utils/annotation-sections';
import { Menu, Affix, Layout, Button } from 'antd';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';

const RightAlignedDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 0;
`;

const { Sider } = Layout;

interface SectionsSidebarProps<T>{
  sections: Section<T>[],
  sectionStack: string[]
}

const SectionsSidebar: React.FC<SectionsSidebarProps<HTMLLIElement>>
  =({ sections, sectionStack }) => {
  
  const [ siderCollapsed, setSiderCollapsed ] = useState(false);

  const sectionMenuItems = sections.map(section => {
    const clickHandler = (ref: any) => {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start'
      })
    }
    return (
      <Menu.Item key={section.sectionId} onClick={() => clickHandler(section.ref)}>
        {section.name}
      </Menu.Item>
    )
  });

  if (sectionMenuItems.length === 0) return null;

  return(
  <Affix offsetTop={0}>
    <Sider
      css={{
        overflow: 'auto',
        height: '100vh',
        // position: 'fixed',
        // left: 0,
        marginRight: '10px'
      }}
      theme="light"
      breakpoint="md"
      collapsedWidth="32px"
      trigger={null}
      collapsed={siderCollapsed}
      onCollapse={() => setSiderCollapsed(true)}
    >
      <RightAlignedDiv>
        <Button
          css={{
            marginLeft: 'auto',
            marginRight: 0
          }}
          type="primary"
          icon={siderCollapsed?
            <MenuUnfoldOutlined /> :
            <MenuFoldOutlined />
          }
          onClick={() => setSiderCollapsed(!siderCollapsed)}
        />
      </RightAlignedDiv>
      <Menu theme="light" selectedKeys={[sectionStack.slice(-1)[0]]}>
        {sectionMenuItems}
      </Menu>
    </Sider>
  </Affix>
  )
}

export default SectionsSidebar;