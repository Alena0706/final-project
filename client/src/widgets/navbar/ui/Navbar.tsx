import React from 'react';
import { Layout, Menu, theme } from 'antd';

const { Header } = Layout;

const App: React.FC = () => {
  const { token } = theme.useToken();

  const customToken = {
    ...token,
    colorPrimary: '#000000',
  };
  console.log(customToken);

  return (
    <Layout>
      <Header
        style={{
          position: 'fixed',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: 0,
          margin: 0,
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ flex: 1, minWidth: 0, display: 'flex'}}
        >
          <Menu.Item key="home">Главная</Menu.Item>
          <Menu.Item key="news">Новости</Menu.Item>
          <Menu.Item key="franchise">Франшиза</Menu.Item>
          <Menu.Item key="contacts">Контакты</Menu.Item>
        </Menu>
        <Menu theme="dark" mode="horizontal" style={{flex: 2, justifyContent: 'flex-end'}}>
          <Menu.Item key="signin">Вход</Menu.Item>
          <Menu.Item key="signup">Регистрация</Menu.Item>
        </Menu>
      </Header>
    </Layout>
  );
};

export default App;
