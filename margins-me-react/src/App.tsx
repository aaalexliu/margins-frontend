import React, { FC } from 'react';
import {
  Button,
  Menu,
} from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';


const App: FC = () => (
  <div className="App">
    <Menu mode="horizontal">
      <Menu.Item>
        Sign Up
      </Menu.Item>
      <Menu.Item>
        Login
      </Menu.Item>
    </Menu>
    <Button type="primary">Button</Button>
  </div>
);

export default App;
