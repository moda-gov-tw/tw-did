import { BackgroundContainer } from '../../common/background';
import { Container, FlexSpace } from '../../common/container';
import { Logo } from '../../common/icons/logo';
import styles from './layout.module.scss';
import theme from '../../../styles/theme.module.scss';
import { Input } from '../../common/input';
import { GoIcon } from '../../common/icons/go';
import { useState } from 'react';
import { Button } from '../../common/button';

export const WelcomeScreen = ({
  nationalId,
  handleRegister,
  handleLogin,
}: {
  nationalId: string;
  handleRegister: (nationalId: string) => void;
  handleLogin: (nationalId: string) => void;
}) => {
  const [IDinput, setIDinput] = useState<string>(nationalId);
  const [warning, setWarning] = useState<string>('');
  const [action, setAction] = useState<'Register' | 'Login'>('Register');

  const errorDialog = {
    title: 'Error',
    children: 'Please enter a valid nation ID.',
    actions: [
      {
        text: 'OK',
        onClick: () => { },
      },
    ],
  };

  function validateNationID(nationID: string) {
    let regex = /^[A-Z]{1}[1-2]{1}[0-9]{8}$/;
    return regex.test(nationID);
  }

  function handleGo() {
    // query the nation ID
    if (!validateNationID(IDinput)) {
      setWarning('Please enter a valid nation ID.');
      return;
    }
    try {
      if (action === 'Login')
        handleLogin(IDinput);
      else
        handleRegister(IDinput);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <BackgroundContainer>
      <Container>
        <div className={styles.ActionScreen}>
          <FlexSpace />
          <div className={styles.Center}>
            <Logo />
          </div>

          <div>
            <h1 className={styles.textLarge}>Welcome!</h1>
            <p className={styles.Instructions}>
              {action == 'Register'
                ? <span>Have an account? <Button type='link' onClick={() => setAction('Login')} text='Login here.' /></span>
                : <span>Do not have an account?<Button type='link' onClick={() => setAction('Register')} text='Register here' /></span>}
            </p>
            <Input
              placeholder="Nation ID"
              commitValue={setIDinput}
              initialValue={nationalId}
            />
            <Button type="primary" onClick={handleGo} icon={GoIcon} text={action} />
            {<p className={styles.warning}>{warning}</p>}
          </div>
        </div>
      </Container>
    </BackgroundContainer>
  );
};
