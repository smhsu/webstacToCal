import { PropsWithChildren } from "react";
import { AppWorkflowStep, PROPS_FOR_STEP } from "src/AppWorkflowStep";

interface IAppStepLinkProps {
    step: AppWorkflowStep;
    className?: string;
}

export function AppStepLink(props: PropsWithChildren<IAppStepLinkProps>) {
    const { step, className } = props;
    const propsForStep = PROPS_FOR_STEP[step];
    const children = props.children || propsForStep.heading;
    return <a href={"#" + propsForStep.id} className={className}>{children}</a>;
}
