import styles from './actionScreen.module.scss';
import { Button } from '../../common/button';
import { Container, FlexSpace } from '../../common/container';
import { ConnectionCard } from '../connectionsCard'
import { Logo } from '../../common/icons/logo'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router';

export const LoginScreen = ({ nationID, walletAddr }: {
    nationID: string;
    walletAddr: string;
    // connectFido: () => void;
    // viewCredential: () => void;
}) => {

    interface Step {
        message: string;
        instructions: string;
        center?: {
            fidoState?: number;
            walletState?: number;
            bindState?: number;
        }
        qrCode?: string;
        cta?: {
            text: string;
            onClick: () => void;
            icon?: string;
        };
    }

    const steps = {
        connectFido: {
            message: 'You have bind your wallet to your nation identity.',
            instructions: 'Please login with TW-Fido to access your credentials',
            center: {
                bindState: 1,
            },
            cta: {
                text: 'Connect TW Fido',
                onClick: connectFido,
                icon: 'FidoIcon',
            }
        },
        displayQR: {
            message: 'Scan this QR code on TW FidO mobile app.',
            qrCode: 'https://www.qrcode-monkey.com/img/qrcode.svg',
            instructions: 'or click the push notification on your mobile phone',
        },
        connectFidoFailed: {
            message: 'Authenticate failed!',
            instructions: 'Please try again.',
            center: {
                fidoState: 3,
                walletState: 0,
            },
            cta: {
                text: 'Connect TW Fido',
                onClick: connectFido,
                icon: 'FidoIcon',
            }
        },
        viewCredential: {
            message: 'Successfully bound to your nation identity.',
            instructions: 'Your credentials are generated. View it now!',
            center: { bindState: 1 },
            cta: {
                text: 'View Credential',
                onClick: viewCredential,
                icon: 'GoIcon',
            }
        },
    }

    function connectFido() {
        console.log('connectFido')
        setloginState(steps.viewCredential)
    }

    const navigate = useNavigate()

    function viewCredential() {
        navigate({ to: '/select-credential' })
    }

    const [loginState, setloginState] = useState<Step>(steps.connectFido)

    const { center, qrCode, cta, message, instructions } = loginState

    return <div className={styles.ActionScreen}>
        <Container>
            <FlexSpace />
            <div className={styles.Message}>{message}</div>
            <div className={styles.Center}>{(center) ? <ConnectionCard
                {...center}
                nationID={nationID}
                walletAddr={walletAddr}
            /> : (qrCode) ? <img src={qrCode} /> : <Logo />}</div>

            <FlexSpace />
            {instructions && <div className={styles.Instructions}>{instructions}</div>}
            {cta && <Button onClick={cta.onClick}>
                {cta.text}
                {cta.icon && <cta.icon />}
            </Button>}
        </Container>

    </div>
}