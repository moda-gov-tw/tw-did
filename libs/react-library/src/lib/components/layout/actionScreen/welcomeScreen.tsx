import { BackgroundContainer } from '../../common/background'
import { Container, FlexSpace } from '../../common/container'
import { Logo } from '../../common/icons/logo'
import styles from './layout.module.scss';
import theme from '../../../styles/theme.module.scss'
import { Input } from '../../common/input'
import { GoIcon } from '../../common/icons/go'
import { useState } from 'react'
import { Button } from '../../common/button'
import { useNavigate } from '@tanstack/react-router'

export const WelcomeScreen = () => {
    const [nationID, setNationID] = useState<string>('')
    const navigate = useNavigate()

    function handleGo() {


        // query the nation ID
        let nationIDExists = false
        if (nationIDExists)
            navigate({ to: '/login' })
        else
            navigate({ to: '/register' })

    }

    return <BackgroundContainer>
        <Container>
            <div className={styles.ActionScreen}>
                <FlexSpace />
                <div className={styles.Center}>
                    <Logo />
                </div >

                <div>
                    <h1 className={styles.textLarge}>Welcome!</h1>
                    <p className={styles.Instructions}>
                        Please enter your nation ID to get started.
                    </p>
                    <Input placeholder='Nation ID' commitValue={setNationID} />
                    <Button onClick={handleGo} icon={GoIcon} text='Go' />
                </div>
            </div >
        </Container>
    </BackgroundContainer>
}