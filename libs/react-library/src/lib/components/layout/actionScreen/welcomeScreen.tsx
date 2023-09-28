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
}: {
  nationalId: string;
  handleRegister: (nationalId: string) => void;
}) => {
  const [IDinput, setIDinput] = useState<string>(nationalId);
  const [warning, setWarning] = useState<string>('');

  const errorDialog = {
    title: 'Error',
    children: 'Please enter a valid nation ID.',
    actions: [
      {
        text: 'OK',
        onClick: () => {},
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
              Please enter your nation ID to get started.
            </p>
            <Input
              placeholder="Nation ID"
              commitValue={setIDinput}
              initialValue={nationalId}
            />
            <Button type="primary" onClick={handleGo} icon={GoIcon} text="Go" />
            {<p className={styles.warning}>{warning}</p>}
          </div>
        </div>
      </Container>
    </BackgroundContainer>
  );
};
