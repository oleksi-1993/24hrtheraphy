import {
  Form, Input, Button, Divider, message
} from 'antd';
import React, { PureComponent } from 'react';
import { postService } from '@services/post.service';
import Head from 'next/head';
import { FormRegisterPlaceHolder } from '@components/common/layout';
import { connect } from 'react-redux';
import PageBanner from '../../src/components/homepage/PageBanner';
import { IUIConfig } from 'src/interfaces';
import './index.less';
import { getResponseError } from '@lib/utils';

interface IProps {
  ui: IUIConfig;
}
interface IStates {
  loading: boolean;
}

class ContactPage extends PureComponent<IProps, IStates> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: false
    };
  }

  async onFinish(data) {
    try {
      this.setState({ loading: true });
      await postService.createContactCotent(data);
      message.success('Email have been sent to a admin');
    } catch (e) {
      const error = await Promise.resolve(e);
      message.error(getResponseError(error));
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { ui } = this.props;
    const { loading } = this.state;
    return (
      <>
        <Head>
          <title>Contact Us</title>
        </Head>
        <PageBanner
          pageTitle="Contact Us"
          homePageUrl="/"
          homePageText="Home"
          activePageText="Contact Us"
          imgClass="bg-1"
        />
        <div className="user-area-all-style log-in-area ptb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="contact-form-action">
                <Form onFinish={this.onFinish.bind(this)}>
              <span className="form-contact-title">Contact</span>
              <br />
              <span>
                Please fill out all the info beside and we will get back to you
                with-in 48hrs.
              </span>
              <Divider />
              <Form.Item name="subject">
                <Input placeholder="Subject" />
              </Form.Item>
              <Form.Item name="name">
                <Input placeholder="Your valid name" />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  { type: 'email', message: 'The input is not valid E-mail!' },
                  { required: true, message: 'Please input your email!' }
                ]}
              >
                <Input placeholder="Your valid email" />
              </Form.Item>
              <Form.Item name="message">
                <Input.TextArea placeholder="Your message" rows={3} />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType="submit"
                  type="primary"
                  loading={loading}
                  disabled={loading}
                  block
                >
                  Send
                </Button>
              </Form.Item>
            </Form>
                </div>
              </div>

              <div className="col-lg-6">
              <FormRegisterPlaceHolder ui={ui} />
              </div>
            </div>
          </div>
        </div>
       
      </>
    );
  }
}

const mapStateToProps = (state) => ({ ui: state.ui });
export default connect(mapStateToProps)(ContactPage);
