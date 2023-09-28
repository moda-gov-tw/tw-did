import styles from './header.module.scss';
import theme from '../../../styles/theme.module.scss';
import { GoIcon } from '../../common/icons/go';
import { Button } from '../../common/button';

interface StringByString {
  [key: string]: string;
}
const pathToTitle: StringByString = {
  '/register': 'Register',
  '/login': 'Login',
  '/select-credential': 'Select Credentials',
  '/view-credential': 'My Credentials',
  '/ethereum-login': 'Ethereum Login',
  '/semaphore': 'Semaphore',
};

export const Header = ({
  path,
  onBack,
}: {
  path: string;
  onBack?: () => void;
}) => {
  return (
    <>
      {pathToTitle[path] && (
        <div className={styles.header + ' ' + theme.theme_light}>
            {onBack && <Button icon={GoIcon} onClick={onBack}/>}
          <h1>{pathToTitle[path]}</h1>
        </div>
      )}
    </>
  );
};
