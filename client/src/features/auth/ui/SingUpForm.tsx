import React, { useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input, Upload } from 'antd';
import { registerUser, uploadAvatar } from '@/entities/auth/model/thunks';
import { useAppDispatch } from '@/shared/hooks/hooks';

export default function SingUpForm(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//  const [file, setFile] = useState<any[]>([]);

  type FieldType = {
    email: string;
    password: string;
    name: string;
    passwordValid?: string;
    phone?: string;
    city?: string;
    avatar?: string;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    delete values.passwordValid;
    delete values.avatar;
    const formData = new FormData();
    if (selectedFile) {
      formData.append('avatar', selectedFile);
      void dispatch(uploadAvatar(formData));
    }

    void dispatch(registerUser(values));

    console.log(values);
  };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true, phone: '+7-' }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Пожалуйста введите актуальный email', type: 'email' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Имя"
        name="name"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Пароль"
        name="password"
        rules={[{ required: true, message: 'Пароль должен быть не менее 6 символов' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item<FieldType>
        label="Подтверждение пароля"
        name="passwordValid"
        rules={[
          { required: true, message: 'Please confirm your password!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Пароли не совпадают!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item<FieldType>
        label="Город"
        name="city"
        rules={[{ message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Телефон"
        name="phone"
        rules={[
          { required: true, message: 'Пожалуйста введите номер телефона!' },
          // {
          //   pattern: /^\+7-\d{3}-\d{3}-\d{2}-\d{2}$/,
          //   message: 'Неверный формат номера телефона. Пример: +7-123-456-78-90',
          // },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Аватар"
        name="avatar"
        valuePropName="fileList"
        extra="Выберите файлы формата jpg, png"
      >
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png" // Ограничиваем типы файлов
          onChange={handleFileChange}
          className="file-input"
        />
        {/* <Upload
          maxCount={1}
          beforeUpload={(files) => {
            setFile([files]);
            return false; // чтобы не загружать автоматически
          }}
          onRemove={() => setFile([])}
          fileList={file}
          accept="image/jpeg,image/jpg,image/png"
        >
          <Button>Выбрать файл</Button>
        </Upload> */}
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
