import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [idInput, setIdInput] = useState<string>(nationalId);
  const [warning, setWarning] = useState<string>('');

  async function handleGo() {
    if (!validateNationId(idInput)) {
      setWarning(t('enterValidNationalId'));
      return;
    }
    try {
      await handleRegister(idInput);
    } catch (e) {
      setWarning(t('noFido'))
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
            <h1 className={styles.textLarge}>{t('welcome')}</h1>
            <p className={styles.Instructions}>{t('enterNationalIdToStart')}</p>
            <Input
              placeholder={t('nationalId')}
              commitValue={setIdInput}
              initialValue={nationalId}
            />
            <Button
              type="primary"
              onClick={handleGo}
              icon={GoIcon}
              text={t('go')}
            />
            {<p className={styles.warning}>{warning}</p>}
          </div>
        </div>
      </Container>
    </BackgroundContainer>
  );
};
