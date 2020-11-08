import React from 'react';
import { Section } from '../utils/annotation-sections';
import { Menu, Affix, Layout } from 'antd';

const { Sider } = Layout;

interface SectionsSidebarProps<T>{
  sections: Section<T>[],
  sectionStack: string[]
}

const SectionsSidebar: React.FC<SectionsSidebarProps<HTMLLIElement>>
  =({ sections, sectionStack }) => {

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
      style={{
        overflow: 'auto',
        height: '100vh',
        // position: 'fixed',
        // left: 0,
      }}
      theme="light"
    >
      <Menu theme="light" selectedKeys={[sectionStack.slice(-1)[0]]}>
        {sectionMenuItems}
      </Menu>
    </Sider>
  </Affix>
  )
}

export default SectionsSidebar;