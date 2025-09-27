import { LoginForm } from './components/LoginForm';

export const Login = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="login-container" style={{
        width: '100%',
        maxWidth: '1200px',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        display: 'flex',
        minHeight: '600px'
      }}>
        {/* Left Side - Login Form */}
        <div className="login-form" style={{
          flex: '1',
          padding: '0',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <LoginForm />
        </div>

        {/* Right Side - Image (Hidden on mobile) */}
        <div className="login-image" style={{
          flex: '1',
          backgroundImage: 'url("https://i.pinimg.com/1200x/50/e1/0f/50e10f7ecd87a971aa5f6c702158528f.jpg")',          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          
          
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style>
        {`
          @media (max-width: 768px) {
            .login-container {
              flex-direction: column !important;
              max-width: 400px !important;
              min-height: auto !important;
            }
            .login-image {
              display: none !important;
            }
            .login-form {
              padding: 1.5rem !important;
            }
          }
          
          @media (max-width: 480px) {
            .login-container {
              margin: 10px !important;
              border-radius: 16px !important;
            }
          }
        `}
      </style>
    </div>
  );
};