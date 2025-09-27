import { LoginForm } from './components/LoginForm';

export const Login = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Login Form */}
        <div className="login-form">
          <LoginForm />
        </div>

        {/* Right Side - Image (Hidden on mobile) */}
        <div className="login-image">
          
        </div>
      </div>

      <style>
        {`
          .login-page {
            width: 100%;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .login-container {
            width: 100%;
            background: white;
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            display: flex;
          }
          
          .login-form {
            flex: 1;
            padding: 0;
            display: flex;
            flex-direction: column;
          }
          
          .login-image {
            flex: 1;
            background-image: url("https://i.pinimg.com/1200x/50/e1/0f/50e10f7ecd87a971aa5f6c702158528f.jpg");
            background-size: cover;
            background-position: center;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
         
          
          @media (max-width: 1024px) {
            .login-container {
            }
          }
          
          @media (max-width: 768px) {
            .login-container {
              flex-direction: column;
              max-width: 100%;
              width: 100%;
              min-height: auto;
              margin: 0;
              border-radius: 20px;
            }
            .login-image {
              display: none;
            }
            .login-form {
              padding: 0;
              width: 100%;
            }
          }
          
          @media (max-width: 480px) {
            .login-container {
              border-radius: 16px;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            }
          }
          
          @media (max-width: 320px) {
            .login-container {
              border-radius: 12px;
            }
          }
        `}
      </style>
    </div>
  );
};