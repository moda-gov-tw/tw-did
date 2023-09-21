import styles from './stepIndicator.module.scss';
export const StepIndicator = ({ stepCount, currentStep }: {
    stepCount: number,
    currentStep: number
}) => <div className={styles.StepIndicator}>
        {Array.from(Array(stepCount), (e, i) => {
            const stepClass = i === currentStep ? styles.CurrentStep : styles.Step;
            return <div className={stepClass} key={i} />;
        })}
    </div>;
