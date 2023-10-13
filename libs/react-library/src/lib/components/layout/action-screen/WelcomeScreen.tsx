import { BackgroundContainer } from '../../common/background';
import { Container, FlexSpace } from '../../common/container';
import { Logo } from '../../common/icons/logo';
import styles from './layout.module.scss';
import { Input } from '../../common/input/Input';
import { GoIcon } from '../../common/icons/go';
import { useState } from 'react';
import { Button } from '../../common/button';
import { validateNationId } from '../../../utils/utils';

export const WelcomeScreen = ({
  nationalId,
  handleRegister,
}: {
  nationalId: string;
  handleRegister: (nationalId: string) => void;
}) => {
  const [idInput, setIdInput] = useState<string>(nationalId);
  const [warning, setWarning] = useState<string>('');

  function handleGo() {
    if (!validateNationId(idInput)) {
      setWarning('Please enter a valid nation ID.');
      return;
    }
    try {
      handleRegister(idInput);
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
              commitValue={setIdInput}
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
