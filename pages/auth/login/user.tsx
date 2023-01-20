import { PureComponent } from "react";
import { connect } from "react-redux";
import FormLogin from "@components/auth/login/user-login-form";
import PageBanner from "../../../components/Common/PageBanner";
import Head from "next/head";
import { login, resetLoginData } from "@redux/auth/actions";
import { ILogin, IUIConfig } from "src/interfaces";
import { FormRegisterPlaceHolder } from "@components/common/layout";
import "../index.less";

interface IProps {
  requesting: boolean;
  success: boolean;
  error: any;
  ui: IUIConfig;
  data: any;
  login: Function;
  resetLoginData: Function;
}

class Login extends PureComponent<IProps> {
  static layout = "auth";

  static authenticate = false;

  rememberMe = false;

  componentWillUnmount() {
    const { resetLoginData: dispatchReset } = this.props;
    dispatchReset();
  }

  submit = (data: ILogin) => {
    const { login: dispatchLogin } = this.props;
    dispatchLogin({
      ...data,
      remember: this.rememberMe,
    });
  };

  render() {
    const { requesting, error, success, ui } = this.props;
    return (
      <>
        <Head>
          <title>User sign-in</title>
        </Head>
        <PageBanner
          pageTitle="Sign In"
          homePageUrl="/"
          homePageText="Home"
          activePageText="Sign In"
          imgClass="bg-1"
        />

        <div className="user-area-all-style log-in-area ptb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="contact-form-action">
                  <FormLogin
                    singularTextModel={ui?.singularTextModel || "Performer"}
                    requesting={requesting}
                    submit={this.submit.bind(this)}
                    onRemember={(value) => {
                      this.rememberMe = value;
                    }}
                    error={error}
                    success={success}
                    googleReCaptchaEnabled={ui.googleReCaptchaEnabled}
                    googleReCaptchaSiteKey={ui.googleReCaptchaSiteKey}
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className="log-in-img"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStates = (state: any) => ({
  ...state.auth.userLogin,
  ui: state.ui,
});
const mapDispatch = { login, resetLoginData };
export default connect(mapStates, mapDispatch)(Login);
