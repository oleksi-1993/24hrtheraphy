import { createRef, useState } from 'react';
import Link from 'next/link';
import { ILogin } from 'src/interfaces';
import {
  Form, Input, Button, Space, Checkbox, Alert, message
} from 'antd';
import { getResponseError } from '@lib/utils';
import { connect } from 'react-redux';
import { updateUIValue } from 'src/redux/ui/actions';
import { utilsService } from '@services/index';
import { ReCAPTCHA } from 'react-google-recaptcha';
import Recaptcha from 'src/components/common/recaptcha';
import FormFooterLogin from './footer-login-form';

interface IProps {
  requesting: boolean;
  submit(data: ILogin): Function;
  error: any;
  success: boolean;
  onRemember: Function;
  singularTextModel: string;
  googleReCaptchaEnabled?: boolean;
  googleReCaptchaSiteKey?: string;
}

const FormItem = Form.Item;

const LoginForm = ({
  requesting,
  submit,
  error,
  success,
  onRemember,
  singularTextModel,
  googleReCaptchaEnabled,
  googleReCaptchaSiteKey
}: IProps) => {
  const reCAPTCHARef = createRef<ReCAPTCHA>();
  const [reCAPTCHAError, setreCAPTCHAError] = useState('');
  const [form] = Form.useForm();
  const onPressEnter = () => {
    form.submit();
  };

  const onFinish = async (data: ILogin) => {
    try {
      if (googleReCaptchaEnabled) {
        const token = reCAPTCHARef.current.getValue();
        // const token = await reCAPTCHARef.current.executeAsync();
        if (!token) {
          setreCAPTCHAError('Please verify that you are not a robot.');
          return;
        }

        reCAPTCHARef.current.reset();
        setreCAPTCHAError('');
        await utilsService.verifyRecaptcha(token);
      }

      submit(data);
    } catch (e) {
      if (googleReCaptchaEnabled && reCAPTCHARef.current.getValue()) {
        reCAPTCHARef.current.reset();
      }

      const err = await Promise.resolve(e);
      message.error(getResponseError(err));
    }
  };

  return (

    <Form layout="vertical" onFinish={onFinish}>
      <h1>User Sign-in</h1>
      <FormItem
        hasFeedback
        label="Email"
        name="email"
        rules={[
          { type: 'email', message: 'The input is not valid E-mail!' },
          { required: true, message: 'Please input your email!' }
        ]}
      >
        <Input
          size="large"
          onPressEnter={onPressEnter}
          placeholder="youremail@example.com"
        />
      </FormItem>
      <FormItem
        hasFeedback
        label={(
          <Space>
            <span>Password</span>
          </Space>
        )}
        className="input-password"
        name="password"
        rules={[
          { required: true, message: 'Please input your password!' },
          {
            min: 6,
            max: 14,
            message: '6-14 characters'
          }
        ]}
      >
        <Input.Password
          size="large"
          onPressEnter={onPressEnter}
          placeholder="Password"
        />
      </FormItem>
      <FormItem>
        <Recaptcha
          ref={reCAPTCHARef}
          googleReCaptchaEnabled={googleReCaptchaEnabled}
          googleReCaptchaSiteKey={googleReCaptchaSiteKey}
          error={reCAPTCHAError}
        />
      </FormItem>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '15px 0'
        }}
      >
        <Checkbox onChange={(e) => onRemember(e.target.checked)}>
          Remember me
        </Checkbox>
        <Link href="/auth/forgot-password">
          <a>Forgot password?</a>
        </Link>
      </div>
      {(error || success) && (
        <FormItem>
          {error && (
            <Alert
              message="Error"
              description={
                error.message && error.message === 'ACCOUNT_INACTIVE'
                  ? 'You do not have permission'
                  : getResponseError(error)
              }
              type="error"
              showIcon
            />
          )}
          {success && (
            <Alert
              message="Login success"
              type="success"
              description="Redirecting..."
            />
          )}
        </FormItem>
      )}
      <FormItem className="row-button-auth">
        <Button
          type="primary"
          htmlType="submit"
          disabled={requesting}
          loading={requesting}
          style={{
            display: 'table',
            justifyContent: 'space-between',
            margin: '0 auto 0',
            padding: '10px 40px',
            height: '100%'
          }}
        >
          Sign-in
        </Button>
      </FormItem>
      <FormFooterLogin account="user" singularTextModel={singularTextModel} />
    </Form>
  );
};
const mapStates = (state: any) => ({
  ...state.ui
});
const mapDispatch = { updateUIValue };
LoginForm.defaultProps = {
  googleReCaptchaEnabled: false,
  googleReCaptchaSiteKey: ''
};
export default connect(mapStates, mapDispatch)(LoginForm);
