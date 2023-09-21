import { ConnectionCard } from '../connectionsCard'
import { Logo } from '../../common/icons/logo'
import { useState } from 'react'
import { ReactNode } from 'react';
import { StepIndicator } from '../../common/stepIndicator';
import styles from './actionScreen.module.scss';
import { Button } from '../../common/button';
import { Container, FlexSpace } from '../../common/container';
import { useNavigate } from '@tanstack/react-router';

export const RegisterScreen = ({ nationID }: {
    nationID: string;
    // walletAddr?: string;
    // connectFido: () => void;
    // connectWallet: () => void;
    // bind: () => void;
    // viewCredential: () => void;
}) => {

    interface Step {
        currentStep: number;
        message: string;
        instructions: string;
        center?: {
            fidoState?: number;
            walletState?: number;
            bindState?: number;
        }
        qrCode?: string;
        cta: {
            text: string;
            onClick: () => void;
            icon?: string;
        };
    }

    const steps = {
        connectFido: {
            currentStep: 0,
            message: 'There are no wallet bound with your nation ID.',
            instructions: 'Please login with TW-Fido to bind them.',
            center: {
                fidoState: 1,
                walletState: 0,
            },
            cta: {
                text: 'Connect TW Fido',
                onClick: connectFido,
                icon: 'FidoIcon',
            }
        },
        displayQR: {
            currentStep: 0,
            message: 'Scan this QR code on TW FidO mobile app.',
            qrCode: 'https://www.qrcode-monkey.com/img/qrcode.svg',
            instructions: 'or click the push notification on your mobile phone',
        },
        connectFidoFailed: {
            currentStep: 0,
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
        connectWallet: {
            currentStep: 1,
            message: 'Successfully connected to your TW-Fido.',
            instructions: 'Please sign in with ethereum and bind it to your nation identity.',
            center: {
                fidoState: 2,
                walletState: 1,
            },
            cta: {
                text: 'Connect Wallet',
                onClick: connectWallet,
                icon: 'EthIcon',
            }
        },
        connectWalletFailed: {
            currentStep: 1,
            message: 'User injected!',
            instructions: 'Please try again.',
            center: {
                fidoState: 2,
                walletState: 3,
            },
            cta: {
                text: 'Connect Wallet',
                onClick: connectWallet,
                icon: 'EthIcon',
            }
        },
        binding: {
            currentStep: 2,
            message: 'All the information you need has been prepared.',
            instructions: 'Please confirm the information and bind your wallet.',
            center: {
                fidoState: 2,
                walletState: 2,
            },
            cta: {
                text: 'Bind',
                onClick: bind,
                icon: 'EthIcon',
            }
        },
        bindingFailed: {
            currentStep: 2,
            message: 'Binding failed!',
            instructions: 'Please try again.',
            center: { bindState: 2 },
            cta: {
                text: 'Bind',
                onClick: bind,
                icon: 'EthIcon',
            }
        },
        viewCredential: {
            currentStep: 3,
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
        setRegState(steps.connectWallet)
    }

    function connectWallet() {
        /* TODO: get from wallet */
        setWalletAddr('0x1234567890123456789012345678901234567890')
        setRegState(steps.binding)
    }

    function bind() {
        setRegState(steps.viewCredential)
    }

    const navigate = useNavigate()
    function viewCredential() {
        navigate({ to: '/select-credential' })
    }

    const [walletAddr, setWalletAddr] = useState<string>('')
    const [regState, setRegState] = useState<Step>(steps.connectFido)

    const { center, qrCode, cta, currentStep, message, instructions, } = regState

    const shortenAddr = (addr: string) => addr.slice(0, 6) + '...' + addr.slice(-4)

    return <div className={styles.ActionScreen}>
        <Container>
            <StepIndicator stepCount={4} currentStep={currentStep} />

            <FlexSpace />
            <div className={styles.Message}>{message}</div>
            <div className={styles.Center}>{(center) ? <ConnectionCard
                {...center}
                nationID={nationID}
                walletAddr={shortenAddr(walletAddr)}
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