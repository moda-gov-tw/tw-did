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
import { Dialog, DialogProps, useDialog } from '../../common/dialog';
import { useEffect } from 'react';

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
  
  const dialogController = useDialog();
  const noMetamaskDialog: DialogProps = {
    title: t('noMetamask'),
    children: t('openInMetamask'),
    actions: [
      {
        text: t('ok'),
        onClick: () => {
          dialogController.close();
        },
        type: 'primary',
      },
    ],
  };

  useEffect(() => {
    if (!window.ethereum) {
      dialogController.open(noMetamaskDialog);
    }
  }, []);


  return (
    <BackgroundContainer>
      <Container>
        <div className={styles.ActionScreen}>
          {dialogController.props && <Dialog {...dialogController.props}/>}
          <FlexSpace />
          <div className={styles.Center}>
            <Logo />
          </div>

          <div>
            <h1 className={styles.textLarge}>{t('welcome')}</h1>
            <p className={styles.Instructions}><span>
              {t('enterNationalIdToStart')}
              <br/>
              <small>{t('nationalIDExplanation')}</small>
            </span></p>
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
