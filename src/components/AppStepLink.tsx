import { AppWorkflowStep, PROPS_FOR_STEP } from "src/AppWorkflowStep";

interface IAppStepLinkProps {
    step: AppWorkflowStep;
    className?: string;
    linkText?: string;
}

export function AppStepLink(props: IAppStepLinkProps) {
    const { step, className } = props;
    const propsForStep = PROPS_FOR_STEP[step];
    let linkText = props.linkText !== undefined ? props.linkText : propsForStep.heading;
    return <a href={"#" + propsForStep.id} className={className}>{linkText}</a>;
}
