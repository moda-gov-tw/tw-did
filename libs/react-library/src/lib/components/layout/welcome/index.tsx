import { BackgroundContainer } from '../../common/background'
import { Container, FlexSpace } from '../../common/container'
import { Logo } from '../../common/icons/logo'
import styles from './welcome.module.scss'
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

    return <div className={styles.Welcome}>
        <BackgroundContainer>
            <Container>

                <FlexSpace />
                <Logo />
                <FlexSpace />

                <div className={styles.Welcome__text}>
                    <h1 className={theme.text_extraLarge}>Welcome!</h1>
                    <p className={theme.text_instruction}>
                        Please enter your nation ID to get started.
                    </p>
                    <Input placeholder='Nation ID' commitValue={setNationID} />
                    <Button onClick={handleGo}>
                        Go
                        <GoIcon />
                    </Button>
                </div>

            </Container>
            </BackgroundContainer>
    </div>
}