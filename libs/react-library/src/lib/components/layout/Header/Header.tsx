import { useTranslation } from 'react-i18next';
import styles from './Header.module.scss';
import theme from '../../../styles/theme.module.scss';
import { GoIcon } from '../../common/icons/go';
import { Button } from '../../common/button';

interface StringByString {
  [key: string]: string;
}

export const Header = ({
  path,
  onBack,
}: {
  path: string;
  onBack?: () => void;
}) => {
  const { t } = useTranslation(undefined, { useSuspense: false });

  const pathToTitle: StringByString = {
    '/register': t('register'),
    '/login': t('login'),
    '/select-credential': t('selectCredentials'),
    '/view-credential': t('myCredentials'),
    '/ethereum-login': t('ethereumLogin'),
    '/semaphore': t('semaphore'),
  };

  return (
    pathToTitle[path] && (
      <div className={styles.header + ' ' + theme.theme_light}>
        {onBack && <Button icon={GoIcon} onClick={onBack} />}
        <h1>{pathToTitle[path]}</h1>
      </div>
    )
  );
};
