import { AppWorkflowStep, PROPS_FOR_STEP } from "src/AppWorkflowStep";

interface IAppStepLinkProps {
    step: AppWorkflowStep;
    className?: string;
    linkText?: string;
}

export function AppStepLink(props: IAppStepLinkProps) {
    const { step, className } = props;
    const propsForStep = PROPS_FOR_STEP[step];
    const linkText = props.linkText === undefined ? propsForStep.heading: props.linkText;
    return <a href={"#" + propsForStep.id} className={className}>{linkText}</a>;
}
